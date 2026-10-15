// 拜托吃早饭 · 后端 Worker（D1 版）
// 接口：
//   POST /api/register  {username, password} -> {token, username}
//   POST /api/login     {username, password} -> {token, username, hasData}
//   GET  /api/data      (需 Bearer token)     -> {data, updated_at}
//   PUT  /api/data      {data}                -> {ok, updated_at}
//   POST /api/logout    (需 Bearer token)     -> {ok}
//   GET  /api/me        (需 Bearer token)     -> {username}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

function cors(response) {
  for (const [k, v] of Object.entries(CORS_HEADERS)) response.headers.set(k, v);
  return response;
}
function json(obj, status = 200) {
  return cors(new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  }));
}

// PBKDF2 密码哈希
async function hashPassword(password, salt) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: enc.encode(salt), iterations: 100000, hash: "SHA-256" },
    key, 256
  );
  return [...new Uint8Array(bits)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
function randToken() {
  return crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");
}
const USERNAME_RE = /^[一-龥a-zA-Z0-9_]{2,20}$/;

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return cors(new Response(null, { status: 204 }));
    const url = new URL(request.url);
    const path = url.pathname;

    if (!env.DB) return json({ error: "D1 数据库未绑定（检查 Worker 的 Variables and Bindings）" }, 500);

    // 建表（幂等）
    try {
      await env.DB.batch([
        env.DB.prepare("CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, username TEXT UNIQUE NOT NULL, salt TEXT NOT NULL, hash TEXT NOT NULL, created_at INTEGER NOT NULL)"),
        env.DB.prepare("CREATE TABLE IF NOT EXISTS tokens (token TEXT PRIMARY KEY, user_id TEXT NOT NULL, created_at INTEGER NOT NULL)"),
        env.DB.prepare("CREATE TABLE IF NOT EXISTS user_data (user_id TEXT PRIMARY KEY, data TEXT NOT NULL, updated_at INTEGER NOT NULL)"),
        env.DB.prepare("CREATE TABLE IF NOT EXISTS friend_requests (id INTEGER PRIMARY KEY AUTOINCREMENT, from_user TEXT NOT NULL, to_user TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending', created_at INTEGER NOT NULL, UNIQUE(from_user, to_user))"),
        env.DB.prepare("CREATE TABLE IF NOT EXISTS friendships (a TEXT NOT NULL, b TEXT NOT NULL, created_at INTEGER NOT NULL, UNIQUE(a, b))"),
        env.DB.prepare("CREATE TABLE IF NOT EXISTS dm_messages (id INTEGER PRIMARY KEY AUTOINCREMENT, sender TEXT NOT NULL, receiver TEXT NOT NULL, text TEXT NOT NULL, created_at INTEGER NOT NULL)"),
        env.DB.prepare("CREATE TABLE IF NOT EXISTS gc_groups (id TEXT PRIMARY KEY, name TEXT NOT NULL, owner TEXT NOT NULL, members TEXT NOT NULL, ai_members TEXT NOT NULL DEFAULT '[]', created_at INTEGER NOT NULL)"),
        env.DB.prepare("CREATE TABLE IF NOT EXISTS gc_messages (id INTEGER PRIMARY KEY AUTOINCREMENT, group_id TEXT NOT NULL, sender TEXT NOT NULL, text TEXT NOT NULL, created_at INTEGER NOT NULL)"),
      ]);
    } catch (e) {
      return json({ error: "建表失败: " + e.message }, 500);
    }

    // ---------- 注册 ----------
    if (path === "/api/register" && request.method === "POST") {
      const body = await request.json().catch(() => ({}));
      const username = String(body.username || "").trim();
      const password = String(body.password || "");
      if (!USERNAME_RE.test(username)) return json({ error: "用户名需 2-20 位（中文/字母/数字/下划线）" }, 400);
      if (password.length < 6) return json({ error: "密码至少 6 位" }, 400);

      const exists = await env.DB.prepare("SELECT id FROM users WHERE username = ?").bind(username).first();
      if (exists) return json({ error: "这个用户名已被占用" }, 409);

      const salt = crypto.randomUUID();
      const hash = await hashPassword(password, salt);
      const userId = crypto.randomUUID();
      await env.DB.batch([
        env.DB.prepare("INSERT INTO users (id, username, salt, hash, created_at) VALUES (?, ?, ?, ?, ?)")
          .bind(userId, username, salt, hash, Date.now()),
        env.DB.prepare("INSERT INTO tokens (token, user_id, created_at) VALUES (?, ?, ?)")
          .bind(randToken(), userId, Date.now()),
      ]);
      const tokenRow = await env.DB.prepare("SELECT token FROM tokens WHERE user_id = ? ORDER BY created_at DESC LIMIT 1").bind(userId).first();
      return json({ token: tokenRow.token, username });
    }

    // ---------- 登录 ----------
    if (path === "/api/login" && request.method === "POST") {
      const body = await request.json().catch(() => ({}));
      const username = String(body.username || "").trim();
      const password = String(body.password || "");
      const user = await env.DB.prepare("SELECT id, salt, hash FROM users WHERE username = ?").bind(username).first();
      if (!user) return json({ error: "用户不存在" }, 401);
      const hash = await hashPassword(password, user.salt);
      if (hash !== user.hash) return json({ error: "密码错误" }, 401);
      const token = randToken();
      await env.DB.prepare("INSERT INTO tokens (token, user_id, created_at) VALUES (?, ?, ?)").bind(token, user.id, Date.now()).run();
      const dataRow = await env.DB.prepare("SELECT data FROM user_data WHERE user_id = ?").bind(user.id).first();
      return json({ token, username, hasData: !!dataRow });
    }

    // ---------- 以下需要登录 ----------
    const authHeader = request.headers.get("Authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    let userId = null;
    if (token) {
      const row = await env.DB.prepare("SELECT user_id FROM tokens WHERE token = ?").bind(token).first();
      userId = row ? row.user_id : null;
    }

    if (path === "/api/me" && request.method === "GET") {
      if (!userId) return json({ error: "未登录" }, 401);
      const u = await env.DB.prepare("SELECT username FROM users WHERE id = ?").bind(userId).first();
      return json({ username: u ? u.username : "?" });
    }

    if (path === "/api/logout" && request.method === "POST") {
      if (token) await env.DB.prepare("DELETE FROM tokens WHERE token = ?").bind(token).run();
      return json({ ok: true });
    }

    if (path === "/api/data" && request.method === "GET") {
      if (!userId) return json({ error: "未登录" }, 401);
      const row = await env.DB.prepare("SELECT data, updated_at FROM user_data WHERE user_id = ?").bind(userId).first();
      return json({ data: row ? row.data : null, updated_at: row ? row.updated_at : null });
    }

    if (path === "/api/data" && request.method === "PUT") {
      if (!userId) return json({ error: "未登录" }, 401);
      const body = await request.json().catch(() => ({}));
      const data = typeof body.data === "string" ? body.data : JSON.stringify(body.data || {});
      if (data.length > 900000) return json({ error: "数据过大（>900KB）" }, 413);
      const ts = Date.now();
      await env.DB.prepare(
        "INSERT INTO user_data (user_id, data, updated_at) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at"
      ).bind(userId, data, ts).run();
      return json({ ok: true, updated_at: ts });
    }

    // ---------- 真人社交（需要登录，me = 当前用户名） ----------
    let me = null;
    if (userId) {
      const u = await env.DB.prepare("SELECT username FROM users WHERE id = ?").bind(userId).first();
      me = u ? u.username : null;
    }

    // 搜索用户
    if (path === "/api/users/search" && request.method === "GET") {
      if (!me) return json({ error: "未登录" }, 401);
      const q = url.searchParams.get("q") || "";
      if (!q.trim()) return json({ users: [] });
      const rows = await env.DB.prepare("SELECT username FROM users WHERE username LIKE ? AND username != ? LIMIT 10")
        .bind("%" + q + "%", me).all();
      return json({ users: (rows.results || []).map((r) => r.username) });
    }

    // 发好友申请
    if (path === "/api/friends/request" && request.method === "POST") {
      if (!me) return json({ error: "未登录" }, 401);
      const body = await request.json().catch(() => ({}));
      const to = String(body.to || "").trim();
      if (!to || to === me) return json({ error: "无效的用户" }, 400);
      const target = await env.DB.prepare("SELECT id FROM users WHERE username = ?").bind(to).first();
      if (!target) return json({ error: "用户不存在" }, 404);
      const a = me < to ? me : to, b = me < to ? to : me;
      const fr = await env.DB.prepare("SELECT 1 FROM friendships WHERE a = ? AND b = ?").bind(a, b).first();
      if (fr) return json({ error: "已经是好友了" }, 409);
      const pend = await env.DB.prepare("SELECT id, from_user FROM friend_requests WHERE (from_user = ? AND to_user = ?) OR (from_user = ? AND to_user = ?)")
        .bind(me, to, to, me).first();
      if (pend) {
        // 对方之前先申请过我 → 直接成为好友
        if (pend.from_user === to) {
          await env.DB.batch([
            env.DB.prepare("UPDATE friend_requests SET status = 'accepted' WHERE id = ?").bind(pend.id),
            env.DB.prepare("INSERT OR IGNORE INTO friendships (a, b, created_at) VALUES (?, ?, ?)").bind(a, b, Date.now()),
          ]);
          return json({ ok: true, accepted: true });
        }
        return json({ ok: true, note: "申请已发过，等对方同意" });
      }
      await env.DB.prepare("INSERT INTO friend_requests (from_user, to_user, status, created_at) VALUES (?, ?, 'pending', ?)")
        .bind(me, to, Date.now()).run();
      return json({ ok: true });
    }

    // 收到的申请列表
    if (path === "/api/friends/requests" && request.method === "GET") {
      if (!me) return json({ error: "未登录" }, 401);
      const rows = await env.DB.prepare("SELECT from_user, created_at FROM friend_requests WHERE to_user = ? AND status = 'pending' ORDER BY created_at DESC")
        .bind(me).all();
      return json({ requests: rows.results || [] });
    }

    // 同意申请
    if (path === "/api/friends/accept" && request.method === "POST") {
      if (!me) return json({ error: "未登录" }, 401);
      const body = await request.json().catch(() => ({}));
      const from = String(body.from || "").trim();
      const row = await env.DB.prepare("SELECT id FROM friend_requests WHERE from_user = ? AND to_user = ? AND status = 'pending'")
        .bind(from, me).first();
      if (!row) return json({ error: "没有这条申请" }, 404);
      const a = me < from ? me : from, b = me < from ? from : me;
      await env.DB.batch([
        env.DB.prepare("UPDATE friend_requests SET status = 'accepted' WHERE id = ?").bind(row.id),
        env.DB.prepare("INSERT OR IGNORE INTO friendships (a, b, created_at) VALUES (?, ?, ?)").bind(a, b, Date.now()),
      ]);
      return json({ ok: true });
    }

    // 好友列表
    if (path === "/api/friends" && request.method === "GET") {
      if (!me) return json({ error: "未登录" }, 401);
      const rows = await env.DB.prepare("SELECT CASE WHEN a = ? THEN b ELSE a END AS friend FROM friendships WHERE a = ? OR b = ?")
        .bind(me, me, me).all();
      return json({ friends: (rows.results || []).map((r) => r.friend) });
    }

    // 真人私聊：发
    if (path === "/api/dm/send" && request.method === "POST") {
      if (!me) return json({ error: "未登录" }, 401);
      const body = await request.json().catch(() => ({}));
      const to = String(body.to || "").trim();
      const text = String(body.text || "").slice(0, 2000);
      if (!to || !text.trim()) return json({ error: "参数缺失" }, 400);
      const a = me < to ? me : to, b = me < to ? to : me;
      const fr = await env.DB.prepare("SELECT 1 FROM friendships WHERE a = ? AND b = ?").bind(a, b).first();
      if (!fr) return json({ error: "只能给好友发消息" }, 403);
      await env.DB.prepare("INSERT INTO dm_messages (sender, receiver, text, created_at) VALUES (?, ?, ?, ?)")
        .bind(me, to, text, Date.now()).run();
      return json({ ok: true });
    }

    // 真人私聊：拉取（after = 上次最大的消息 id）
    if (path === "/api/dm" && request.method === "GET") {
      if (!me) return json({ error: "未登录" }, 401);
      const other = url.searchParams.get("with") || "";
      const after = parseInt(url.searchParams.get("after") || "0", 10);
      if (!other) return json({ error: "参数缺失" }, 400);
      const rows = await env.DB.prepare("SELECT id, sender, text, created_at FROM dm_messages WHERE ((sender = ? AND receiver = ?) OR (sender = ? AND receiver = ?)) AND id > ? ORDER BY id ASC LIMIT 100")
        .bind(me, other, other, me, after).all();
      return json({ messages: rows.results || [] });
    }

    // ---------- 混编群（真人+AI，需要登录） ----------
    // 建群：members = 真人用户名数组；ai = [{id,name,emoji}]
    if (path === "/api/gc/create" && request.method === "POST") {
      if (!me) return json({ error: "未登录" }, 401);
      const body = await request.json().catch(() => ({}));
      const name = String(body.name || "").trim().slice(0, 30) || "英语修罗场";
      const members = Array.isArray(body.members) ? body.members.map(String).filter((u) => u && u !== me) : [];
      const ai = Array.isArray(body.ai) ? body.ai.filter((c) => c && c.id && c.name).slice(0, 10) : [];
      if (members.length + ai.length < 2) return json({ error: "成员太少，至少凑 2 个（含AI）" }, 400);
      for (const u of members) {
        const exists = await env.DB.prepare("SELECT id FROM users WHERE username = ?").bind(u).first();
        if (!exists) return json({ error: `用户 ${u} 不存在` }, 404);
      }
      const gid = "gc-" + crypto.randomUUID().slice(0, 12);
      await env.DB.prepare("INSERT INTO gc_groups (id, name, owner, members, ai_members, created_at) VALUES (?, ?, ?, ?, ?, ?)")
        .bind(gid, name, me, JSON.stringify(members), JSON.stringify(ai), Date.now()).run();
      return json({ ok: true, id: gid });
    }

    // 我参与的群列表
    if (path === "/api/gc/list" && request.method === "GET") {
      if (!me) return json({ error: "未登录" }, 401);
      const rows = await env.DB.prepare("SELECT id, name, owner, members, ai_members FROM gc_groups WHERE owner = ? OR members LIKE ? ORDER BY created_at DESC")
        .bind(me, `%"${me}"%`).all();
      const groups = [];
      for (const row of rows.results || []) {
        const last = await env.DB.prepare("SELECT MAX(id) AS maxid FROM gc_messages WHERE group_id = ?").bind(row.id).first();
        groups.push({
          id: row.id, name: row.name, owner: row.owner,
          members: JSON.parse(row.members || "[]"),
          aiMembers: JSON.parse(row.ai_members || "[]"),
          lastId: last ? last.maxid || 0 : 0,
        });
      }
      return json({ groups });
    }

    // 拉群消息（校验成员身份）
    if (path === "/api/gc/messages" && request.method === "GET") {
      if (!me) return json({ error: "未登录" }, 401);
      const gid = url.searchParams.get("group_id") || "";
      const after = parseInt(url.searchParams.get("after") || "0", 10);
      const row = await env.DB.prepare("SELECT name, owner, members, ai_members FROM gc_groups WHERE id = ?").bind(gid).first();
      if (!row) return json({ error: "群不存在" }, 404);
      const members = JSON.parse(row.members || "[]");
      if (row.owner !== me && !members.includes(me)) return json({ error: "不是群成员" }, 403);
      const msgs = await env.DB.prepare("SELECT id, sender, text, created_at FROM gc_messages WHERE group_id = ? AND id > ? ORDER BY id ASC LIMIT 100")
        .bind(gid, after).all();
      return json({
        messages: msgs.results || [],
        name: row.name, owner: row.owner,
        members, aiMembers: JSON.parse(row.ai_members || "[]"),
      });
    }

    // 发群消息（房主可用 as="ai:角色id" 代AI发言）
    if (path === "/api/gc/send" && request.method === "POST") {
      if (!me) return json({ error: "未登录" }, 401);
      const body = await request.json().catch(() => ({}));
      const gid = String(body.group_id || "");
      const text = String(body.text || "").slice(0, 2000);
      if (!gid || !text.trim()) return json({ error: "参数缺失" }, 400);
      const row = await env.DB.prepare("SELECT owner, members FROM gc_groups WHERE id = ?").bind(gid).first();
      if (!row) return json({ error: "群不存在" }, 404);
      const members = JSON.parse(row.members || "[]");
      const isOwner = row.owner === me;
      if (!isOwner && !members.includes(me)) return json({ error: "不是群成员" }, 403);
      let sender = me;
      if (body.as && String(body.as).startsWith("ai:")) {
        if (!isOwner) return json({ error: "只有房主能代AI发言" }, 403);
        sender = String(body.as);
      }
      const ins = await env.DB.prepare("INSERT INTO gc_messages (group_id, sender, text, created_at) VALUES (?, ?, ?, ?)")
        .bind(gid, sender, text, Date.now()).run();
      return json({ ok: true, id: ins.meta && ins.meta.last_row_id });
    }

    return json({ error: "接口不存在" }, 404);
  },
};
