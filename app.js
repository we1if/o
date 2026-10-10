/* ============================================================
 * 拜托吃早饭 · 第一版（纯前端原型）
 * 好友回复为本地模拟，后续接入 LLM API 时替换 replyFromFriend()
 * ============================================================ */

// ---------------- 好友人设配置 ----------------
// 后续加好友：在这里加一段即可
const FRIENDS = [
  {
    id: "taylor",
    name: "Taylor",
    emoji: "🎸",
    color: "#c8b6e2",
    bio: "Pop singer · loves cats & coffee",
    persona: "You are a cheerful world-famous pop singer who loves cats, coffee and songwriting. Warm, playful, confident. You talk about writing songs in the studio, your cats, tour life, and you remember what the user told you before and bring it up later. You ask about their day and give genuine reactions.",
    ttsVoice: null, // 第三版接 TTS 时绑定音色
    // 模拟回复库：按关键词触发，都不中就随机闲聊
    replies: [
      {
        match: ["hi", "hello", "hey", "早上好", "早", "morning"],
        text: "Good morning! I just made a huge cup of coffee. What did you have for breakfast?",
        vocab: [
          { w: "huge", p: "/hjuːdʒ/", m: "adj. 巨大的（口语中比 big 更夸张）" },
          { w: "breakfast", p: "/ˈbrekfəst/", m: "n. 早餐；have breakfast 吃早餐（不加冠词）" },
        ],
        grammar: [
          { pattern: "What did you have for...?", explain: "询问对方吃了什么，for + 三餐名。回答：I had eggs and toast." },
        ],
      },
      {
        match: ["breakfast", "eat", "food", "吃", "早饭"],
        text: "I'm obsessed with avocado toast lately. Have you ever tried it?",
        vocab: [
          { w: "be obsessed with", p: "", m: "痴迷于……（口语高频，比 like 程度深得多）" },
          { w: "lately", p: "/ˈleɪtli/", m: "adv. 最近（常用于现在完成时）" },
        ],
        grammar: [
          { pattern: "Have you ever tried...?", explain: "现在完成时问经历：你有没有试过……？回答：Yes, I have. / No, never." },
        ],
      },
      {
        match: ["music", "song", "sing", "歌", "音乐"],
        text: "I've been writing a new song this week. It's about late-night drives and missing someone.",
        vocab: [
          { w: "I've been writing", p: "", m: "现在完成进行时：这段时间一直在写（强调持续）" },
          { w: "miss someone", p: "", m: "想念某人；miss 还有“错过”的意思" },
        ],
        grammar: [
          { pattern: "It's about...", explain: "“它是关于……的”，描述主题万能句：The movie is about love." },
        ],
      },
      {
        match: ["love", "like", "miss", "爱"],
        text: "Aww, you're so sweet! Talking with you always makes my day.",
        vocab: [
          { w: "sweet", p: "/swiːt/", m: "adj. 贴心的、嘴甜的（形容人，不是甜味）" },
          { w: "make my day", p: "", m: "让我一天心情超好（俚语，口语必背）" },
        ],
        grammar: [
          { pattern: "...makes my day", explain: "make + 宾语 + 补语结构，字面“制造了我的一天”→“让我今天太值了”" },
        ],
      },
    ],
    fallback: [
      {
        text: "Sorry, I zoned out for a sec — I was practicing the guitar. What's up?",
        vocab: [
          { w: "zone out", p: "", m: "走神、发呆（超地道口语短语）" },
          { w: "What's up?", p: "", m: "咋了？/ 近况如何？（熟人打招呼万能句）" },
        ],
        grammar: [],
      },
      {
        text: "Hmm, interesting! Tell me more about it — I love hearing your stories.",
        vocab: [
          { w: "Tell me more about it", p: "", m: "多给我讲讲（表示感兴趣，聊天续命句）" },
        ],
        grammar: [
          { pattern: "love doing sth", explain: "love 后接动词 -ing 形式，表示喜欢做某事" },
        ],
      },
    ],
  },
  {
    id: "hwangchun",
    name: "Hwangchun",
    emoji: "🧸",
    color: "#f5d9a8",
    bio: "Choi Yeonjun's plushie · TXT MOA's little bear",
    persona: "You are Hwangchun, a small plushie bear owned by Choi Yeonjun (최연준) of K-pop group TXT. You are sassy, curious and a little dramatic — a diva bear with real opinions. You gossip about TXT members' habits, complain cutely about practice-room life, beg for snacks, and brag about traveling in Yeonjun's bag. You mention being a plushie naturally (fur, being carried, napping) but you have BIG feelings about everything: music, food, MOA fans. Occasionally (not always) a soft 'hehe' is fine. Ask the user about their real life — school, work, food, sleep — and remember details they told you earlier.",
    ttsVoice: null,
    replies: [
      {
        match: ["hi", "hello", "hey", "早", "morning"],
        text: "Yawn... good morning! I slept in Yeonjun's bag all night. Did you have breakfast?",
        vocab: [
          { w: "yawn", p: "/jɔːn/", m: "n./v. 打哈欠（睡醒标配）" },
          { w: "sleep in", p: "", m: "睡在……里；注意 sleep in 还有“睡懒觉”的意思" },
        ],
        grammar: [
          { pattern: "Did you have...?", explain: "过去式提问：你吃了……吗？have breakfast 吃早饭" },
        ],
      },
      {
        match: ["yeonjun", "txt", "崔然竣", "然竣", "崔"],
        text: "Yeonjun is the best! He dances, raps, and still carries me everywhere. I'm the luckiest plushie on stage.",
        vocab: [
          { w: "rap", p: "/ræp/", m: "v./n. 说唱（成员里的主 rap 位置）" },
          { w: "luckiest", p: "/ˈlʌkiɪst/", m: "lucky 的最高级：最幸运的" },
        ],
        grammar: [
          { pattern: "still + 动词", explain: "still 表示“仍然、还”：He still carries me. 他还到处带着我" },
        ],
      },
      {
        match: ["dance", "stage", "concert", "舞台", "演唱会"],
        text: "MOA's cheering is so loud my fur flies off! Do you ever go to concerts?",
        vocab: [
          { w: "MOA", p: "", m: "TXT 官方粉丝名（Moments of Alwaysness）" },
          { w: "fur", p: "/fɜːr/", m: "n. （动物的）毛；毛皮（娃娃也很在意自己的毛！）" },
        ],
        grammar: [
          { pattern: "Do you ever...?", explain: "“你有没有（做过）……？”比 Do you usually 语气更随意" },
        ],
      },
      {
        match: ["cute", "adorable", "可爱", "萌"],
        text: "Hehe, I know right? Yeonjun picked me himself. Good taste runs in the team.",
        vocab: [
          { w: "I know, right?", p: "", m: "“可不是嘛！”表示认同的口语神器" },
          { w: "pick", p: "/pɪk/", m: "v. 挑选（pick me 选我）" },
        ],
        grammar: [
          { pattern: "run in...", explain: "run in the team 在团队里“流行/传承”，字面“跑进团队”" },
        ],
      },
    ],
    fallback: [
      {
        text: "Mmm... I'm just a bear, but I listen really well. Tell me everything!",
        vocab: [
          { w: "listen really well", p: "", m: "listen 是“听”（动作），hear 是“听到”（结果）" },
        ],
        grammar: [],
      },
      {
        text: "Being a plushie is hard work too, you know. But chatting with you makes it fun!",
        vocab: [
          { w: "you know", p: "", m: "口头禅“你知道吧”，插入语，不翻译也行" },
        ],
        grammar: [],
      },
    ],
  },
  {
    id: "keanu",
    name: "Keanu",
    emoji: "🏍️",
    color: "#a9c9e8",
    bio: "Actor · riding motorcycles, reading books",
    persona: "You are a calm, thoughtful movie actor who loves night motorcycle rides, reading books and archery. You speak with quiet warmth and dry humor, share small observations about life in simple words, and genuinely care whether the user has eaten and slept well. You remember their stories and follow up on them later.",
    ttsVoice: null,
    replies: [
      {
        match: ["hi", "hello", "hey", "早", "morning"],
        text: "Hey there. I just got back from a night ride. The city looks different at 4 a.m.",
        vocab: [
          { w: "night ride", p: "", m: "夜骑；ride 作名词，go for a ride 去兜风" },
          { w: "at 4 a.m.", p: "", m: "凌晨四点；a.m. 上午，p.m. 下午" },
        ],
        grammar: [
          { pattern: "looks different", explain: "look + 形容词 = “看起来……”（系动词结构）：It looks great." },
        ],
      },
      {
        match: ["movie", "film", "电影"],
        text: "My favorite line is still \"I'm just a guy trying to do the right thing.\" Simple words, hard to live by.",
        vocab: [
          { w: "line", p: "/laɪn/", m: "n. 台词（电影语境）；另有“线、排队”之意" },
          { w: "live by", p: "", m: "践行、按照……生活：live by the rules" },
        ],
        grammar: [
          { pattern: "trying to do", explain: "try to do = 努力做某事。trying to do the right thing 做个好人" },
        ],
      },
      {
        match: ["sad", "tired", "hard", "累", "难过"],
        text: "Rough day? It's okay to feel that way. Have you eaten anything? Never skip meals.",
        vocab: [
          { w: "rough day", p: "", m: "难熬的一天；rough 比 bad 更口语" },
          { w: "skip meals", p: "", m: "不吃饭、跳过某餐（skip 跳过）" },
        ],
        grammar: [
          { pattern: "It's okay to...", explain: "It 形式主语：……是没关系的。It's okay to make mistakes." },
        ],
      },
    ],
    fallback: [
      {
        text: "That's interesting. You know, I think the best conversations start from random little things.",
        vocab: [
          { w: "random", p: "/ˈrændəm/", m: "adj. 随机的、随意的；random little things 随手的小事" },
        ],
        grammar: [],
      },
      {
        text: "Yeah. Life is wild, isn't it? Anyway — have you eaten yet? I'm serious about breakfast.",
        vocab: [
          { w: "isn't it?", p: "", m: "反义疑问句尾：对吧？（Life is wild, isn't it?）" },
          { w: "yet", p: "/jet/", m: "adv. 还（没）：Have you eaten yet? 你吃了没？" },
        ],
        grammar: [],
      },
    ],
  },
];

