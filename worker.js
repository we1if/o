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
      await env.DB.prepare("INSERT INTO tokens (token, user_id, created_at) VALUES (?, ?, ?)").bind(token, user.id, Date.now());
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
      ).bind(userId, data, ts);
      return json({ ok: true, updated_at: ts });
    }

    return json({ error: "接口不存在" }, 404);
  },
};
