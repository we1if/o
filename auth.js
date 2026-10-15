// ---------------- 账号 & 云同步 ----------------
const AUTH_KEYS = { token: "bczf_token", username: "bczf_username", api: "bczf_api" };

function getToken() { return localStorage.getItem(AUTH_KEYS.token) || ""; }
function getMyUsername() { return localStorage.getItem(AUTH_KEYS.username) || ""; }
function getApiUrl() {
  // 默认用已部署的官方后端；用户在登录页"服务器设置"里填过则以填的为准
  return (localStorage.getItem(AUTH_KEYS.api) || "https://bczf-backend.p50630759.workers.dev").replace(/\/$/, "");
}
function setAuth(token, username) {
  localStorage.setItem(AUTH_KEYS.token, token);
  localStorage.setItem(AUTH_KEYS.username, username);
}
function clearAuth(keepData) {
  localStorage.removeItem(AUTH_KEYS.token);
  localStorage.removeItem(AUTH_KEYS.username);
  if (!keepData) localStorage.removeItem("bczf");
}

async function api(method, path, body) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = "Bearer " + token;
  const res = await fetch(getApiUrl() + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "HTTP " + res.status);
  return data;
}

// 云同步：save() 里防抖 1.5s 后推送；打开 App 时拉取合并
let syncTimer = null;
let syncState = "idle"; // idle | syncing | synced | error
let syncErr = "";
function queueCloudSync() {
  if (!getToken()) return;
  syncState = "syncing";
  updateSyncBadge();
  clearTimeout(syncTimer);
  syncTimer = setTimeout(async () => {
    try {
      state._syncedAt = now();
      await api("PUT", "/api/data", { data: JSON.stringify(state) });
      syncState = "synced";
      syncErr = "";
    } catch (e) {
      syncState = "error";
      syncErr = e.message;
      console.warn("云同步失败：", e.message); // 原因只进控制台，不上UI
    }
    updateSyncBadge();
  }, 1500);
}
function updateSyncBadge() {
  const el = document.querySelector("#syncBadge");
  if (!el) return;
  el.textContent = { idle: "", syncing: "☁ 同步中…", synced: "✓ 已云同步", error: "⚠ 云同步失败" }[syncState] || "";
  el.style.color = syncState === "error" ? "#c0392b" : "var(--sub)";
}

// 登录后的数据合并：服务器有数据→以服务器为准；服务器为空→把本地推上去
async function adoptServerData() {
  const r = await api("GET", "/api/data");
  if (r.data) {
    const serverState = JSON.parse(r.data);
    if (serverState && Array.isArray(serverState.friends)) {
      state = serverState;
      load(); // 跑一遍兜底自检
      return "server";
    }
  }
  state._syncedAt = now();
  await api("PUT", "/api/data", { data: JSON.stringify(state) });
  return "local-pushed";
}

// ---------------- 登录/注册界面 ----------------
function renderAuthScreen(mode) {
  mode = mode || "login";
  const isRegister = mode === "register";
  app.innerHTML = `
    <div class="auth-wrap">
      <div class="auth-card">
        <div class="auth-logo">🍳</div>
        <div class="auth-title">拜托吃早饭</div>
        <div class="auth-sub">${isRegister ? "注册一个账号，数据云端同步" : "登录你的账号"}</div>
        <div class="me-row">
          <span class="me-label">用户名</span>
          <input id="authUser" class="me-input" placeholder="2-20位，中英文都行，可被搜索" maxlength="20">
        </div>
        <div class="me-row">
          <span class="me-label">密码</span>
          <input id="authPass" class="me-input" type="password" placeholder="至少 6 位" maxlength="64">
        </div>
        <button class="as-btn primary" id="authGo" style="width:100%">${isRegister ? "🎉 创建账号" : "登录"}</button>
        <div class="auth-err" id="authErr"></div>
        <div class="auth-switch">${isRegister ? "已经有账号了？" : "还没有账号？"}<span id="authToggle">${isRegister ? "去登录" : "去注册"}</span></div>
        <details class="auth-adv">
          <summary>服务器设置（部署后填一次）</summary>
          <input id="authApi" class="me-input" placeholder="https://xxx.workers.dev" value="${esc(getApiUrl())}">
          <div class="as-tip">粘贴你的 Cloudflare Worker 地址，保存后自动生效</div>
        </details>
      </div>
    </div>
  `;

  app.querySelector("#authToggle").onclick = () => renderAuthScreen(isRegister ? "login" : "register");
  app.querySelector("#authApi").onchange = (e) => {
    localStorage.setItem(AUTH_KEYS.api, e.target.value.trim());
  };
  const go = app.querySelector("#authGo");
  const errEl = app.querySelector("#authErr");
  const doAuth = async () => {
    const username = app.querySelector("#authUser").value.trim();
    const password = app.querySelector("#authPass").value;
    if (!getApiUrl()) { errEl.textContent = "先在下方“服务器设置”里填 Worker 地址"; return; }
    go.disabled = true;
    go.textContent = "连接中…";
    try {
      const r = await api("POST", isRegister ? "/api/register" : "/api/login", { username, password });
      setAuth(r.token, r.username);
      if (isRegister || !r.hasData) {
        // 新账号：把本地数据推上去（老玩家无缝迁移）
        state._syncedAt = now();
        await api("PUT", "/api/data", { data: JSON.stringify(state) }).catch(() => {});
      } else {
        // 老账号：比较本地和服务器谁更新，新的赢（防止重登丢数据）
        const d = await api("GET", "/api/data");
        const serverState = d.data ? JSON.parse(d.data) : null;
        const serverAt = (serverState && serverState._syncedAt) || d.updated_at || 0;
        if ((state._syncedAt || 0) >= serverAt) {
          await api("PUT", "/api/data", { data: JSON.stringify(state) }).catch(() => {});
        } else if (serverState && Array.isArray(serverState.friends)) {
          state = serverState;
        }
      }
      load();
      render();
    } catch (e) {
      errEl.textContent = e.message;
      go.disabled = false;
      go.textContent = isRegister ? "🎉 创建账号" : "登录";
    }
  };
  go.onclick = doAuth;
  app.querySelector("#authPass").onkeydown = (e) => { if (e.key === "Enter") doAuth(); };
}