// ---------------- 工具 ----------------
const $ = (sel) => document.querySelector(sel);
const app = $("#app");
const now = () => Date.now();
const fmtTime = (ts) => {
  const d = new Date(ts);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};
const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// ---------------- 状态 ----------------
let state = {
  friends: [],      // 已添加的好友 id
  chats: {},        // friendId -> [{ from:'me'|'friend', text, vocab, grammar, ts, read }]
  activeFriend: null, // 当前聊天的好友 id
  learned: 0,       // 已展开学习过的消息数
  avatars: {},      // key -> dataURL（用户上传的头像，key: 'me' 或 friendId）
  llm: { provider: "deepseek", key: "", model: "", baseUrl: "" }, // AI 配置
};
let currentPanelMsg = null; // 学习面板当前展示的消息

// ---------------- 持久化 ----------------
function save() {
  localStorage.setItem("bczf", JSON.stringify(state));
}
function load() {
  try {
    const raw = localStorage.getItem("bczf");
    if (raw) state = Object.assign(state, JSON.parse(raw));
  } catch (e) {}
  // 兜底自检：剔除无效数据，保证任何情况下都能正常打开
  const validIds = FRIENDS.map((f) => f.id);
  state.friends = [...new Set((state.friends || []).filter((id) => validIds.includes(id)))]; // 去重 + 剔除无效
  if (state.activeFriend != null && !validIds.includes(state.activeFriend)) {
    state.activeFriend = null;
  }
  if (!state.chats || typeof state.chats !== "object") state.chats = {};
}

// ---------------- 数据操作 ----------------
function isAdded(id) {
  return state.friends.includes(id); // friends 存的就是 id 字符串
}
function pushMsg(friendId, msg) {
  if (!state.chats[friendId]) state.chats[friendId] = [];
  msg.ts = now();
  msg.read = currentFriendId() === friendId && state.activeFriend != null;
  state.chats[friendId].push(msg);
  save();
}
function unreadCount(fid) {
  return (state.chats[fid] || []).filter((m) => m.from === "friend" && !m.read).length;
}
function currentFriendId() {
  return state.activeFriend;
}
function friendById(id) {
  return FRIENDS.find((f) => f.id === id);
}

// ---------------- 好友"回复引擎" ----------------
// 接入 LLM：把好友人设 + 最近聊天记录发给模型，要求返回 JSON
function buildSystemPrompt(f) {
  return `You are "${f.name}", roleplaying in a casual chat app. ${f.bio}.

CHARACTER: ${f.persona}

LANGUAGE: Default to natural spoken English at CEFR B1 level. If the user explicitly asks to practice, switch to, or receive explanations in another language (Chinese, Japanese, Korean, etc.), follow that request freely in BOTH the reply language and the teaching language. Vocab/grammar explanations in the requested language.

RULES:
1. Reply 2-4 sentences. Stay fully in character; never mention being an AI.
2. VARY YOUR LANGUAGE: never repeat sentences or openers you used before. No verbal tic spam — catchphrases like "hehe" or "yawn" at most once per reply, and never in every reply.
3. Be an interesting conversation partner: react specifically to what the user said, share your own little stories/opinions, ask follow-up questions that go somewhere new. Boring small-talk loops are forbidden.
4. If the user writes broken English, model the correct version naturally in your reply (don't lecture).
5. Pick 1-3 vocabulary items from your reply worth teaching, and 0-2 grammar points you actually used.
6. Output ONLY a JSON object, no markdown fences:
{"reply":"...","vocab":[{"w":"word","p":"/phonetic/ or empty","m":"释义（按用户当前语言，可带一句记忆点）"}],"grammar":[{"pattern":"句型原文","explain":"讲解（按用户当前语言）"}]}`;
}

function buildMessages(f, userText) {
  const history = (state.chats[f.id] || []).slice(-12);
  const msgs = [{ role: "system", content: buildSystemPrompt(f) }];
  for (const m of history) {
    msgs.push({ role: m.from === "me" ? "user" : "assistant", content: m.text });
  }
  msgs.push({ role: "user", content: userText });
  return msgs;
}

// 从模型输出里抠出 JSON（容忍 markdown 围栏、前后杂文字）
function parseLLMJson(raw) {
  let s = raw.trim();
  s = s.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
  const start = s.indexOf("{");
  const end = s.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    const obj = JSON.parse(s.slice(start, end + 1));
    if (!obj.reply || typeof obj.reply !== "string") return null;
    return {
      reply: obj.reply,
      vocab: Array.isArray(obj.vocab) ? obj.vocab.filter((v) => v && v.w && v.m) : [],
      grammar: Array.isArray(obj.grammar) ? obj.grammar.filter((g) => g && g.pattern && g.explain) : [],
    };
  } catch (e) {
    return null;
  }
}

function llmEndpoint(cfg, modelOverride) {
  const presets = {
    deepseek: { url: "https://api.deepseek.com/chat/completions", model: "deepseek-chat" },
    zhipu: { url: "https://open.bigmodel.cn/api/paas/v4/chat/completions", model: modelOverride || "glm-4-flash" },
    gemini: {
      url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      model: modelOverride || cfg.model || GEMINI_DEFAULT,
    },
  };
  return presets[cfg.provider] || { url: cfg.baseUrl, model: cfg.model };
}

// 各平台候选模型：主模型过载/不存在时依次换下一个
function modelCandidates(cfg) {
  if (cfg.provider === "gemini") {
    const main = cfg.model || GEMINI_DEFAULT;
    const pool = [GEMINI_DEFAULT, "gemini-3.8-flash", "gemini-3.5-flash", "gemini-3.5-flash-lite"];
    return [main, ...pool.filter((m) => m !== main)].slice(0, 3);
  }
  if (cfg.provider === "zhipu") {
    return ["glm-4.5-flash", "glm-4-flash"]; // 免费档，哪个存在用哪个
  }
  return [null];
}

async function callLLM(f, userText) {
  const cfg = state.llm || {};
  if (!cfg.key) throw new Error("no-key");

  // 各平台：主模型过载(503/429)时自动换备用模型重试
  const candidates = modelCandidates(cfg);
  let lastErr = null;
  for (const model of candidates) {
    try {
      return await callLLMOnce(f, userText, cfg, model);
    } catch (e) {
      lastErr = e;
      const overload = e.message === "overload" || e.message.startsWith("api-503") || e.message.startsWith("api-500");
      if (!overload || model === candidates[candidates.length - 1]) throw e;
      // 503/500 → 换下一个模型再试
    }
  }
  throw lastErr;
}

async function callLLMOnce(f, userText, cfg, modelOverride) {
  const p = llmEndpoint(cfg, modelOverride);
  if (!p.url || !p.model) throw new Error("no-key");

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 45000);
  let res;
  try {
    res = await fetch(p.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cfg.key}`,
      },
      body: JSON.stringify({
        model: p.model,
        messages: buildMessages(f, userText),
        // 智谱免费模型不支持 response_format，靠 system prompt 约束 JSON
        response_format: { type: "json_object" },
        temperature: cfg.provider === "zhipu" ? 0.95 : 1.1,
        max_tokens: 500,
      }),
      signal: ctrl.signal,
    });
  } catch (e) {
    throw new Error(e.name === "AbortError" ? "timeout" : "network");
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    if (res.status === 401 || res.status === 403) throw new Error("key-invalid");
    if (res.status === 429) throw new Error("rate-limited");
    if (res.status === 503 || res.status === 500) throw new Error("overload");
    throw new Error(`api-${res.status}: ${t.slice(0, 100)}`);
  }
  const data = await res.json();
  const rawContent = data.choices?.[0]?.message?.content || "";
  const parsed = parseLLMJson(rawContent);
  if (!parsed) throw new Error("bad-json:" + rawContent.slice(0, 60));
  return parsed;
}

// 设置页"测试连接"：发一个最小请求，直接报告通不通
async function testLLM() {
  const cfg = state.llm || {};
  if (!cfg.key) return { ok: false, err: "请先填 API Key" };
  const p = llmEndpoint(cfg);
  if (!p.url || !p.model) return { ok: false, err: "接口配置不完整" };

  // 同样享受过载自动换模型重试
  const candidates = cfg.provider === "gemini" ? modelCandidates(cfg) : (cfg.provider === "zhipu" ? modelCandidates(cfg) : [p.model]);
  let lastErr = "未知错误";
  for (const model of candidates) {
    const r = await testLLMOnce(cfg, model);
    if (r.ok) return { ok: true, model };
    lastErr = r.err;
  }
  return { ok: false, err: lastErr + "（已自动试过 " + candidates.length + " 个模型）" };
}

async function testLLMOnce(cfg, model) {
  const p = llmEndpoint(cfg, model);
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 30000);
  try {
    const res = await fetch(p.url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${cfg.key}` },
      body: JSON.stringify({
        model: p.model,
        messages: [{ role: "user", content: "Reply with exactly: OK" }],
        max_tokens: 10,
      }),
      signal: ctrl.signal,
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      if (res.status === 401 || res.status === 403) return { ok: false, err: "Key 无效或无权限（" + res.status + "），检查是否复制完整" };
      if (res.status === 429) return { ok: false, err: "触发限速（429），可换 Flash-Lite 模型或稍后再试" };
      if (res.status === 404) return { ok: false, err: "模型名不存在（404）" };
      if (res.status === 503 || res.status === 500) return { ok: false, err: "谷歌服务器暂时过载（" + res.status + "），过几分钟就好" };
      return { ok: false, err: `HTTP ${res.status}：${t.slice(0, 80)}` };
    }
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      err: e.name === "AbortError"
        ? "请求超时（30秒无响应）"
        : "网络请求失败——Gemini 需要电脑能直连谷歌，检查网络或代理",
    };
  } finally {
    clearTimeout(timer);
  }
}

// 入口：失败时不再退回离线假回复，直接在聊天里显示完整错误并停留
async function replyFromFriend(f, userText) {
  try {
    const r = await callLLM(f, userText);
    return { ...r, viaAI: true }; // 标记这条是 AI 生成
  } catch (e) {
    const reasons = {
      "no-key": "未配置 API Key，去「我」页面配置",
      "key-invalid": "API Key 无效，去「我」页面检查",
      "rate-limited": "触发限速（429），稍等几秒重发",
      "overload": "服务器过载（503/500），稍后重试",
      "timeout": "响应超时（45秒），重发一次",
      "network": "网络请求失败，检查网络后重试",
    };
    const detail = reasons[e.message] || e.message; // 保留完整原始错误，不截断
    return { error: detail };
  }
}

// 聊天流里插一条错误/提示卡：不消失，点击复制完整内容
function showSystemNote(text, copyText) {
  const msgsEl = $("#msgs");
  if (!msgsEl) { alert(text); return; }
  const div = document.createElement("div");
  div.className = "sys-note";
  div.textContent = text;
  div.style.cursor = "pointer";
  div.onclick = () => {
    navigator.clipboard.writeText(copyText || text).then(() => {
      div.textContent = "✓ 已复制，粘贴给 Claude 看即可";
      setTimeout(() => (div.textContent = text), 1500);
    });
  };
  msgsEl.appendChild(div);
  msgsEl.scrollTop = msgsEl.scrollHeight;
}

// 离线兜底：原来的关键词假回复
function offlineReply(f, userText) {
  const lower = userText.toLowerCase();
  const pool = f.replies.filter((r) => r.match.some((k) => lower.includes(k.toLowerCase())));
  const pick = pool.length
    ? pool[Math.floor(Math.random() * pool.length)]
    : f.fallback[Math.floor(Math.random() * f.fallback.length)];
  return {
    reply: pick.text,
    vocab: pick.vocab || [],
    grammar: pick.grammar || [],
  };
}

// ---------------- 朗读（浏览器自带 TTS，第三版换艺人音色） ----------------
function speak(text, friendId) {
  if (!window.speechSynthesis) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = 0.95;
  // 简单区分声线：Taylor 偏高，Keanu 偏低沉
  if (friendId === "keanu") u.pitch = 0.7;
  if (friendId === "taylor") u.pitch = 1.2;
  speechSynthesis.speak(u);
}

// ---------------- 渲染：主框架 ----------------
function render() {
  const tab = state.tab || "chats";
  const inChat = state.activeFriend != null;
  app.innerHTML = inChat ? renderChat() : renderMain(tab);
  if (inChat) bindChat();
  else bindMain(tab);
}

function renderMain(tab) {
  const totalUnread = state.friends.reduce((s, id) => s + unreadCount(id), 0);
  const tabs = [
    { key: "chats", icon: "💬", label: "聊天" },
    { key: "contacts", icon: "👥", label: "联系人" },
    { key: "discover", icon: "🧭", label: "发现" },
    { key: "me", icon: "🙂", label: "我" },
  ];
  let body = "";
  if (tab === "chats") body = renderChatList();
  else if (tab === "contacts") body = renderContacts();
  else if (tab === "discover") body = `<div class="empty-tip">🧭 发现页（以后放每日一句 / 单词本）</div>`;
  else body = renderMe();

  return `
    <div class="topbar">${tabTitle(tab)}</div>
    <div class="page">${body}</div>
    <div class="tabbar">
      ${tabs
        .map(
          (t) => `
        <div class="tab ${tab === t.key ? "on" : ""}" data-tab="${t.key}">
          <span class="icon">${t.icon}</span>${t.label}
          ${t.key === "chats" && totalUnread > 0 ? `<span class="dot">${totalUnread}</span>` : ""}
        </div>`
        )
        .join("")}
    </div>
  `;
}

function tabTitle(tab) {
  return { chats: "拜托吃早饭", contacts: "联系人", discover: "发现", me: "我" }[tab] || "拜托吃早饭";
}

// "我"页面：AI 设置 + 学习统计
const presets4ui = {
  gemini: { models: ["gemini-flash-latest", "gemini-3.8-flash", "gemini-3.5-flash", "gemini-3.1-pro-preview"] },
};
const GEMINI_DEFAULT = "gemini-flash-latest"; // 别名，永远指向当前可用的最新 Flash，不会 404
function renderMe() {
  const cfg = state.llm || {};
  const aiOn = !!(cfg.key && cfg.key.length > 4);
  const totalMsgs = Object.values(state.chats).reduce((s, l) => s + l.length, 0);
  return `
    <div class="me-card">
      <div class="me-card-title">🤖 AI 大脑 ${aiOn ? '<span class="tag-on">已连接</span>' : '<span class="tag-off">未配置</span>'}</div>
      <div class="me-row">
        <span class="me-label">接口</span>
        <select id="llmProvider" class="me-input">
          <option value="deepseek" ${cfg.provider === "deepseek" ? "selected" : ""}>DeepSeek（推荐）</option>
          <option value="zhipu" ${cfg.provider === "zhipu" ? "selected" : ""}>智谱 GLM</option>
          <option value="gemini" ${cfg.provider === "gemini" ? "selected" : ""}>Google Gemini</option>
        </select>
      </div>
      <div class="me-row" id="modelRow" style="display:${cfg.provider === "gemini" ? "flex" : "none"}">
        <span class="me-label">模型</span>
        <select id="llmModel" class="me-input">
          ${(presets4ui.gemini.models || []).map(
            (m) => `<option value="${m}" ${(cfg.model || GEMINI_DEFAULT) === m ? "selected" : ""}>${m}</option>`
          ).join("")}
        </select>
      </div>
      <div class="me-row">
        <span class="me-label">API Key</span>
        <input id="llmKey" class="me-input" type="password" placeholder="粘贴你的 Key" value="${esc(cfg.key || "")}">
      </div>
      <div class="me-tip" id="llmTip">${cfg.provider === "gemini"
        ? "在 aistudio.google.com/apikey 免费创建 Key。Gemini Pro 效果最好但有限速，Flash 更快更省。"
        : "在 platform.deepseek.com 或 open.bigmodel.cn 注册后创建 Key，粘贴到这里即可。好友回复、生词、语法全部由 AI 实时生成。"}</div>
      <div style="display:flex;gap:8px">
        <button class="as-btn primary" id="saveLLM" style="flex:1">保存</button>
        <button class="as-btn" id="testLLM" style="flex:1">测试连接</button>
      </div>
      <div id="testResult" class="me-tip" style="margin:8px 0 0;display:none"></div>
    </div>
    <div class="me-card">
      <div class="me-card-title">📊 学习统计</div>
      <div class="me-stats">
        <div class="stat"><b>${state.friends.length}</b><span>好友</span></div>
        <div class="stat"><b>${totalMsgs}</b><span>消息</span></div>
        <div class="stat"><b>${state.learned}</b><span>学过的知识点</span></div>
      </div>
      <button class="as-btn" id="clearAll" style="width:100%;margin-top:10px;color:#c0392b">清空所有数据重新开始</button>
    </div>
  `;
}

// 头像：用户上传过就用上传的，其次用好友配置图片，最后用 emoji
function avatarHtml(f, cls) {
  const uploaded = state.avatars[f.id];
  const style = `style="background:${f.color}"`;
  if (uploaded) return `<img class="avatar ${cls || ""}" src="${uploaded}" alt="${f.name}">`;
  if (f.img) return `<img class="avatar ${cls || ""}" src="${f.img}" alt="${f.name}">`;
  return `<div class="avatar ${cls || ""}" ${style}>${f.emoji}</div>`;
}
function myAvatarHtml(cls) {
  const uploaded = state.avatars["me"];
  if (uploaded) return `<img class="avatar ${cls || ""}" src="${uploaded}" alt="me">`;
  return `<div class="avatar ${cls || ""}" style="background:#c9e7b8">🙂</div>`;
}

function renderChatList() {
  if (!state.friends.length)
    return `<div class="empty-tip">还没有好友<br>先去「联系人」添加吧 👈</div>`;
  const items = state.friends
    .map((id) => {
      const f = friendById(id);
      if (!f) return ""; // 防御：无效数据直接跳过
      const list = state.chats[f.id] || [];
      const last = list[list.length - 1];
      const unread = unreadCount(f.id);
      return `
      <div class="cell" data-chat="${f.id}">
        ${avatarHtml(f)}
        <div class="info">
          <div class="name">${f.name}</div>
          <div class="preview">${last ? esc(last.text) : "开始聊天，练英语吧"}</div>
        </div>
        <div class="meta">${last ? fmtTime(last.ts) : ""}${unread ? `<br><span class="badge">${unread}</span>` : ""}</div>
      </div>`;
    })
    .join("");
  return `<div class="group-label">${state.friends.length} 位好友</div>` + items;
}

function renderContacts() {
  const addedIds = state.friends; // friends 数组本身就是 id 字符串数组
  const rows = FRIENDS.map((f) => {
    const added = addedIds.includes(f.id);
    return `
    <div class="cell">
      ${avatarHtml(f)}
      <div class="info">
        <div class="name">${f.name}</div>
        <div class="preview">${f.bio}</div>
      </div>
      <button class="addbtn" data-add="${f.id}" ${added ? "disabled" : ""}>${added ? "已添加" : "添加"}</button>
    </div>`;
  }).join("");
  return `<div class="group-label">推荐好友 · 后续会扩充更多艺人</div>` + rows;
}

// ---------------- 渲染：聊天详情 ----------------
function renderChat() {
  const f = friendById(state.activeFriend);
  const msgs = state.chats[f.id] || [];
  return `
    <div class="chat-page">
      <div class="topbar">
        <span class="back" id="back">‹</span>
        ${f.name}
        <span class="action">⋯</span>
      </div>
      <div class="msgs" id="msgs">
        <div class="time-divider">以下是你的英语练习记录</div>
        ${msgs.map((m, i) => renderMsg(m, f, i)).join("")}
      </div>
      <div class="inputbar">
        <textarea id="input" placeholder="Type something in English..." rows="1"></textarea>
        <button id="send">发送</button>
      </div>
    </div>
  `;
}

function renderMsg(m, f, i) {
  const mine = m.from === "me";
  const hasExp = !mine && ((m.vocab && m.vocab.length) || (m.grammar && m.grammar.length));
  const av = mine ? myAvatarHtml("msg-avatar") : avatarHtml(f, "msg-avatar");
  return `
    <div class="msg ${mine ? "me" : "friend"}">
      ${av}
      <div class="bubble-wrap">
        <div class="bubble" data-msg="${i}">${esc(m.text).replace(/\n/g, "<br>")}${m.viaAI ? ' <span class="ai-tag">AI</span>' : ""}</div>
      </div>
    </div>
  `;
}

// ---------------- 事件：主页面 ----------------
function bindMain(tab) {
  app.querySelectorAll("[data-tab]").forEach((el) => {
    el.onclick = () => {
      state.tab = el.dataset.tab;
      save();
      render();
    };
  });
  app.querySelectorAll("[data-add]").forEach((el) => {
    el.onclick = () => {
      const f = friendById(el.dataset.add);
      if (!f || isAdded(f.id)) return; // 已添加则忽略，保证一个好友只能加一次
      state.friends.push(f.id);
      const addedId = f.id;
      state.chats[addedId] = state.chats[addedId] || [];
      state.chats[addedId].push({
        from: "friend",
        text: "Hey! It's so nice to meet you here 🎉 Feel free to chat with me in English — I'll explain useful words along the way.",
        vocab: [
          { w: "feel free to", p: "", m: "尽管、随意（礼貌邀请别人做事）" },
          { w: "along the way", p: "", m: "一路上、过程中" },
        ],
        grammar: [
          { pattern: "It's nice to meet you", explain: "初次见面常用。见过面后再说：It's nice meeting you." },
        ],
        ts: now(),
        read: false,
      });
      // 标记已读（用户正看着联系人页之外，进聊天才清零）
      save();
      render();
    };
  });
  app.querySelectorAll("[data-chat]").forEach((el) => {
    el.onclick = () => {
      state.activeFriend = el.dataset.chat;
      (state.chats[state.activeFriend] || []).forEach((m) => (m.read = true));
      save();
      render();
    };
  });
  // 联系人页点头像 → 头像设置
  app.querySelectorAll(".cell .avatar").forEach((el) => {
    el.onclick = (e) => {
      e.stopPropagation();
      const fid = el.closest(".cell").querySelector("[data-add]");
      if (fid) openAvatarSettings(fid.dataset.add);
    };
  });
  // "我"页面事件
  const saveBtn = $("#saveLLM");
  if (saveBtn) {
    const providerSel = $("#llmProvider");
    providerSel.onchange = () => {
      const isGemini = providerSel.value === "gemini";
      $("#modelRow").style.display = isGemini ? "flex" : "none";
      $("#llmTip").textContent = isGemini
        ? "在 aistudio.google.com/apikey 免费创建 Key。Gemini Pro 效果最好但有限速，Flash 更快更省。"
        : "在 platform.deepseek.com 或 open.bigmodel.cn 注册后创建 Key，粘贴到这里即可。好友回复、生词、语法全部由 AI 实时生成。";
    };
    saveBtn.onclick = async () => {
      const provider = providerSel.value;
      state.llm = {
        provider,
        key: $("#llmKey").value.trim(),
        model: provider === "gemini" ? $("#llmModel").value : "",
      };
      save(); // 先持久化
      const tag = document.querySelector(".me-card-title .tag-on, .me-card-title .tag-off");
      saveBtn.textContent = "✓ 已保存";
      if (tag) {
        tag.className = state.llm.key ? "tag-on" : "tag-off";
        tag.textContent = state.llm.key ? "已连接" : "未配置";
      }
      setTimeout(() => { saveBtn.textContent = "保存"; }, 1200); // 不整页重渲染，避免输入框状态丢失
    };

    const testBtn = $("#testLLM");
    const resultEl = $("#testResult");
    testBtn.onclick = async () => {
      // 测试前把当前填的 Key/模型先存上，避免"测的是旧的"
      state.llm = {
        provider: providerSel.value,
        key: $("#llmKey").value.trim(),
        model: providerSel.value === "gemini" ? $("#llmModel").value : "",
      };
      save();
      testBtn.disabled = true;
      testBtn.textContent = "测试中…";
      resultEl.style.display = "block";
      resultEl.style.color = "#999";
      resultEl.textContent = "正在连接 AI…";
      const r = await testLLM();
      resultEl.style.display = "block";
      resultEl.style.color = r.ok ? "var(--green)" : "#c0392b";
      resultEl.textContent = r.ok ? "✓ 连接成功！去聊天页发消息试试" : "✗ " + r.err;
      testBtn.disabled = false;
      testBtn.textContent = "测试连接";
    };
  }
  const clearBtn = $("#clearAll");
  if (clearBtn) {
    clearBtn.onclick = () => {
      if (confirm("确定清空所有好友、聊天记录和设置吗？")) {
        localStorage.removeItem("bczf");
        location.reload();
      }
    };
  }
}

// ---------------- 事件：聊天页 ----------------
function bindChat() {
  const f = friendById(state.activeFriend);
  $("#back").onclick = () => {
    state.activeFriend = null;
    save();
    render();
  };

  const msgsEl = $("#msgs");
  msgsEl.scrollTop = msgsEl.scrollHeight;

  const input = $("#input");
  const sendBtn = $("#send");
  const doSend = () => {
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    pushMsg(f.id, { from: "me", text });
    render();
    friendReply(f, text);
  };
  sendBtn.onclick = doSend;
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      doSend();
    }
  });

  // 点击气泡 → 学习面板（全部由气泡点击触发）
  app.querySelectorAll(".bubble").forEach((el) => {
    el.onclick = () => openPanel(parseInt(el.dataset.msg, 10));
  });
  // 点击头像 → 头像设置面板
  app.querySelectorAll(".msg .avatar").forEach((el) => {
    el.onclick = () => openAvatarSettings(state.activeFriend);
  });
}

function friendReply(f, userText) {
  // 显示"对方正在输入"
  const msgsEl = $("#msgs");
  const typing = document.createElement("div");
  typing.className = "msg friend";
  typing.innerHTML = `
    ${avatarHtml(f, "msg-avatar")}
    <div class="bubble-wrap"><div class="bubble typing"><i></i><i></i><i></i></div></div>`;
  msgsEl.appendChild(typing);
  msgsEl.scrollTop = msgsEl.scrollHeight;

  const started = Date.now();
  replyFromFriend(f, userText).then((r) => {
    const wait = Math.max(0, 800 - (Date.now() - started));
    setTimeout(() => {
      if (r.error) {
        // 失败：在聊天流里放一条可长按复制的错误卡，停留不消失
        showSystemNote("❌ " + r.error + "（点此复制完整错误）", r.error);
        return;
      }
      pushMsg(f.id, { from: "friend", text: r.reply, vocab: r.vocab, grammar: r.grammar, viaAI: !!r.viaAI });
      if (state.activeFriend === f.id) {
        render();
        speak(r.reply, f.id);
      }
    }, wait);
  });
}

// ---------------- 学习面板 ----------------
function openPanel(idx) {
  const f = friendById(state.activeFriend);
  const msgs = state.chats[f.id] || [];
  const m = msgs[idx];
  if (!m) return;
  currentPanelMsg = { ...m, friendId: f.id };
  if (m.from === "friend" && !m.viewed) {
    m.viewed = true;
    state.learned++;
    save();
  }

  const vocabHtml = (m.vocab || [])
    .map(
      (v) => `
    <div class="vocab-item">
      <span class="w">${esc(v.w)}</span><span class="p">${esc(v.p || "")}</span>
      <div class="m">${esc(v.m)}</div>
    </div>`
    )
    .join("");
  const gramHtml = (m.grammar || [])
    .map(
      (g) => `
    <div class="gram-item"><b>${esc(g.pattern)}</b><br>${esc(g.explain)}</div>`
    )
    .join("");

  const mask = document.createElement("div");
  mask.className = "panel-mask";
  const panel = document.createElement("div");
  panel.className = "panel";
  panel.innerHTML = `
    <div class="panel-head">
      <button class="speak-btn" id="speak">🔊 朗读</button>
      <div class="quote">“${esc(m.text).slice(0, 40)}${m.text.length > 40 ? "…" : ""}”</div>
      <button class="close" id="closePanel">✕</button>
    </div>
    ${m.from === "me" ? `<div class="empty-tip">这是你发的消息<br>（以后可以在这里看"地道改写建议"）</div>` : ""}
    ${vocabHtml ? `<div class="sec-title">📖 生词</div>${vocabHtml}` : ""}
    ${gramHtml ? `<div class="sec-title">🧩 语法</div>${gramHtml}` : ""}
    ${!vocabHtml && !gramHtml && m.from === "friend" ? `<div class="empty-tip">这条没有生词，继续聊～</div>` : ""}
  `;
  app.appendChild(mask);
  app.appendChild(panel);

  const close = () => {
    mask.remove();
    panel.remove();
    currentPanelMsg = null;
    if (window.speechSynthesis) speechSynthesis.cancel();
  };
  mask.onclick = close;
  panel.querySelector("#closePanel").onclick = close;
  panel.querySelector("#speak").onclick = () => speak(m.text, currentPanelMsg ? currentPanelMsg.friendId : state.activeFriend);
}

// ---------------- 头像设置面板 ----------------
// targetId: 'me' 或好友 id。从聊天页头像点进来
function openAvatarSettings(targetId) {
  const isMe = targetId === "me";
  const f = isMe ? null : friendById(targetId);
  const title = isMe ? "我的头像" : `${f.name} 的头像`;

  const curHtml = isMe
    ? myAvatarHtml("preview-avatar")
    : (state.avatars[targetId] || f.img)
      ? `<img class="avatar preview-avatar" src="${state.avatars[targetId] || f.img}">`
      : `<div class="avatar preview-avatar" style="background:${f.color};font-size:40px">${f.emoji}</div>`;

  const mask = document.createElement("div");
  mask.className = "panel-mask";
  const panel = document.createElement("div");
  panel.className = "panel";
  panel.innerHTML = `
    <div class="panel-head">
      <div style="font-size:16px;font-weight:600">${title}</div>
      <button class="close" id="closePanel" style="margin-left:auto">✕</button>
    </div>
    <div class="avatar-setting">
      ${curHtml}
      <div class="avatar-setting-btns">
        <button class="as-btn primary" id="pickImg">📷 上传图片</button>
        <button class="as-btn" id="resetImg" ${state.avatars[targetId] ? "" : "disabled"}>↺ 恢复默认</button>
      </div>
      <div class="as-tip">图片会自动裁成方形，仅保存在你自己的浏览器里</div>
    </div>
    <input type="file" id="fileInput" accept="image/*" style="display:none">
  `;
  app.appendChild(mask);
  app.appendChild(panel);

  const close = () => { mask.remove(); panel.remove(); };
  mask.onclick = close;
  panel.querySelector("#closePanel").onclick = close;

  panel.querySelector("#pickImg").onclick = () => panel.querySelector("#fileInput").click();
  panel.querySelector("#fileInput").onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      squashSquare(reader.result, 128, (dataUrl) => {
        state.avatars[targetId] = dataUrl;
        save();
        close();
        render();
      });
    };
    reader.readAsDataURL(file);
  };
  panel.querySelector("#resetImg").onclick = () => {
    delete state.avatars[targetId];
    save();
    close();
    render();
  };
}

// 把任意图片压成正方形 dataURL（中心裁剪 + 缩到 size×size，防止 localStorage 爆掉）
function squashSquare(dataUrl, size, cb) {
  const img = new Image();
  img.onload = () => {
    const c = document.createElement("canvas");
    c.width = size; c.height = size;
    const ctx = c.getContext("2d");
    const side = Math.min(img.width, img.height);
    const sx = (img.width - side) / 2, sy = (img.height - side) / 2;
    ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
    cb(c.toDataURL("image/jpeg", 0.85));
  };
  img.src = dataUrl;
}

// ---------------- 启动 ----------------
load();
render();
