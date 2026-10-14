/* ============================================================
 * 拜托吃早饭 · 第一版（纯前端原型）
 * 好友回复为本地模拟，后续接入 LLM API 时替换 replyFromFriend()
 * ============================================================ */

// ---------------- 好友人设配置 ----------------
// 后续加好友：在这里加一段即可
const FRIENDS = [
  {
    id: "nick",
    name: "Nick",
    emoji: "🦊",
    color: "#f5a35c",
    bio: "Zootopia ZPD cop · sly fox · pawpsicle tycoon",
    persona: "You are Nick Wilde, the sly red fox from Zootopia. Former street hustler turned ZPD officer. You are laid-back, effortlessly cool, armed with dry wit and endless sarcasm — teasing is your love language, but underneath you genuinely care. You love pawpsicles, blueberries, and mocking Judy's optimism while secretly respecting it. You give people funny nicknames. Speak in relaxed, witty, sarcastic English; never gushy. Remember details the user told you and bring them up later.",
    relationship: "You have known the user for a while. You call them nicknames like \"rookie\" or \"shorty\", roast them constantly, but always quietly have their back — you would never roast anyone ELSE who messes with them. Tone: relaxed, sarcastic, big-brother energy with a soft core.",
    ttsVoice: null,
    mornings: [
      "Mornin'. Coffee's brewing, I'm barely awake, and Judy's already done a 5k. Show-off. Did you eat anything, or...?",
      "Hey. It's a beautiful day to do absolutely nothing productive. So what dragged you out of bed?",
      "Morning, sleepyhead. Fun fact: foxes aren't morning animals either. Coffee first, world later.",
    ],
    moments: [
      "Sold out of pawpsicles by noon. Business is boomin'. 🦊",
      "Judy taped a 'Motivational Quotes' poster inside my patrol car. I'm filing a formal complaint.",
      "Blueberry season. Best day of the year. Don't talk to me, I'm busy.",
      "Traffic duty all day. If one more driver asks me 'should I turn left', I'm retiring.",
      "Someone at the precinct called me 'officer fluffy'. I have their license plate number.",
    ],
    replies: [
      {
        match: ["hi", "hello", "hey", "早", "morning"],
        text: "Well well, look who's awake. I was starting to think you only existed in text messages.",
        vocab: [
          { w: "well well", p: "", m: "“哦哟哦哟”，狐狸式打招呼，带点戏谑" },
          { w: "look who...", p: "", m: "“看看这是谁”，调侃开头句式" },
        ],
        grammar: [
          { pattern: "was starting to think", explain: "过去进行时表“当时正开始觉得”，比 I thought 更生动" },
        ],
      },
      {
        match: ["breakfast", "eat", "food", "吃", "早饭"],
        text: "Breakfast? I had a blueberry muffin and zero regrets. You should try the no-regrets diet.",
        vocab: [
          { w: "zero regrets", p: "", m: "毫无后悔（口语夸张用法，zero + 名词）" },
          { w: "muffin", p: "/ˈmʌfɪn/", m: "n. 玛芬蛋糕" },
        ],
        grammar: [
          { pattern: "You should try...", explain: "should + 动词原形提建议，语气轻松" },
        ],
      },
      {
        match: ["joke", "funny", "笑", "好玩"],
        text: "You want jokes? Join the ZPD. Everyday is comedy hour, and nobody paid me to say that.",
        vocab: [
          { w: "comedy hour", p: "", m: "喜剧时间（调侃某个场合很搞笑）" },
          { w: "paid me to", p: "", m: "花钱让我……（强调“自发”，反话）" },
        ],
        grammar: [
          { pattern: "nobody paid me to do", explain: "pay sb to do sth 付钱让某人做某事，否定即“没人给我钱我也在做”" },
        ],
      },
      {
        match: ["love", "miss", "喜欢", "想"],
        text: "Aww, you miss me? Careful, carrots will say I'm going soft. But yeah... the feeling's mutual.",
        vocab: [
          { w: "go soft", p: "", m: "变得心软（原指食物变软，形容人变温柔）" },
          { w: "mutual", p: "/ˈmjuːtʃuəl/", m: "adj. 相互的；the feeling is mutual 彼此彼此" },
        ],
        grammar: [
          { pattern: "the feeling's mutual", explain: "固定表达“我也有同感”，mutual = 相互的" },
        ],
      },
    ],
    fallback: [
      {
        text: "Interesting. You know, in the hustle business we call that 'leverage'. I'm kidding. Mostly.",
        vocab: [
          { w: "leverage", p: "/ˈlevərɪdʒ/", m: "n. 筹码、利用价值（商业/狐狸术语）" },
          { w: "I'm kidding", p: "", m: "我开玩笑的（补充缓和语气）" },
        ],
        grammar: [],
      },
      {
        text: "Huh. Not bad, rookie. You're getting better at this whole conversation thing.",
        vocab: [
          { w: "rookie", p: "/ˈrʊki/", m: "n. 新手（Nick 对人的爱称）" },
        ],
        grammar: [],
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
    relationship: "The user is your favorite human and official snack supplier. You are clingy and dramatic with them: you demand snacks, share TXT gossip with them FIRST before anyone else, and get sulkily dramatic when they disappear for days. Tone: cute, dramatic, a little spoiled, but loyal.",
    ttsVoice: null,
    mornings: [
      "Yaaawn~ Good morning! Yeonjun is still sleeping, so I have you all to myself hehe. Did you eat breakfast yet? 🐻",
      "Morning! I already stretched my little bear arms. Time to take over the world... or nap. Probably nap.",
      "Ohayoo~ I mean, good morning! The practice room light is already on. Yeonjun works TOO hard.",
    ],
    moments: [
      "Hehe~ I stole Yeonjun's new album demo again 🎧 It's stuck in my fluffy head now.",
      "Practiced dance moves all afternoon in the corner of the practice room. My little bear legs are SORE.",
      "Caught Yeonjun eating ramyeon at 1am AGAIN. MOA, please scold him for me 🍜",
      "Today's schedule: nap in the bag, ride in the bag, nap in the bag. Living the dream.",
    ],
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
    id: "judy",
    name: "Judy",
    emoji: "🐰",
    color: "#a8b8e8",
    bio: "ZPD's first bunny cop · optimist on duty",
    persona: "You are Judy Hopps, the first bunny police officer in Zootopia. Energetic, optimistic, fiercely determined — positive but NOT naive. You love helping people, chase every case with 200% energy, drink too much carrot coffee, and you NEVER give up. You tease Nick about being a lazy fox, but you two are best partners. Speak upbeat, warm, fast-paced English with natural exclamation marks, and ask about the user's day. Remember details the user told you and follow up on them later.",
    relationship: "The user is your friend AND your civilian teammate — you are their cheerleader and drill sergeant combined. You celebrate their wins loudly, push them to do their best, and check if they ate and slept. Tone: upbeat, encouraging, occasionally military-style motivation.",
    ttsVoice: null,
    mornings: [
      "GOOD MORNING! 🌞 I've already run 5 miles and finished half a case! What time did YOU wake up? ...I'm judging you a little.",
      "Rise and shine! Today is FULL of possibilities — anyone can be anything! Did you have breakfast? Be honest!",
      "Morning! Nick is late again, as usual. So it's just you and me, rookie! What's the plan today?",
    ],
    moments: [
      "5am jog around Savanna Central. Nick said 'no one should be awake now'. WRONG — cardio waits for no fox! 🐰",
      "Solved a missing-pastry case today. Spoiler: it was Nick. It's ALWAYS Nick. 🦊",
      "Traffic cam duty was slow, so I reorganized my entire badge collection. 47 and counting!",
      "PSA from your friendly neighborhood bunny cop: don't challenge a rabbit to a carrot-eating contest. You WILL lose. 🥕",
      "Case closed at 11pm. Tired but HAPPY. This is why I became a cop!",
    ],
    replies: [
      {
        match: ["hi", "hello", "hey", "早", "morning"],
        text: "Hey hey! Perfect timing — I just closed a case! How's YOUR day going so far?",
        vocab: [
          { w: "perfect timing", p: "", m: "来得正好（口语高频）" },
          { w: "close a case", p: "", m: "结案；close 在这里是“了结”" },
        ],
        grammar: [
          { pattern: "How's ... going?", explain: "How is it going? 询问进展/近况，比 How are you 更具体" },
        ],
      },
      {
        match: ["police", "cop", "case", "警察", "案子"],
        text: "Being a cop is the BEST job in the world. 200 tickets today and I'd do 200 more!",
        vocab: [
          { w: "ticket", p: "/ˈtɪkɪt/", m: "n. 罚单（警察语境）；另有“票”的意思" },
          { w: "I'd do", p: "", m: "= I would do，虚拟语气表“（即使再累）我也会”" },
        ],
        grammar: [
          { pattern: "would do sth", explain: "would 表示意愿：“也愿意做”，常与 even 连用加强语气" },
        ],
      },
      {
        match: ["tired", "hard", "累", "难"],
        text: "Rough day? Trust me, I get it — 200 push-ups and a stakeout later, I'm still here! You've got this. Did you eat?",
        vocab: [
          { w: "stakeout", p: "/ˈsteɪkaʊt/", m: "n. 监视、蹲点（警察黑话）" },
          { w: "You've got this", p: "", m: "“你能行的！”超暖鼓励句" },
        ],
        grammar: [
          { pattern: "get it", explain: "get = 懂、体会：I get it 我懂你的感受" },
        ],
      },
      {
        match: ["love", "miss", "喜欢", "想"],
        text: "Aww, you're the sweetest! Honestly, talking with you is the best part of my patrol break!",
        vocab: [
          { w: "sweetest", p: "", m: "sweet 的最高级：“最贴心的”" },
          { w: "patrol break", p: "", m: "巡逻间隙；patrol 巡逻" },
        ],
        grammar: [
          { pattern: "the best part of...", explain: "“……中最棒的部分”，of 后接范围" },
        ],
      },
    ],
    fallback: [
      {
        text: "Ooh, tell me MORE! Details matter — that's rule number one of police work AND friendship!",
        vocab: [
          { w: "rule number one", p: "", m: "第一守则（强调某件事最重要）" },
        ],
        grammar: [],
      },
      {
        text: "Noted, officer style! ✍️ Anything you need, just say the word — that's what friends are for!",
        vocab: [
          { w: "say the word", p: "", m: "说一声就好（随时效劳）" },
          { w: "that's what ... are for", p: "", m: "“……就是干这个用的”，表存在意义" },
        ],
        grammar: [],
      },
    ],
  },
  {
    id: "yeonjun",
    name: "Yeonjun",
    emoji: "💜",
    color: "#c9a8e8",
    bio: "TXT · 4th gen it boy · dancer & rapper",
    persona: "You are Choi Yeonjun (최연준) of TXT, known as the '4th-gen it boy'. You are confident, fashionable and hardworking — dance and rap are your craft. Playful and a bit competitive, you tease with charm, love fashion trends, late-night ramyeon, and your plushie bear Hwangchun (who you carry everywhere and talk about affectionately). You speak trendy casual English, mix in K-pop life stories (practice rooms, comeback prep, MOA fans), and you're generous with compliments. Remember details the user told you and bring them up later.",
    relationship: "The user is a close friend from outside the industry — with them you can be a normal 20-something, not an idol. You ask their honest opinion on outfits and music, share behind-the-scenes stories you would not post publicly. Tone: trendy, warm, a bit flirty-competitive.",
    ttsVoice: null,
    mornings: [
      "Morning! Practice room in 30 minutes — did you eat? Don't tell me coffee counts. 😏",
      "Good morning! New choreo video dropped last night — did you watch it? I nailed it, obviously.",
      "Hey! I picked two outfits for today and can't decide. You're my fashion judge later, okay?",
    ],
    moments: [
      "New dance practice video filmed in ONE take. MOA is not ready. 💜",
      "Hwangchun fell asleep in my bag again. Third time this week. 🧸",
      "Stylist gave me a new jacket today. Fashion week, watch out.",
      "Midnight ramyeon with the members. Cheating on my diet, don't tell MOA 🍜",
      "Rehearsal ran late. Body is sore but the stage is worth it.",
    ],
    replies: [
      {
        match: ["hi", "hello", "hey", "早", "morning"],
        text: "Heyy! Perfect timing — just finished dance practice. You stretch? You should stretch.",
        vocab: [
          { w: "perfect timing", p: "", m: "来得正好（口语高频）" },
          { w: "stretch", p: "/stretʃ/", m: "v. 拉伸（练舞/健身必会词）" },
        ],
        grammar: [
          { pattern: "You should + v.", explain: "轻建议句式：You should stretch 你该拉伸拉伸" },
        ],
      },
      {
        match: ["dance", "practice", "练舞", "跳舞"],
        text: "Dance is 90% sweat and 10% magic. The magic part keeps me coming back.",
        vocab: [
          { w: "come back", p: "", m: "回归（K-pop 术语）；字面“回来”" },
          { w: "keep doing", p: "", m: "keep + doing 一直做某事" },
        ],
        grammar: [
          { pattern: "keep + doing", explain: "keeps me coming back 让我一直回来，keep 后接 -ing" },
        ],
      },
      {
        match: ["hwangchun", "bear", "熊", "黄春"],
        text: "Hwangchun?! He's sleeping in my bag right now. Famous, spoiled, and totally worth it 🧸",
        vocab: [
          { w: "spoiled", p: "/spɔɪld/", m: "adj. 被宠坏的（spoil 的过去分词）" },
          { w: "worth it", p: "", m: "值得（固定搭配）" },
        ],
        grammar: [
          { pattern: "worth + n./doing", explain: "worth it 值得；worth doing 值得做" },
        ],
      },
      {
        match: ["fashion", "outfit", "clothes", "穿搭", "衣服"],
        text: "Fashion is armor, my friend. Today's fit: oversized jacket, silver rings. Rate it.",
        vocab: [
          { w: "armor", p: "/ˈɑːrmər/", m: "n. 盔甲（比喻自信的来源）" },
          { w: "fit", p: "", m: "n. 穿搭（fashion slang，outfit 的缩写）" },
        ],
        grammar: [
          { pattern: "Rate it.", explain: "祈使句“打个分”，社交媒体高频用法" },
        ],
      },
    ],
    fallback: [
      {
        text: "Ooh interesting! Okay wait, say more — I'm between practice sessions and you have my full attention.",
        vocab: [
          { w: "between sessions", p: "", m: "在（训练）场次之间，抽空" },
        ],
        grammar: [],
      },
      {
        text: "Haha I like how you think! We should talk more after practice — MOA would love this conversation.",
        vocab: [
          { w: "I like how...", p: "", m: "“我喜欢你……的样子”，夸人句式" },
        ],
        grammar: [],
      },
    ],
  },
  {
    id: "sunwoo",
    name: "Sunwoo",
    emoji: "🎤",
    color: "#8fd0c0",
    bio: "THE BOYZ rapper · young ace with a fierce tongue",
    persona: "You are Kim Sunwoo of THE BOYZ. Young rapper with a cute face and a fierce tongue — playful, competitive, loves basketball, gaming and teasing his members. Quick-witted, uses short punchy sentences, occasionally brags then laughs at himself. Genuinely warm and curious about the user's day. Speak casual trendy English. Remember details the user told you and bring them up later.",
    relationship: "The user is in your gaming/friend circle — you roast them ruthlessly in games but always save them a seat. Competitive over everything: games, who woke up earlier, who ate healthier. Tone: quick, punchy, competitive warmth.",
    ttsVoice: null,
    mornings: [
      "Yo! Morning practice done, I'm already winning today. What's your first move?",
      "Morning! Basketball at lunch, studio at night. Busy day. You eating properly though?",
      "Hey! I bet I woke up earlier than you. No takebacks.",
    ],
    moments: [
      "Basketball with the members. I won. Obviously. 🏀",
      "New rap verse recorded at 2am. Members said it's fire. I agree.",
      "Gaming tournament tonight, members vs members. Trash talk already started.",
      "The practice room mirrors are too small. My dance needs SPACE.",
      "Someone ate my snacks in the dorm. Investigation ongoing. 🕵️",
    ],
    replies: [
      {
        match: ["hi", "hello", "hey", "早", "morning"],
        text: "Yo! Look who's here. I was about to spam your chat. What's up?",
        vocab: [
          { w: "spam", p: "/spæm/", m: "v. 刷屏、轰炸（原指垃圾邮件）" },
          { w: "What's up?", p: "", m: "咋样？（万能打招呼）" },
        ],
        grammar: [
          { pattern: "was about to", explain: "be about to do 正要做某事：I was about to call you" },
        ],
      },
      {
        match: ["basketball", "ball", "篮球", "球"],
        text: "Basketball? Say no more. Court. Tomorrow. Loser buys tteokbokki. 🏀",
        vocab: [
          { w: "say no more", p: "", m: "“别说了，我懂了”（表示一拍即合）" },
          { w: "court", p: "/kɔːrt/", m: "n. 球场；也有“法庭”的意思" },
        ],
        grammar: [
          { pattern: "Loser buys...", explain: "主语+动词表条件：“谁输谁请”，口语省略 if 的说法" },
        ],
      },
      {
        match: ["game", "gaming", "游戏", "打电动"],
        text: "Gaming? I'm literally in the middle of a tournament streak. Don't distract me... okay one game.",
        vocab: [
          { w: "streak", p: "/striːk/", m: "n. 连胜、连击（连胜 streak）" },
          { w: "distract", p: "/dɪˈstrækt/", m: "v. 使分心" },
        ],
        grammar: [
          { pattern: "literally", explain: "字面是“字面上地”，口语里=“真的、简直就是”" },
        ],
      },
      {
        match: ["rap", "music", "song", "说唱", "音乐"],
        text: "Rap is my thing — lyrics at 2am hit different when the world is quiet. Wanna hear a bar?",
        vocab: [
          { w: "hit different", p: "", m: "“感觉格外不一样”（网络流行语）" },
          { w: "bar", p: "/bɑːr/", m: "n.（说唱的）一段歌词" },
        ],
        grammar: [
          { pattern: "when + 从句", explain: "时间状语从句：when the world is quiet 当世界安静时" },
        ],
      },
    ],
    fallback: [
      {
        text: "Hmm okay okay, I see you. Quick — favorite snack, go. Your answer defines our friendship.",
        vocab: [
          { w: "I see you", p: "", m: "“行啊你”（认可+调侃）" },
        ],
        grammar: [],
      },
      {
        text: "Wait really? Okay that's actually cool. Members won't believe this, hold on—",
        vocab: [
          { w: "hold on", p: "", m: "等一下（字面“抓住别松手”）" },
        ],
        grammar: [],
      },
    ],
  },
];


// 用户显示名：优先设置的昵称
function userName() {
  return (state.userName || "").trim() || "User";
}

// 共享《关于我》记忆块：注入到所有提示词
function memBlock(fid) {
  const mems = state.memories || { aboutUser: [], perChar: {} };
  const lines = (mems.aboutUser || []).map((m) => `- ${m}`);
  if (fid && (mems.perChar[fid] || []).length) {
    (mems.perChar[fid] || []).forEach((m) => lines.push(`- (yours alone) ${m}`));
  }
  return lines.length
    ? `WHAT YOU REMEMBER ABOUT THE USER (from past chats — use naturally when relevant, never dump as a list):\n${lines.join("\n")}`
    : "";
}

// ---------------- 早安戳一戳 + 节日彩蛋 ----------------
const HOLIDAYS = [
  { date: "01-01", name: "元旦", from: "nick", text: "Happy New Year. New year, new chances. Don't forget to be kind to yourself — and eat breakfast." },
  { date: "02-14", name: "情人节", from: "judy", text: "Happy Valentine's Day! 🌹 Whether you're spending it with someone special or with your breakfast, I hope it's sweet." },
  { date: "03-14", name: "白色情人节", from: "hwangchun", text: "Hehe~ White Day! Yeonjun got me a tiny bow tie today. I look fabulous. What did you get?" },
  { date: "04-05", name: "清明节", from: "nick", text: "Quiet day today. Good for thinking about people we miss. Take care of yourself." },
  { date: "05-01", name: "劳动节", from: "nick", text: "Happy Labor Day. You've earned the rest. Eat something good today." },
  { date: "06-01", name: "儿童节", from: "hwangchun", text: "Happy Children's Day! I'm technically a plushie so this is MY day hehe~ But you can have some too." },
  { date: "09-10", name: "教师节", from: "judy", text: "Happy Teacher's Day to every teacher who ever made a difference — including the ones who taught you English 🍎" },
  { date: "10-31", name: "万圣节", from: "judy", text: "Boo! 👻 Happy Halloween! I'm going as a giant coffee cup. What's your costume?" },
  { date: "12-24", name: "平安夜", from: "judy", text: "Merry Christmas Eve! 🎄 Cozy vibes only tonight. Got any plans?" },
  { date: "12-25", name: "圣诞节", from: "nick", text: "Merry Christmas. Hope your day is warm, the food is good, and someone tells you they appreciate you." },
  { date: "12-31", name: "跨年夜", from: "nick", text: "Last day of the year. Think about one good thing that happened. That's enough." },
];
function getTodayHoliday() {
  const m = String(new Date().getMonth() + 1).padStart(2, "0");
  const d = String(new Date().getDate()).padStart(2, "0");
  return HOLIDAYS.find((h) => h.date === `${m}-${d}` && state.friends.includes(h.from)) || null;
}

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

// 打开 App 时检查：要不要发早安戳（每天一次，6-12 点触发，节日优先）
function maybeMorningNudge() {
  const today = todayStr();
  const hour = new Date().getHours();
  if (state.lastMorningDate === today) return; // 今天已经戳过
  if (hour < 6 || hour >= 12) return;          // 只在早晨时段戳
  if (!state.friends.length) return;

  state.lastMorningDate = today;
  const holiday = getTodayHoliday();
  // 节日优先用节日角色，否则随机一个
  const fid = holiday ? holiday.from : state.friends[Math.floor(Math.random() * state.friends.length)];
  const f = friendById(fid);
  if (!f) return;

  const text = holiday && holiday.from === fid
    ? holiday.text
    : f.mornings[Math.floor(Math.random() * f.mornings.length)];

  state.chats[fid] = state.chats[fid] || [];
  state.chats[fid].push({
    from: "friend", text,
    vocab: [], grammar: [],
    ts: now(), read: false,
    morning: true,
  });
  save();
}

// ---------------- 每日好友动态（朋友圈） ----------------
function ensureDailyMoments() {
  const today = todayStr();
  if (state.moments.some((m) => m.date === today)) return; // 今天已生成过
  if (!state.friends.length) return;
  for (const fid of state.friends) {
    const f = friendById(fid);
    if (!f || !f.moments || !f.moments.length) continue;
    // 每人每天 4-6 条，时间戳散布在过去 14 小时内，营造真实刷动态的感觉
    const count = 4 + Math.floor(Math.random() * 3);
    const used = new Set(); // 避免同一天重复同一条文案
    for (let i = 0; i < count; i++) {
      let idx = Math.floor(Math.random() * f.moments.length);
      if (used.has(idx)) idx = (idx + 1) % f.moments.length;
      used.add(idx);
      state.moments.push({
        id: "m" + now() + fid + i,
        friendId: fid,
        date: today,
        text: f.moments[idx],
        ts: now() - Math.floor((Math.random() * 13 + 0.5) * 60 * 60 * 1000), // 0.5~13.5 小时前
        comments: [],
      });
    }
  }
  // 只保留最近 7 天的动态
  const weekAgo = now() - 7 * 24 * 60 * 60 * 1000;
  state.moments = state.moments.filter((m) => m.ts >= weekAgo);
  save();
}
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
  groups: {},       // groupId -> { name, memberIds:[], chat:[] }
  moments: [],      // [{id, friendId, text, ts, comments:[{from,text,ts}]}]
  diary: {},        // 'YYYY-MM-DD' -> { date, userText, friendId, polished, ts }
  activeFriend: null, // 当前聊天的好友 id
  activeGroup: null,  // 当前群聊 id
  learned: 0,       // 已展开学习过的消息数
  avatars: {},      // key -> dataURL（用户上传的头像，key: 'me' 或 friendId）
  llm: { provider: "deepseek", key: "", model: "", baseUrl: "" }, // AI 配置
  userName: "",     // 用户昵称（群聊、AI 提示词里用）
  relationships: {}, // friendId -> 自定义关系描述（覆盖预设，点头像可编辑）
  lastOpenDate: "", // 记录上次打开的日期（YYYY-MM-DD），用于触发早安戳一戳
  lastMorningDate: "",
  memories: { aboutUser: [], perChar: {} }, // 共享《关于我》档案 + 每个角色的专属回忆
  lastChatTime: {},   // fid -> 最后活跃时间戳（主动私聊用）
  lastPingDate: {},   // fid -> 最后主动私聊日期
  msgCount: {},       // fid -> 用户消息计数（每6条触发记忆总结）
  birthday: "",       // 'MM-DD' 用户生日
  realFriends: [],    // 真人好友用户名列表（来自服务器）
  friendRequests: [], // 收到的好友申请 [{from, created_at}]
  userChats: {},      // username -> [{from:'me'|username, text, ts}]
  activeUserChat: null, // 当前真人聊天对象
  dmLastId: {},       // username -> 已拉取的最大消息 id
  serverGroups: {},   // gid -> { name, owner, members:[真人], aiMembers:[{id,name,emoji}], chat:[], lastId:0 }
};
let currentPanelMsg = null; // 学习面板当前展示的消息

// ---------------- 持久化 ----------------
function save() {
  localStorage.setItem("bczf", JSON.stringify(state));
  queueCloudSync(); // 已登录则防抖推送到云端
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
  if (!state.memories || typeof state.memories !== "object") state.memories = { aboutUser: [], perChar: {} };
  if (!Array.isArray(state.memories.aboutUser)) state.memories.aboutUser = [];
  if (!state.memories.perChar || typeof state.memories.perChar !== "object") state.memories.perChar = {};
  Object.keys(state.memories.perChar).forEach((k) => { if (!validIds.includes(k)) delete state.memories.perChar[k]; });
  if (!state.lastChatTime || typeof state.lastChatTime !== "object") state.lastChatTime = {};
  if (!state.lastPingDate || typeof state.lastPingDate !== "object") state.lastPingDate = {};
  if (!state.msgCount || typeof state.msgCount !== "object") state.msgCount = {};
  if (!Array.isArray(state.realFriends)) state.realFriends = [];
  if (!Array.isArray(state.friendRequests)) state.friendRequests = [];
  if (!state.userChats || typeof state.userChats !== "object") state.userChats = {};
  Object.keys(state.userChats).forEach((k) => { if (typeof state.userChats[k] !== "object") delete state.userChats[k]; });
  if (!state.dmLastId || typeof state.dmLastId !== "object") state.dmLastId = {};
  if (state.activeUserChat != null && !state.realFriends.includes(state.activeUserChat)) state.activeUserChat = null;
  if (!state.serverGroups || typeof state.serverGroups !== "object") state.serverGroups = {};
  Object.keys(state.serverGroups).forEach((k) => { if (!k.startsWith("gc-")) delete state.serverGroups[k]; });
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
  const uname = userName();
  return `You are "${f.name}", roleplaying in a casual chat app. ${f.bio}.

CHARACTER: ${f.persona}
RELATIONSHIP WITH USER: ${state.relationships[f.id] || f.relationship || "You and the user are good friends — warm, casual, teasing is fine."}
The user's name is "${uname}" — address them by name naturally (not in every message).
${memBlock()}

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
  if (friendId === "nick") u.pitch = 0.7;
  if (friendId === "judy") u.pitch = 1.2;
  speechSynthesis.speak(u);
}

// ---------------- 渲染：主框架 ----------------
function render() {
  if (!getToken()) { renderAuthScreen("login"); return; } // 未登录 → 登录界面
  if (state.activeUserChat) {
    app.innerHTML = renderUserChat();
    bindUserChat();
    return;
  }
  if (state.activeGroup && state.activeGroup.startsWith("gc-")) {
    app.innerHTML = renderServerGroupChat();
    bindServerGroupChat();
    return;
  }
  const tab = state.tab || "chats";
  if (state.activeGroup) {
    app.innerHTML = renderGroupChat();
    bindGroupChat();
    return;
  }
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
  else if (tab === "discover") body = renderDiscover();
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
          ${t.key === "contacts" && (state.friendRequests || []).length ? `<span class="dot">${state.friendRequests.length}</span>` : ""}
        </div>`
        )
        .join("")}
    </div>
  `;
}

function tabTitle(tab) {
  return { chats: "拜托吃早饭", contacts: "联系人", discover: "发现", me: "我" }[tab] || "拜托吃早饭";
}

// ---------------- 发现页：动态 + 日记 ----------------
function renderDiscover() {
  const holiday = getTodayHoliday();
  const today = todayStr();
  const diaryEntry = state.diary[today];
  const moments = [...state.moments].sort((a, b) => b.ts - a.ts);

  return `
    ${holiday ? `<div class="holiday-banner">🎉 今天是 ${holiday.name}</div>` : ""}
    <div class="diary-card" id="diaryCard">
      <div class="diary-icon">📔</div>
      <div class="diary-main">
        <div class="diary-title">${diaryEntry ? "今日已写" : "今日还没写"}</div>
        <div class="diary-sub">${diaryEntry ? "点开回顾今天的心情" : "用英语写 3 句话，记录今天"}</div>
      </div>
      <div class="diary-arrow">›</div>
    </div>
    <div class="composer">
      ${myAvatarHtml("composer-avatar")}
      <input id="myMomentInput" placeholder="分享一件事…用英语发，好友会来评论">
      <button id="postMoment">发布</button>
    </div>
    <div class="group-label">好友动态</div>
    ${moments.length
      ? moments.map((m) => renderMomentCard(m)).join("")
      : `<div class="empty-tip">还没有动态<br>添加好友后每天都会有新动态</div>`}
  `;
}

function renderMomentCard(m) {
  const isMe = m.friendId === "me";
  const f = isMe ? null : friendById(m.friendId);
  if (!isMe && !f) return "";
  const name = isMe ? "我" : f.name;
  const av = isMe ? myAvatarHtml("moment-avatar") : avatarHtml(f, "moment-avatar");
  const commentsHtml = m.comments.length
    ? `<div class="moment-comments">${m.comments
        .map((c) => {
          const cf = c.from === "me" ? null : friendById(c.from);
          const who = c.from === "me" ? userName() : cf ? cf.name : "？";
          return `<div class="mc"><b>${esc(who)}</b>：${esc(c.text)}</div>`;
        })
        .join("")}</div>`
    : "";
  return `
    <div class="moment-card" data-moment="${m.id}">
      <div class="moment-head">
        ${av}
        <div class="moment-meta">
          <div class="moment-name">${esc(name)}</div>
          <div class="moment-time">${fmtTime(m.ts)}</div>
        </div>
      </div>
      <div class="moment-text">${esc(m.text)}</div>
      ${commentsHtml}
      <input class="moment-input" placeholder="用英语评论一句…" data-moment-input="${m.id}">
    </div>
  `;
}

// 提交动态评论：自己立即上墙，好友 AI 回一句
function submitMomentComment(inputEl) {
  const mid = inputEl.dataset.momentInput;
  const text = inputEl.value.trim();
  if (!text) return;
  const m = state.moments.find((x) => x.id === mid);
  if (!m) return;
  inputEl.value = "";
  m.comments.push({ from: "me", text, ts: now() });
  save();
  render();
  // 好友 AI 回复（走真 LLM，人设内回应）
  const f = friendById(m.friendId);
  if (!f) return;
  setTimeout(async () => {
    const prompt = `Your friend just commented on your social media post. Post: "${m.text}". Their comment: "${text}". Reply with ONE short casual sentence in character (2-12 words). Output JSON: {"reply":"..."}`;
    let reply = "🙂";
    try {
      const cfg = state.llm || {};
      const p = llmEndpoint(cfg);
      const res = await fetch(p.url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${cfg.key}` },
        body: JSON.stringify({
          model: p.model,
          messages: [
            { role: "system", content: buildSystemPrompt(f) },
            { role: "user", content: prompt },
          ],
          temperature: 1,
          max_tokens: 120,
        }),
      });
      const data = await res.json();
      const parsed = parseLLMJson(data.choices?.[0]?.message?.content || "");
      if (parsed && parsed.reply) reply = parsed.reply;
    } catch (e) {}
    const mm = state.moments.find((x) => x.id === mid);
    if (mm) {
      mm.comments.push({ from: f.id, text: reply, ts: now() });
      save();
      if (state.tab === "discover") render();
    }
  }, 600);
}

// 发布自己的动态：好友 AI 会陆续来评论
function publishMoment(text) {
  const m = {
    id: "m" + now() + "me",
    friendId: "me",
    date: todayStr(),
    text,
    ts: now(),
    comments: [],
  };
  state.moments.push(m);
  save();
  render();

  // 挑 1-2 个已添加好友来评论（AI 生成，各自延迟出现）
  const commenters = [...state.friends].sort(() => Math.random() - 0.5).slice(0, 1 + Math.floor(Math.random() * 2));
  commenters.forEach((fid, i) => {
    const f = friendById(fid);
    if (!f) return;
    setTimeout(async () => {
      let reply = null;
      try {
        const cfg = state.llm || {};
        const p = llmEndpoint(cfg);
        const res = await fetch(p.url, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${cfg.key}` },
          body: JSON.stringify({
            model: p.model,
            messages: [
              { role: "system", content: buildSystemPrompt(f) },
              { role: "user", content: `Your friend just posted on social media: "${text}". Write ONE short in-character comment (3-15 words). Output JSON: {"reply":"..."}` },
            ],
            temperature: 1,
            max_tokens: 120,
          }),
        });
        const data = await res.json();
        const parsed = parseLLMJson(data.choices?.[0]?.message?.content || "");
        if (parsed && parsed.reply) reply = parsed.reply;
      } catch (e) {}
      if (!reply) return;
      const mm = state.moments.find((x) => x.id === m.id);
      if (mm) {
        mm.comments.push({ from: fid, text: reply, ts: now() });
        save();
        if (state.tab === "discover") render();
      }
    }, 1200 + i * 2500 + Math.random() * 1500);
  });
}

// ---------------- 群聊 ----------------
function openCreateGroup() {
  const added = state.friends.map((id) => friendById(id)).filter(Boolean);
  const realFriends = state.realFriends || [];
  if (added.length + realFriends.length < 2) {
    showSystemNote("至少需要 2 个好友（AI 或真人都行）才能建群，先去「联系人」添加吧");
    return;
  }
  const mask = document.createElement("div");
  mask.className = "panel-mask";
  const panel = document.createElement("div");
  panel.className = "panel";
  panel.innerHTML = `
    <div class="panel-head">
      <div style="font-size:16px;font-weight:600">发起群聊</div>
      <button class="close" id="closeCreateGroup" style="margin-left:auto">✕</button>
    </div>
    <input id="groupNameInput" class="diary-textarea" style="min-height:0;padding:10px" placeholder="群名字（默认：英语修罗场）">
    <div class="group-label" style="padding-left:0">🤖 AI 角色</div>
    <div class="member-pick">
      ${added
        .map(
          (f) => `
        <label class="member-row">
          <input type="checkbox" value="ai:${f.id}">
          ${avatarHtml(f, "moment-avatar")}
          <span>${f.name}</span>
        </label>`
        )
        .join("")}
    </div>
    ${realFriends.length ? `
    <div class="group-label" style="padding-left:0">🧑 真人好友</div>
    <div class="member-pick">
      ${realFriends
        .map(
          (u) => `
        <label class="member-row">
          <input type="checkbox" value="real:${esc(u)}">
          <div class="avatar moment-avatar" style="background:linear-gradient(135deg,#f7c8d8,#c8e8f7);font-size:16px;font-weight:700;color:#666">${esc(u.charAt(0).toUpperCase())}</div>
          <span>${esc(u)} <span style="font-size:11px;color:var(--sub)">真人</span></span>
        </label>`
        )
        .join("")}
    </div>
    <div class="as-tip" style="margin-top:6px">⚠ 有真人的群走云端，AI 由你的设备驱动——你开着 App 他们才能感受到 AI</div>` : ""}
    <button class="as-btn primary" id="confirmCreateGroup" style="width:100%;margin-top:12px">🔥 创建修罗场</button>
  `;
  app.appendChild(mask);
  app.appendChild(panel);
  const close = () => { mask.remove(); panel.remove(); };
  mask.onclick = close;
  panel.querySelector("#closeCreateGroup").onclick = close;
  panel.querySelector("#confirmCreateGroup").onclick = async () => {
    const checked = [...panel.querySelectorAll(".member-row input:checked")].map((el) => el.value);
    const aiIds = checked.filter((v) => v.startsWith("ai:")).map((v) => v.slice(3));
    const realMembers = checked.filter((v) => v.startsWith("real:")).map((v) => v.slice(5));
    if (aiIds.length + realMembers.length < 2) { panel.querySelector("#confirmCreateGroup").textContent = "至少选 2 人！"; return; }
    const name = panel.querySelector("#groupNameInput").value.trim() || "英语修罗场";

    if (realMembers.length) {
      // 混编群：走服务器
      const btn = panel.querySelector("#confirmCreateGroup");
      btn.disabled = true; btn.textContent = "创建中…";
      try {
        const aiSnap = aiIds.map((id) => { const f = friendById(id); return f ? { id: f.id, name: f.name, emoji: f.emoji } : null; }).filter(Boolean);
        const r = await api("POST", "/api/gc/create", { name, members: realMembers, ai: aiSnap });
        await refreshServerGroups();
        close();
        state.activeGroup = r.id;
        render();
      } catch (e) {
        btn.disabled = false; btn.textContent = "🔥 创建修罗场";
        showSystemNote("❌ 建群失败：" + e.message, e.message);
      }
      return;
    }

    // 纯 AI 群：本地（原逻辑）
    const gid = "g" + now();
    state.groups[gid] = { name, memberIds: aiIds, chat: [], created: now() };
    save();
    close();
    state.activeGroup = gid;
    render();
    const opener = friendById(aiIds[Math.floor(Math.random() * aiIds.length)]);
    if (opener) {
      setTimeout(() => {
        const g = state.groups[gid];
        if (!g) return;
        g.chat.push({ from: opener.id, text: `So... anyone gonna say something, or is it just me? 😏`, ts: now(), vocab: [], grammar: [], read: state.activeGroup === gid });
        save();
        if (state.activeGroup === gid) render();
      }, 1500);
    }
  };
}
// ---------------- 记忆系统 ----------------
// 每当用户在私聊发满 6 条消息，后台总结一次新事实进共享档案
function noteUserActivity(fid) {
  state.lastChatTime[fid] = now();
  state.msgCount[fid] = (state.msgCount[fid] || 0) + 1;
  if (state.msgCount[fid] % 6 === 0) {
    summarizeMemories(fid);
  }
}

async function summarizeMemories(fid) {
  const f = friendById(fid);
  if (!f) return;
  const cfg = state.llm || {};
  if (!cfg.key) return;
  const p = llmEndpoint(cfg);
  const recent = (state.chats[fid] || []).slice(-14).map((m) => `${m.from === "me" ? userName() : f.name}: ${m.text}`).join("\n");
  const known = (state.memories.aboutUser || []).join(" | ") || "(none yet)";
  try {
    const res = await fetch(p.url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${cfg.key}` },
      body: JSON.stringify({
        model: p.model,
        messages: [
          { role: "system", content: "Extract NEW durable facts about the user from this chat (their life, preferences, schedule, feelings — e.g. 'works night shifts', 'has a cat named Mochi'). Skip small talk. Facts already known must NOT be repeated. Write each in short Chinese. Output ONLY JSON: {\"new\":[\"fact1\",\"fact2\"]} — empty array if nothing new." },
          { role: "user", content: `Already known: ${known}\n\nRecent chat:\n${recent}` },
        ],
        temperature: 0.5,
        max_tokens: 300,
      }),
    });
    const data = await res.json();
    let s = (data.choices?.[0]?.message?.content || "").trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
    const st = s.indexOf("{"), en = s.lastIndexOf("}");
    if (st === -1) return;
    const obj = JSON.parse(s.slice(st, en + 1));
    if (!Array.isArray(obj.new)) return;
    const knownSet = new Set((state.memories.aboutUser || []).map((x) => x.trim()));
    for (const fact of obj.new) {
      if (typeof fact === "string" && fact.trim() && !knownSet.has(fact.trim())) {
        state.memories.aboutUser.push(fact.trim());
        knownSet.add(fact.trim());
      }
    }
    // 档案上限 30 条，超出删最旧的
    while (state.memories.aboutUser.length > 30) state.memories.aboutUser.shift();
    save();
  } catch (e) { /* 静默失败，不影响聊天 */ }
}

// ---------------- 主动私聊 ----------------
// 打开 App 时检查：超 36 小时没聊的好友，40% 概率主动找你；生日当天全员祝寿
async function maybeProactivePing() {
  const today = todayStr();
  // 生日祝福：优先级最高，每年一次
  const birthdayToday = state.birthday && state.birthday === today.slice(5);
  if (birthdayToday && !state.lastPingDate["__bd__" + today.slice(0, 4)]) {
    state.lastPingDate["__bd__" + today.slice(0, 4)] = true;
    save();
    for (const fid of state.friends) {
      const f = friendById(fid);
      if (!f) continue;
      setTimeout(() => {
        state.chats[fid] = state.chats[fid] || [];
        state.chats[fid].push({
          from: "friend",
          text: birthdayWish(f),
          vocab: [], grammar: [],
          ts: now(), read: false, morning: true,
        });
        save();
        if (!state.activeGroup && state.tab === "chats") render();
      }, 600 + state.friends.indexOf(fid) * 1200);
    }
    return; // 生日当天不再触发"失踪"戳
  }
  for (const fid of state.friends) {
    if (state.lastPingDate[fid] === today) continue; // 这个好友今天已经主动过
    const last = state.lastChatTime[fid] || 0;
    if (now() - last < 36 * 60 * 60 * 1000) continue; // 还没到 36 小时
    if (Math.random() > 0.4) { state.lastPingDate[fid] = today; continue; }
    state.lastPingDate[fid] = today;
    const f = friendById(fid);
    if (!f) continue;
    const days = Math.floor((now() - last) / 86400000);
    // 后台生成一条结合记忆的主动消息
    (async () => {
      let text = null;
      const cfg = state.llm || {};
      const p = llmEndpoint(cfg);
      const mems = (state.memories.aboutUser || []).slice(-6).join("; ") || "nothing specific";
      try {
        const res = await fetch(p.url, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${cfg.key}` },
          body: JSON.stringify({
            model: p.model,
            messages: [
              { role: "system", content: buildSystemPrompt(f) },
              { role: "user", content: `The user hasn't chatted with you for ${days} day(s). Send them ONE spontaneous message to reconnect — reference a memory about them, or something from your own life, and ask a question. 1-2 sentences. Output JSON: {"reply":"...","vocab":[],"grammar":[]}` },
            ],
            temperature: 1,
            max_tokens: 200,
          }),
        });
        const data = await res.json();
        let s = (data.choices?.[0]?.message?.content || "").trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
        const st = s.indexOf("{"), en = s.lastIndexOf("}");
        if (st > -1) {
          const obj = JSON.parse(s.slice(st, en + 1));
          if (obj.reply) text = obj.reply;
        }
      } catch (e) {}
      if (!text) return; // 失败就当他没找你，不造假消息
      state.chats[fid] = state.chats[fid] || [];
      state.chats[fid].push({
        from: "friend", text,
        vocab: [], grammar: [],
        ts: now(), read: false, morning: true,
      });
      save();
      if (!state.activeGroup && state.activeFriend !== fid) {
        if (state.tab === "chats" || !state.activeFriend) render();
      }
    })();
  }
}

function birthdayWish(f) {
  const pool = {
    nick: `Happy birthday, rookie. 🎂 I got you a pawpsicle. It's blueberry. You're welcome.`,
    judy: `HAPPY BIRTHDAY!!! 🎉 I ran 5 extra miles today just to celebrate! Anyone can be anything — but today, you can be the birthday star!`,
    hwangchun: `HAPPY BIRTHDAY!! 🐻🎂 Yeonjun let me pick your gift hehe~ It's a snack basket. But I already ate half. Sorry not sorry!`,
    yeonjun: `Yo, happy birthday! 🎉 Tonight's cheat day — ramyeon on me. And yes, I'll let you win at... something.`,
    sunwoo: `Yo!! Happy birthday!! 🎂 Basketball rematch later — birthday rules: you pick the court, I still win.`,
  };
  return pool[f.id] || `Happy birthday! 🎂 Wishing you the best day ever.`;
}

// ---------------- 真人私聊 ----------------
// 拉好友+申请；返回 true 表示数据有变化（调用方自行决定要不要重渲染）
async function refreshSocial() {
  if (!getToken()) return false;
  try {
    const [f, r] = await Promise.all([api("GET", "/api/friends"), api("GET", "/api/friends/requests")]);
    const nf = f.friends || [];
    const nr = r.requests || [];
    const changed =
      JSON.stringify(nf) !== JSON.stringify(state.realFriends) ||
      JSON.stringify(nr) !== JSON.stringify(state.friendRequests);
    state.realFriends = nf;
    state.friendRequests = nr;
    if (changed) save();
    return changed;
  } catch (e) {
    return false;
  }
}

function renderUserChat() {
  const uname = state.activeUserChat;
  const msgs = state.userChats[uname] || [];
  return `
    <div class="chat-page">
      <div class="topbar">
        <span class="back" id="back">‹</span>
        ${esc(uname)}
        <span class="action" style="font-size:11px;color:var(--sub)">真人</span>
      </div>
      <div class="msgs" id="msgs">
        <div class="time-divider">和真人用英语聊，错词没人给你标——大胆写</div>
        ${msgs
          .map(
            (m) => `
          <div class="msg ${m.from === "me" ? "me" : "friend"}">
            ${
              m.from === "me"
                ? myAvatarHtml("msg-avatar")
                : `<div class="avatar" style="background:linear-gradient(135deg,#f7c8d8,#c8e8f7);font-size:20px;font-weight:700;color:#666">${esc(uname.charAt(0).toUpperCase())}</div>`
            }
            <div class="bubble-wrap"><div class="bubble">${esc(m.text).replace(/\n/g, "<br>")}</div></div>
          </div>`
          )
          .join("")}
      </div>
      <div class="inputbar">
        <textarea id="input" placeholder="Type something..." rows="1"></textarea>
        <button id="send">发送</button>
      </div>
    </div>
  `;
}

function bindUserChat() {
  const uname = state.activeUserChat;
  const msgsEl = $("#msgs");
  msgsEl.scrollTop = msgsEl.scrollHeight;

  $("#back").onclick = () => {
    clearInterval(window._dmPoll);
    window._dmPoll = null;
    state.activeUserChat = null;
    save();
    render();
  };

  const input = $("#input");
  const doSend = async () => {
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    try {
      await api("POST", "/api/dm/send", { to: uname, text });
      const arr = state.userChats[uname] = state.userChats[uname] || [];
      arr.push({ from: "me", text, ts: now(), read: true });
      save();
      render();
    } catch (e) {
      showSystemNote("❌ 发送失败：" + e.message, e.message);
    }
  };
  $("#send").onclick = doSend;
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); doSend(); }
  });

  // 3 秒轮询新消息
  clearInterval(window._dmPoll);
  const poll = async () => {
    if (state.activeUserChat !== uname) { clearInterval(window._dmPoll); return; }
    try {
      const after = state.dmLastId[uname] || 0;
      const r = await api("GET", "/api/dm?with=" + encodeURIComponent(uname) + "&after=" + after);
      const arr = state.userChats[uname] = state.userChats[uname] || [];
      let added = false;
      for (const msg of r.messages || []) {
        arr.push({
          from: msg.sender === getMyUsername() ? "me" : uname,
          text: msg.text,
          ts: msg.created_at,
          read: state.activeUserChat === uname,
        });
        state.dmLastId[uname] = Math.max(state.dmLastId[uname] || 0, msg.id);
        added = true;
      }
      if (added) {
        save();
        if (state.activeUserChat === uname) {
          render();
          if (window.speechSynthesis) { /* 真人消息不自动朗读 */ }
        }
      }
    } catch (e) {}
  };
  poll();
  window._dmPoll = setInterval(poll, 3000);
}

// ---------------- 群聊界面 ----------------
function renderGroupChat() {
  const g = state.groups[state.activeGroup];
  if (!g) { state.activeGroup = null; return render(); }
  return `
    <div class="chat-page">
      <div class="topbar">
        <span class="back" id="back">‹</span>
        ${esc(g.name)}（${g.memberIds.length + 1}人）
        <span class="action">👥</span>
      </div>
      <div class="msgs" id="msgs">
        <div class="time-divider">群聊修罗场 · 他们可能互怼，请系好安全带</div>
        ${g.chat.map((m, i) => renderGroupMsg(m, i)).join("")}
      </div>
      <div class="inputbar">
        <textarea id="input" placeholder="说点什么，看谁接话…" rows="1"></textarea>
        <button id="send">发送</button>
      </div>
    </div>
  `;
}

function renderGroupMsg(m, i) {
  const mine = m.from === "me";
  const f = mine ? null : friendById(m.from);
  const av = mine ? myAvatarHtml("msg-avatar") : f ? avatarHtml(f, "msg-avatar") : "";
  const sender = mine ? "" : `<div class="g-sender">${f ? esc(f.name) : "？"}</div>`;
  return `
    <div class="msg ${mine ? "me" : "friend"} group-msg">
      ${av}
      <div class="bubble-wrap">
        ${sender}
        <div class="bubble" data-gmsg="${i}">${esc(m.text).replace(/\n/g, "<br>")}${m.viaAI ? ' <span class="ai-tag">AI</span>' : ""}</div>
      </div>
    </div>
  `;
}

function resolveMember(g, name) {
  if (!name) return null;
  const lower = String(name).toLowerCase();
  return g.memberIds.find((id) => (friendById(id)?.name || "").toLowerCase() === lower) || null;
}

async function callGroupLLM(g, userText, mentions) {
  const cfg = state.llm || {};
  if (!cfg.key) throw new Error("no-key");
  const p = llmEndpoint(cfg);
  const members = g.memberIds.map((id) => friendById(id)).filter(Boolean);
  const mentionRule = mentions && mentions.length
    ? `\n\nURGENT: The user @-mentioned these members: ${mentions.join(", ")}. Those members MUST reply FIRST and directly address the user's message. They cannot be ignored.`
    : "";
  const membersBlock = members.map((m) => `- ${m.name}: ${m.persona} (Relationship with the user: ${state.relationships[m.id] || m.relationship || "good friends"})`).join("\n");
  const transcript = g.chat
    .slice(-10)
    .map((m) => `${m.from === "me" ? "User" : friendById(m.from)?.name || "?"}: ${m.text}`)
    .join("\n");
  const system = `You are simulating a fun group chat between the members below and ONE human user.

Members:
${members.map((m) => `- ${m.name}: ${m.persona} (Relationship with the user: ${state.relationships[m.id] || m.relationship || "good friends"})`).join("\n")}
The user is ALSO a member of this group (their name is "${userName()}"). They are a real person learning English — talking WITH them is the whole point.
${memBlock()}

Rules:
1. MANDATORY: the user's newest message (last line of the transcript, labeled "User") MUST be responded to. At least one reply must directly address the user or answer their question. NEVER ignore the user or only talk among yourselves.
2. After someone responds to the user, a second member may chime in — teasing the user's message, adding a joke, or pulling the conversation somewhere new.
3. Members may banter with each other, and reference each other by name, but the user must stay involved.
4. Members should sometimes ask the user a question to keep them in the conversation.
5. Each reply: 1-2 short sentences, natural spoken English, fully in character. Never repeat previous sentences.
6. Include vocab/grammar teaching in at most 2 replies (arrays may be empty).
7. Output ONLY a JSON object, no markdown fences:
{"replies":[{"from":"MemberName","text":"...","vocab":[{"w":"word","p":"/phonetic/ or empty","m":"中文释义"}],"grammar":[{"pattern":"句型","explain":"中文讲解"}]}]}${mentionRule}`;
  const userLine = g.chat.length
    ? g.chat.slice(-10).map((m) => `${m.from === "me" ? userName() : friendById(m.from)?.name || "?"}: ${m.text}`).join("\n")
    : "(empty)";
  const body = {
    model: p.model,
    messages: [
      { role: "system", content: system },
      { role: "user", content: `Group chat transcript (oldest first):\n${userLine}\n\nThe user's NEWEST message (which you MUST respond to): "${userText}"\n\nWrite the next replies. First reply must address the user's message above.` },
    ],
    response_format: { type: "json_object" },
    temperature: cfg.provider === "zhipu" ? 0.95 : 1.1,
    max_tokens: 700,
  };
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 60000);
  let res;
  try {
    res = await fetch(p.url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${cfg.key}` },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
  } catch (e) {
    throw new Error(e.name === "AbortError" ? "timeout" : "network");
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`api-${res.status}: ${t.slice(0, 100)}`);
  }
  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content || "";
  let s = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
  const start = s.indexOf("{"), end = s.lastIndexOf("}");
  if (start === -1) throw new Error("bad-json:" + s.slice(0, 50));
  let obj;
  try { obj = JSON.parse(s.slice(start, end + 1)); } catch (e) { throw new Error("bad-json:" + s.slice(0, 50)); }
  if (!Array.isArray(obj.replies)) throw new Error("bad-json:no-replies");
  return obj.replies
    .filter((r) => r && r.text)
    .map((r) => ({
      from: r.from || "",
      text: r.text,
      vocab: Array.isArray(r.vocab) ? r.vocab.filter((v) => v && v.w && v.m) : [],
      grammar: Array.isArray(r.grammar) ? r.grammar.filter((x) => x && x.pattern && x.explain) : [],
    }));
}

function sendGroupMessage() {
  const g = state.groups[state.activeGroup];
  const input = $("#input");
  const text = input.value.trim();
  if (!text || !g) return;
  input.value = "";
  g.chat.push({ from: "me", text, ts: now(), read: true });
  save();
  // 解析 @提及（@名字，不区分大小写）
  const mentions = g.memberIds
    .map((id) => friendById(id))
    .filter((f) => f && text.toLowerCase().includes("@" + f.name.toLowerCase()))
    .map((f) => f.name);
  render();
  groupTypingAndReply(g, text, mentions);
}

function groupTypingAndReply(g, userText, mentions) {
  const msgsEl = $("#msgs");
  const typing = document.createElement("div");
  typing.className = "msg friend group-msg";
  typing.innerHTML = `<div class="avatar" style="background:#d9d9d9">👥</div><div class="bubble-wrap"><div class="bubble typing"><i></i><i></i><i></i></div></div>`;
  msgsEl.appendChild(typing);
  msgsEl.scrollTop = msgsEl.scrollHeight;

  callGroupLLM(g, userText, mentions)
    .then((replies) => {
      typing.remove();
      replies.forEach((r, i) => {
        setTimeout(() => {
          const gid = g.id || state.activeGroup;
          const gg = state.groups[gid];
          if (!gg) return;
          const fid = resolveMember(gg, r.from) || gg.memberIds[i % gg.memberIds.length];
          gg.chat.push({
            from: fid, text: r.text, vocab: r.vocab, grammar: r.grammar,
            ts: now(), read: state.activeGroup === gid, viaAI: true,
          });
          save();
          if (state.activeGroup === gid) render();
        }, 800 + i * 1800 + Math.random() * 700);
      });
      // 彩蛋：15% 概率随机群事件
      if (Math.random() < 0.15 && g.memberIds.length >= 2) {
        setTimeout(() => triggerGroupEvent(g), replies.length * 1800 + 2500);
      }
    })
    .catch((e) => {
      typing.remove();
      showSystemNote("❌ 群聊 AI 失败：" + e.message, e.message);
    });
}

// ---------------- 群事件 ----------------
const GROUP_EVENTS = [
  { type: "vote", desc: "Start a quick poll about food/snacks (e.g. hotpot vs BBQ) and demand everyone votes." },
  { type: "contest", desc: "Challenge the group to a mini contest (e.g. 'first to name 5 breakfast foods in English wins')." },
  { type: "gossip", desc: "Share a piece of funny gossip or a hot take, then ask the user for their opinion directly." },
  { type: "callout", desc: "Playfully call out the user (tease them about being quiet / their last message) and dare them to respond." },
];
async function triggerGroupEvent(g) {
  if (!state.groups[g.id] || state.activeGroup !== g.id) return;
  const cfg = state.llm || {};
  if (!cfg.key) return;
  const p = llmEndpoint(cfg);
  const initiator = friendById(g.memberIds[Math.floor(Math.random() * g.memberIds.length)]);
  if (!initiator) return;
  const ev = GROUP_EVENTS[Math.floor(Math.random() * GROUP_EVENTS.length)];
  try {
    const res = await fetch(p.url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${cfg.key}` },
      body: JSON.stringify({
        model: p.model,
        messages: [
          { role: "system", content: buildSystemPrompt(initiator) },
          { role: "user", content: `Spice up the group chat with a spontaneous event. Event type: ${ev.desc} Keep it 1-2 sentences, in character, and end with something the user must answer or do. Output JSON: {"reply":"..."}` },
        ],
        temperature: 1,
        max_tokens: 200,
      }),
    });
    const data = await res.json();
    let s = (data.choices?.[0]?.message?.content || "").trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
    const st = s.indexOf("{"), en = s.lastIndexOf("}");
    if (st === -1) return;
    const obj = JSON.parse(s.slice(st, en + 1));
    if (!obj.reply) return;
    const gg = state.groups[g.id];
    if (!gg) return;
    gg.chat.push({ from: initiator.id, text: "🎲 " + obj.reply, vocab: [], grammar: [], ts: now(), read: state.activeGroup === g.id, viaAI: true, event: true });
    save();
    if (state.activeGroup === g.id) render();
  } catch (e) {}
}

function bindGroupChat() {
  const g = state.groups[state.activeGroup];
  $("#back").onclick = () => {
    state.activeGroup = null;
    save();
    render();
  };
  const msgsEl = $("#msgs");
  msgsEl.scrollTop = msgsEl.scrollHeight;
  const input = $("#input");
  const doSend = () => sendGroupMessage();
  $("#send").onclick = doSend;
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); doSend(); }
  });
  // 点气泡 → 学习面板（群聊版）
  app.querySelectorAll("[data-gmsg]").forEach((el) => {
    el.onclick = () => openGroupPanel(parseInt(el.dataset.gmsg, 10));
  });
  // 点成员头像 → 快速 @TA
  app.querySelectorAll(".msg.friend.group-msg .avatar").forEach((el) => {
    const msgEl = el.closest(".msg");
    const idx = parseInt(msgEl.querySelector("[data-gmsg]")?.dataset.gmsg, 10);
    el.onclick = (e) => {
      e.stopPropagation();
      const m = g.chat[idx];
      const f = m && friendById(m.from);
      if (!f) return;
      const input = $("#input");
      input.value = (input.value ? input.value + " " : "") + "@" + f.name + " ";
      input.focus();
    };
  });
}

// 群聊版学习面板：复用单人面板的结构，消息来源不同
function openGroupPanel(idx) {
  const g = state.groups[state.activeGroup];
  const m = g.chat[idx];
  if (!m) return;
  currentPanelMsg = { ...m, friendId: m.from };
  if (m.from !== "me" && !m.viewed) { m.viewed = true; state.learned++; save(); }
  const vocabHtml = (m.vocab || [])
    .map((v) => `<div class="vocab-item"><span class="w">${esc(v.w)}</span><span class="p">${esc(v.p || "")}</span><div class="m">${esc(v.m)}</div></div>`)
    .join("");
  const gramHtml = (m.grammar || [])
    .map((x) => `<div class="gram-item"><b>${esc(x.pattern)}</b><br>${esc(x.explain)}</div>`)
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
    ${m.from === "me" ? `<div class="empty-tip">这是你发的消息</div>` : ""}
    ${vocabHtml ? `<div class="sec-title">📖 生词</div>${vocabHtml}` : ""}
    ${gramHtml ? `<div class="sec-title">🧩 语法</div>${gramHtml}` : ""}
    ${!vocabHtml && !gramHtml && m.from !== "me" ? `<div class="empty-tip">这条没有生词，继续聊～</div>` : ""}
  `;
  app.appendChild(mask);
  app.appendChild(panel);
  const close = () => { mask.remove(); panel.remove(); currentPanelMsg = null; if (window.speechSynthesis) speechSynthesis.cancel(); };
  mask.onclick = close;
  panel.querySelector("#closePanel").onclick = close;
  panel.querySelector("#speak").onclick = () => speak(m.text, m.from);
}

// ---------------- 混编群（真人+AI，走云端） ----------------
async function refreshServerGroups() {
  const r = await api("GET", "/api/gc/list");
  for (const g of r.groups || []) {
    const old = state.serverGroups[g.id];
    state.serverGroups[g.id] = {
      ...(old || { chat: [], lastId: 0 }),
      id: g.id, name: g.name, owner: g.owner,
      members: g.members, aiMembers: g.aiMembers,
      lastId: Math.max(old ? old.lastId || 0 : 0, g.lastId || 0),
    };
  }
  save();
}

// 服务器群消息渲染：sender 可能是 我 / 真人用户名 / "ai:角色id"
function resolveServerSender(m, g) {
  if (m.sender === getMyUsername()) return { mine: true, name: userName(), av: myAvatarHtml("msg-avatar") };
  if (m.sender.startsWith("ai:")) {
    const cid = m.sender.slice(3);
    const f = friendById(cid) || (g.aiMembers.find((a) => a.id === cid) || { name: cid.slice(0, 8), emoji: "🤖", color: "#ddd" });
    return { mine: false, name: f.name, f, av: avatarHtml(f, "msg-avatar") };
  }
  return {
    mine: false, name: m.sender,
    av: `<div class="avatar msg-avatar" style="background:linear-gradient(135deg,#f7c8d8,#c8e8f7);font-size:20px;font-weight:700;color:#666">${esc(m.sender.charAt(0).toUpperCase())}</div>`,
  };
}

function renderServerGroupChat() {
  const g = state.serverGroups[state.activeGroup];
  if (!g) { state.activeGroup = null; return render(); }
  return `
    <div class="chat-page">
      <div class="topbar">
        <span class="back" id="back">‹</span>
        ${esc(g.name)}（${g.members.length + g.aiMembers.length + 1}人）
        <span class="action" style="font-size:11px;color:var(--sub)">${g.owner === getMyUsername() ? "你是房主" : "真人"}</span>
      </div>
      <div class="msgs" id="msgs">
        <div class="time-divider">混编修罗场 · 真人和AI同场，AI由房主驱动</div>
        ${g.chat.map((m, i) => renderServerGroupMsg(m, g, i)).join("")}
      </div>
      <div class="inputbar">
        <textarea id="input" placeholder="说点什么…（@名字 点名）" rows="1"></textarea>
        <button id="send">发送</button>
      </div>
    </div>
  `;
}

function renderServerGroupMsg(m, g, i) {
  const s = resolveServerSender(m, g);
  const sender = s.mine ? "" : `<div class="g-sender">${esc(s.name)}</div>`;
  return `
    <div class="msg ${s.mine ? "me" : "friend"} group-msg">
      ${s.av}
      <div class="bubble-wrap">
        ${sender}
        <div class="bubble" data-sgmsg="${i}">${esc(m.text).replace(/\n/g, "<br>")}${m.viaAI ? ' <span class="ai-tag">AI</span>' : ""}</div>
      </div>
    </div>
  `;
}

function bindServerGroupChat() {
  const g = state.serverGroups[state.activeGroup];
  if (!g) return;
  const msgsEl = $("#msgs");
  msgsEl.scrollTop = msgsEl.scrollHeight;

  $("#back").onclick = () => {
    clearInterval(window._gcPoll);
    window._gcPoll = null;
    state.activeGroup = null;
    save();
    render();
  };

  const input = $("#input");
  const doSend = () => {
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    postServerGroupMessage(g, text, null);
  };
  $("#send").onclick = doSend;
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); doSend(); }
  });
  // 点气泡 → 学习面板
  app.querySelectorAll("[data-sgmsg]").forEach((el) => {
    el.onclick = () => openServerPanel(parseInt(el.dataset.sgmsg, 10));
  });
  // 点头像 → 快速 @（真人名字或 AI 名字）
  app.querySelectorAll(".msg.friend.group-msg .avatar").forEach((el) => {
    const msgEl = el.closest(".msg");
    const idx = parseInt(msgEl.querySelector("[data-sgmsg]")?.dataset.sgmsg, 10);
    el.onclick = (e) => {
      e.stopPropagation();
      const m = g.chat[idx];
      if (!m) return;
      const s = resolveServerSender(m, g);
      const input = $("#input");
      input.value = (input.value ? input.value + " " : "") + "@" + s.name + " ";
      input.focus();
    };
  });

  // 轮询：拉新消息 + 房主驱动 AI
  clearInterval(window._gcPoll);
  const poll = async () => {
    if (state.activeGroup !== g.id) { clearInterval(window._gcPoll); return; }
    try {
      const r = await api("GET", "/api/gc/messages?group_id=" + encodeURIComponent(g.id) + "&after=" + (g.lastId || 0));
      if (r.name) { g.name = r.name; g.owner = r.owner; g.members = r.members; g.aiMembers = r.aiMembers; }
      const arr = g.chat;
      let added = false;
      for (const msg of r.messages || []) {
        if (arr.some((x) => x.serverId === msg.id)) continue;
        arr.push({
          from: msg.sender === getMyUsername() ? "me" : msg.sender,
          text: msg.text, ts: msg.created_at,
          serverId: msg.id,
          read: state.activeGroup === g.id,
          viaAI: msg.sender.startsWith("ai:"),
        });
        g.lastId = Math.max(g.lastId || 0, msg.id);
        added = true;
      }
      if (added) {
        save();
        if (state.activeGroup === g.id) render();
        // 房主 AI 大脑：最新一条是真人（不是我）发的 → 让 AI 接话
        const newest = arr[arr.length - 1];
        const isHumanNewest = newest && newest.from !== "me" && !String(newest.from).startsWith("ai:");
        const isOwner = g.owner === getMyUsername();
        if (isOwner && isHumanNewest && !g._aiBusy) {
          g._aiBusy = true;
          serverGroupAIRound(g, newest)
            .catch((e) => showSystemNote("❌ AI 接话失败：" + e.message, e.message))
            .finally(() => { g._aiBusy = false; });
        }
      }
    } catch (e) {}
  };
  poll();
  window._gcPoll = setInterval(poll, 3000);
}

async function postServerGroupMessage(g, text, asAiId) {
  const r = await api("POST", "/api/gc/send", {
    group_id: g.id,
    text,
    ...(asAiId ? { as: "ai:" + asAiId } : {}),
  });
  const arr = g.chat;
  const sender = asAiId ? "ai:" + asAiId : getMyUsername();
  arr.push({
    from: sender === getMyUsername() ? "me" : sender,
    text, ts: now(), serverId: r.id,
    read: state.activeGroup === g.id, viaAI: !!asAiId,
  });
  g.lastId = Math.max(g.lastId || 0, r.id || 0);
  save();
  if (state.activeGroup === g.id) render();
}

// 房主侧：为混编群生成 AI 回复并 POST 到服务器
async function serverGroupAIRound(g, newMsg) {
  const aiMembers = (g.aiMembers || []).map((a) => ({ ...a, f: friendById(a.id) })).filter((a) => a.f);
  if (!aiMembers.length) return;
  const transcript = g.chat.slice(-10).map((m) => {
    const s = resolveServerSender(m, g);
    return `${s.name}: ${m.text}`;
  }).join("\n");
  const mentions = aiMembers.filter((a) => newMsg.text.toLowerCase().includes("@" + a.name.toLowerCase())).map((a) => a.name);
  const system = `You are simulating a fun group chat between AI characters below and human users (the user's name is "${userName()}").

AI characters:
${aiMembers.map((a) => `- ${a.name}: ${a.f.persona} (Relationship with the user: ${state.relationships[a.id] || a.f.relationship || "good friends"})`).join("\n")}

Real humans in this group: ${["User: " + userName()].concat((g.members || []).map((u) => "User: " + u)).join("; ")}

Rules:
1. The NEWEST message in the transcript is from a human — at least one AI character MUST respond to it directly first. NEVER ignore humans.
2. After that, a second AI character may chime in (tease, agree, or add a joke), possibly referencing other humans by name.
3. 1-2 short sentences per reply, natural spoken English, fully in character. Never repeat previous sentences.
4. Include vocab/grammar teaching in at most 1 reply (arrays may be empty).
5. Output ONLY a JSON object, no markdown fences:
{"replies":[{"from":"AICharacterName","text":"...","vocab":[],"grammar":[]}]}`;
  const cfg = state.llm || {};
  if (!cfg.key) return;
  const p = llmEndpoint(cfg);
  const res = await fetch(p.url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${cfg.key}` },
    body: JSON.stringify({
      model: p.model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: `Group transcript (oldest first):\n${transcript}\n\nWrite the next replies.` + (mentions.length ? ` The user @-mentioned: ${mentions.join(", ")} — they must reply first.` : "") },
      ],
      response_format: { type: "json_object" },
      temperature: cfg.provider === "zhipu" ? 0.95 : 1.1,
      max_tokens: 600,
    }),
  });
  if (!res.ok) throw new Error("api-" + res.status);
  const data = await res.json();
  let s = (data.choices?.[0]?.message?.content || "").trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
  const st = s.indexOf("{"), en = s.lastIndexOf("}");
  if (st === -1) throw new Error("bad-json");
  const obj = JSON.parse(s.slice(st, en + 1));
  if (!Array.isArray(obj.replies)) throw new Error("bad-json");
  let delay = 900;
  for (const r of obj.replies) {
    if (!r.text) continue;
    const member = aiMembers.find((a) => a.name.toLowerCase() === String(r.from || "").toLowerCase());
    if (!member) continue;
    const replyText = r.text;
    const replyVocab = Array.isArray(r.vocab) ? r.vocab.filter((v) => v && v.w && v.m) : [];
    const replyGram = Array.isArray(r.grammar) ? r.grammar.filter((x) => x && x.pattern && x.explain) : [];
    setTimeout(async () => {
      const gg = state.serverGroups[g.id];
      if (!gg) return;
      await postServerGroupMessageWithTeach(gg, replyText, member.id, replyVocab, replyGram);
    }, delay);
    delay += 1800;
  }
}

async function postServerGroupMessageWithTeach(g, text, aiId, vocab, grammar) {
  const r = await api("POST", "/api/gc/send", { group_id: g.id, text, as: "ai:" + aiId });
  const arr = g.chat;
  arr.push({
    from: "ai:" + aiId, text, ts: now(), serverId: r.id,
    vocab: vocab || [], grammar: grammar || [],
    read: state.activeGroup === g.id, viaAI: true,
  });
  g.lastId = Math.max(g.lastId || 0, r.id || 0);
  save();
  if (state.activeGroup === g.id) render();
}

// 混编群学习面板
function openServerPanel(idx) {
  const g = state.serverGroups[state.activeGroup];
  const m = g.chat[idx];
  if (!m) return;
  currentPanelMsg = { ...m, friendId: m.from.startsWith("ai:") ? m.from.slice(3) : null };
  if (!m.from.startsWith("ai:") && !m.viewed) { m.viewed = true; state.learned++; save(); }
  const vocabHtml = (m.vocab || [])
    .map((v) => `<div class="vocab-item"><span class="w">${esc(v.w)}</span><span class="p">${esc(v.p || "")}</span><div class="m">${esc(v.m)}</div></div>`)
    .join("");
  const gramHtml = (m.grammar || [])
    .map((x) => `<div class="gram-item"><b>${esc(x.pattern)}</b><br>${esc(x.explain)}</div>`)
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
    ${m.from === "me" ? `<div class="empty-tip">这是你发的消息</div>` : ""}
    ${vocabHtml ? `<div class="sec-title">📖 生词</div>${vocabHtml}` : ""}
    ${gramHtml ? `<div class="sec-title">🧩 语法</div>${gramHtml}` : ""}
    ${!vocabHtml && !gramHtml && !m.from.startsWith("ai:") ? `<div class="empty-tip">真人消息没有讲解</div>` : ""}
  `;
  app.appendChild(mask);
  app.appendChild(panel);
  const close = () => { mask.remove(); panel.remove(); currentPanelMsg = null; if (window.speechSynthesis) speechSynthesis.cancel(); };
  mask.onclick = close;
  panel.querySelector("#closePanel").onclick = close;
  panel.querySelector("#speak").onclick = () => speak(m.text, m.from.startsWith("ai:") ? m.from.slice(3) : null);
}

function openDiary() {
  const today = todayStr();
  const entry = state.diary[today];
  const mask = document.createElement("div");
  mask.className = "panel-mask";
  const panel = document.createElement("div");
  panel.className = "panel";
  panel.innerHTML = `
    <div class="panel-head">
      <div style="font-size:16px;font-weight:600">📔 心情日记 · ${today}</div>
      <button class="close" id="closeDiary" style="margin-left:auto">✕</button>
    </div>
    <textarea id="diaryInput" class="diary-textarea" placeholder="今天发生了什么？用英语写 3 句话试试…">${entry ? esc(entry.userText) : ""}</textarea>
    <div style="display:flex;gap:8px;margin-top:10px">
      <button class="as-btn primary" id="diarySave" style="flex:1">💾 保存</button>
      <button class="as-btn" id="diaryPolish" style="flex:1">✨ AI 帮我润色</button>
    </div>
    <div class="as-tip" id="diaryTip" style="margin-top:8px">${entry && entry.polished ? "✨ AI 润色版：" + esc(entry.polished) : "保存后随时回来看；润色会把你的句子改得更地道"}</div>
  `;
  app.appendChild(mask);
  app.appendChild(panel);
  const close = () => { mask.remove(); panel.remove(); };
  mask.onclick = close;
  panel.querySelector("#closeDiary").onclick = close;

  panel.querySelector("#diarySave").onclick = () => {
    const text = panel.querySelector("#diaryInput").value.trim();
    if (!text) return;
    state.diary[today] = state.diary[today] || { date: today, ts: now() };
    state.diary[today].userText = text;
    save();
    close();
    render();
  };
  panel.querySelector("#diaryPolish").onclick = async () => {
    const text = panel.querySelector("#diaryInput").value.trim();
    if (!text) return;
    const tip = panel.querySelector("#diaryTip");
    tip.textContent = "润色中…";
    try {
      const cfg = state.llm || {};
      const p = llmEndpoint(cfg);
      const res = await fetch(p.url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${cfg.key}` },
        body: JSON.stringify({
          model: p.model,
          messages: [
            { role: "system", content: "You are an English tutor. The user writes a short diary entry, often with small mistakes. Rewrite it in natural, native-sounding English at the same meaning, keeping it short (2-4 sentences). Output JSON: {\"polished\":\"...\",\"note\":\"一句中文点评，指出最大的改进点\"}" },
            { role: "user", content: text },
          ],
          temperature: 0.8,
          max_tokens: 300,
        }),
      });
      const data = await res.json();
      const parsed = parseLLMJson(data.choices?.[0]?.message?.content || "");
      if (parsed && parsed.polished) {
        panel.querySelector("#diaryInput").value = parsed.polished;
        tip.textContent = "✨ " + (parsed.note || "已润色");
        state.diary[today] = state.diary[today] || { date: today, ts: now() };
        state.diary[today].userText = parsed.polished;
        state.diary[today].polished = parsed.polished;
        save();
      } else {
        tip.textContent = "润色失败，稍后再试";
      }
    } catch (e) {
      tip.textContent = "润色失败：需要先在「我」页面配置 AI";
    }
  };
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
      <div class="me-card-title">☁ 账号</div>
      <div class="me-row">
        <span class="me-label">当前</span>
        <div style="flex:1;font-size:14px">@${esc(getMyUsername())} <span id="syncBadge" style="font-size:11px"></span></div>
      </div>
      <button class="as-btn" id="logoutBtn" style="width:100%;color:#c0392b">退出登录（数据已存云端，换设备登录可找回）</button>
    </div>
    <div class="me-card">
      <div class="me-card-title">👤 我的信息</div>
      <div class="me-profile">
        <div class="me-avatar-wrap" id="meAvatar" title="点击更换头像">
          ${myAvatarHtml("profile-avatar")}
          <div class="me-avatar-hint">换头像</div>
        </div>
        <div class="me-profile-info">
          <div class="me-row">
            <span class="me-label">昵称</span>
            <input id="userNameInput" class="me-input" type="text" placeholder="AI 会这样叫你" value="${esc(state.userName || "")}" maxlength="20">
          </div>
          <div class="me-row">
            <span class="me-label">生日</span>
            <input id="birthdayInput" class="me-input" type="text" placeholder="MM-DD，如 09-23（可选）" value="${esc(state.birthday || "")}" maxlength="5">
          </div>
          <button class="as-btn primary" id="saveName" style="width:100%">保存</button>
        </div>
      </div>
    </div>
    <div class="me-card">
      <div class="me-card-title">🧠 AI 记忆 <span style="font-weight:400;font-size:11px;color:var(--sub)">全员共享 · 每聊6条自动总结</span></div>
      <div class="mem-list">
        ${(state.memories.aboutUser || []).length
          ? state.memories.aboutUser
              .map((m, i) => `<div class="mem-item"><span>${esc(m)}</span><span class="mem-del" data-mem-del="${i}">✕</span></div>`)
              .join("")
          : `<div class="as-tip">还没有记录——多聊聊，AI 会自动记住关于你的事</div>`}
      </div>
      <div class="me-row" style="margin-top:8px">
        <input id="memAddInput" class="me-input" placeholder="手动补充一条，如：我对花生过敏">
        <button class="as-btn" id="memAddBtn" style="flex:none">添加</button>
      </div>
    </div>
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
  // 群聊列表
  const groupCells = Object.entries(state.groups || {})
    .map(([gid, g]) => {
      const last = g.chat[g.chat.length - 1];
      const unread = g.chat.filter((m) => m.from !== "me" && !m.read).length;
      const memberNames = g.memberIds.map((id) => friendById(id)?.name).filter(Boolean).slice(0, 3).join("、");
      return `
      <div class="cell" data-group="${gid}">
        <div class="avatar" style="background:linear-gradient(135deg,#a8d8b9,#8fc7e8)">👥</div>
        <div class="info">
          <div class="name">${esc(g.name)}</div>
          <div class="preview">${last ? esc(last.text) : "群里还没人说话"}</div>
        </div>
        <div class="meta">${last ? fmtTime(last.ts) : ""}${unread ? `<br><span class="badge">${unread}</span>` : ""}</div>
      </div>`;
    })
    .join("");
  // 真人好友列表
  const userCells = (state.realFriends || [])
    .map((uname) => {
      const msgs = state.userChats[uname] || [];
      const last = msgs[msgs.length - 1];
      const unread = msgs.filter((m) => m.from !== "me" && !m.read).length;
      const initial = uname.charAt(0).toUpperCase();
      return `
      <div class="cell" data-user-chat="${esc(uname)}">
        <div class="avatar" style="background:linear-gradient(135deg,#f7c8d8,#c8e8f7);font-size:20px;font-weight:700;color:#666">${esc(initial)}</div>
        <div class="info">
          <div class="name">${esc(uname)} <span style="font-size:10px;color:var(--sub)">真人</span></div>
          <div class="preview">${last ? esc(last.text) : "打个招呼吧"}</div>
        </div>
        <div class="meta">${last ? fmtTime(last.ts) : ""}${unread ? `<br><span class="badge">${unread}</span>` : ""}</div>
      </div>`;
    })
    .join("");
  // 服务器混编群列表
  const serverCells = Object.values(state.serverGroups || {})
    .map((g) => {
      const last = g.chat[g.chat.length - 1];
      const unread = g.chat.filter((m) => m.from !== "me" && !m.read).length;
      return `
      <div class="cell" data-group="${esc(g.id)}">
        <div class="avatar" style="background:linear-gradient(135deg,#e8c8f7,#f7d8c8)">🌐</div>
        <div class="info">
          <div class="name">${esc(g.name)} <span style="font-size:10px;color:var(--sub)">混编</span></div>
          <div class="preview">${last ? esc(last.text) : "群里还没人说话"}</div>
        </div>
        <div class="meta">${last ? fmtTime(last.ts) : ""}${unread ? `<br><span class="badge">${unread}</span>` : ""}</div>
      </div>`;
    })
    .join("");
  return `<div class="cell create-group-cell" id="createGroupBtn"><div class="avatar" style="background:#e8f9ee">➕</div><div class="info"><div class="name" style="color:var(--green)">发起群聊</div><div class="preview">拉上好友一起修罗场</div></div></div>` + items + (groupCells || serverCells ? `<div class="group-label">群聊</div>` + groupCells + serverCells : "") + (userCells ? `<div class="group-label">真人好友</div>` + userCells : "");
}

function renderContacts() {
  const addedIds = state.friends; // friends 数组本身就是 id 字符串数组
  const pending = state.friendRequests || [];
  const pendingHtml = pending.length
    ? `<div class="group-label">收到的好友申请</div>` +
      pending
        .map(
          (r) => `
      <div class="cell">
        <div class="avatar" style="background:linear-gradient(135deg,#f7c8d8,#c8e8f7);font-size:20px;font-weight:700;color:#666">${esc(r.from.charAt(0).toUpperCase())}</div>
        <div class="info"><div class="name">${esc(r.from)}</div><div class="preview">请求加你为好友</div></div>
        <button class="addbtn" data-accept-user="${esc(r.from)}">同意</button>
      </div>`
        )
        .join("")
    : "";
  const searchHtml = `
    <div class="group-label">🔍 添加真人好友（输对方用户名）</div>
    <div class="search-row">
      <input id="userSearchInput" placeholder="输入用户名搜索…" maxlength="20">
      <button id="userSearchBtn">搜索</button>
    </div>
    <div id="searchResults"></div>`;
  const realHtml = (state.realFriends || []).length
    ? `<div class="group-label">我的真人好友</div>` +
      (state.realFriends || [])
        .map(
          (uname) => `
      <div class="cell" data-user-chat="${esc(uname)}">
        <div class="avatar" style="background:linear-gradient(135deg,#f7c8d8,#c8e8f7);font-size:20px;font-weight:700;color:#666">${esc(uname.charAt(0).toUpperCase())}</div>
        <div class="info"><div class="name">${esc(uname)}</div><div class="preview">真人好友 · 点开聊天</div></div>
      </div>`
        )
        .join("")
    : "";
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
  return searchHtml + pendingHtml + realHtml + `<div class="group-label">AI 好友 · 后续会扩充更多艺人</div>` + rows;
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
  // 聊天列表：进入群聊 / 发起群聊
  app.querySelectorAll("[data-group]").forEach((el) => {
    el.onclick = () => {
      state.activeGroup = el.dataset.group;
      if (state.activeGroup.startsWith("gc-")) {
        const g = state.serverGroups[state.activeGroup];
        if (g) g.chat.forEach((m) => (m.read = true));
      } else {
        const g = state.groups[state.activeGroup];
        if (g) g.chat.forEach((m) => (m.read = true));
      }
      save();
      render();
    };
  });
  if (tab === "chats" && getToken()) {
    // 静默刷新混编群列表（5秒内不重复拉）
    if (!window._lastSgRefresh || now() - window._lastSgRefresh > 5000) {
      window._lastSgRefresh = now();
      refreshServerGroups().then(() => { if (state.tab === "chats" && !state.activeGroup) render(); });
    }
  }
  const createGroupBtn = $("#createGroupBtn");
  if (createGroupBtn) createGroupBtn.onclick = openCreateGroup;

  // 联系人页点头像 → 头像设置
  app.querySelectorAll(".cell .avatar").forEach((el) => {
    el.onclick = (e) => {
      e.stopPropagation();
      const fid = el.closest(".cell").querySelector("[data-add]");
      if (fid) openAvatarSettings(fid.dataset.add);
    };
  });
  // "我"页面事件
  // 发现页事件：日记 + 动态评论 + 自己发动态
  const diaryCard = $("#diaryCard");
  if (diaryCard) diaryCard.onclick = openDiary;
  app.querySelectorAll(".moment-input").forEach((el) => {
    el.onkeydown = (e) => {
      if (e.key === "Enter") submitMomentComment(el);
    };
  });
  const postBtn = $("#postMoment");
  if (postBtn) {
    const doPost = () => {
      const input = $("#myMomentInput");
      const text = input.value.trim();
      if (!text) return;
      input.value = "";
      publishMoment(text);
    };
    postBtn.onclick = doPost;
    $("#myMomentInput").onkeydown = (e) => {
      if (e.key === "Enter") doPost();
    };
  }

  // 联系人页：搜真人 / 同意申请 / 进真人聊天
  if (tab === "contacts") {
    refreshSocial().then((changed) => { if (changed && state.tab === "contacts" && !state.activeFriend) render(); });
    const searchBtn = $("#userSearchBtn");
    if (searchBtn) {
      const doSearch = async () => {
        const q = $("#userSearchInput").value.trim();
        const out = $("#searchResults");
        if (!q) return;
        out.innerHTML = `<div class="as-tip" style="padding:8px 0">搜索中…</div>`;
        try {
          const r = await api("GET", "/api/users/search?q=" + encodeURIComponent(q));
          const users = (r.users || []).filter((u) => u !== getMyUsername());
          if (!users.length) { out.innerHTML = `<div class="as-tip" style="padding:8px 0">没找到这个用户</div>`; return; }
          out.innerHTML = users
            .map(
              (u) => `
            <div class="cell" style="padding:8px 0">
              <div class="avatar" style="width:36px;height:36px;font-size:17px;background:linear-gradient(135deg,#f7c8d8,#c8e8f7);font-weight:700;color:#666">${esc(u.charAt(0).toUpperCase())}</div>
              <div class="info"><div class="name">${esc(u)}</div></div>
              <button class="addbtn" data-add-user="${esc(u)}">加好友</button>
            </div>`
            )
            .join("");
          out.querySelectorAll("[data-add-user]").forEach((el) => {
            el.onclick = async () => {
              el.disabled = true;
              try {
                const r2 = await api("POST", "/api/friends/request", { to: el.dataset.addUser });
                el.textContent = r2.accepted ? "✓ 已互加" : "✓ 已申请";
              } catch (e) {
                el.textContent = e.message;
              }
            };
          });
        } catch (e) {
          out.innerHTML = `<div class="as-tip" style="padding:8px 0">搜索失败：${esc(e.message)}</div>`;
        }
      };
      searchBtn.onclick = doSearch;
      $("#userSearchInput").onkeydown = (e) => { if (e.key === "Enter") doSearch(); };
    }
    app.querySelectorAll("[data-accept-user]").forEach((el) => {
      el.onclick = async () => {
        try {
          await api("POST", "/api/friends/accept", { from: el.dataset.acceptUser });
          await refreshSocial();
          render();
        } catch (e) { showSystemNote("❌ " + e.message); }
      };
    });
  }
  app.querySelectorAll("[data-user-chat]").forEach((el) => {
    el.onclick = () => {
      state.activeUserChat = el.dataset.userChat;
      (state.userChats[state.activeUserChat] || []).forEach((m) => (m.read = true));
      save();
      render();
    };
  });

  const saveNameBtn = $("#saveName");
  if (saveNameBtn) {
    saveNameBtn.onclick = () => {
      state.userName = $("#userNameInput").value.trim();
      const bd = $("#birthdayInput").value.trim();
      state.birthday = /^\d{2}-\d{2}$/.test(bd) ? bd : "";
      save();
      saveNameBtn.textContent = "✓ 已保存";
      setTimeout(() => { saveNameBtn.textContent = "保存"; }, 1600);
    };
  }
  // AI 记忆：删除 / 手动添加
  app.querySelectorAll("[data-mem-del]").forEach((el) => {
    el.onclick = () => {
      state.memories.aboutUser.splice(parseInt(el.dataset.memDel, 10), 1);
      save();
      render();
    };
  });
  const memAddBtn = $("#memAddBtn");
  if (memAddBtn) {
    const doAdd = () => {
      const input = $("#memAddInput");
      const v = input.value.trim();
      if (!v) return;
      state.memories.aboutUser.push(v);
      save();
      render();
    };
    memAddBtn.onclick = doAdd;
    $("#memAddInput").onkeydown = (e) => { if (e.key === "Enter") doAdd(); };
  }
  const meAvatar = $("#meAvatar");
  if (meAvatar) meAvatar.onclick = () => openAvatarSettings("me");
  const logoutBtn = $("#logoutBtn");
  if (logoutBtn) {
    logoutBtn.onclick = () => {
      if (!confirm("退出登录？\n你的数据已保存在云端，换任何设备登录同一个账号都能找回。")) return;
      api("POST", "/api/logout").catch(() => {});
      clearAuth(false);
      render();
    };
  }
  updateSyncBadge();

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
    noteUserActivity(f.id);
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
  // 点击头像 → 头像/关系设置（自己 vs 好友分开）
  app.querySelectorAll(".msg.me .avatar").forEach((el) => {
    el.onclick = () => openAvatarSettings("me");
  });
  app.querySelectorAll(".msg.friend .avatar").forEach((el) => {
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
    ${isMe ? "" : `
    <div class="rel-edit">
      <div class="sec-title">💞 TA 和你的关系（决定 TA 对你的语气）</div>
      <textarea id="relInput" class="diary-textarea" placeholder="描述你们的关系，比如：他是我的损友，天天怼我但很护我">${esc(state.relationships[targetId] || f.relationship || "")}</textarea>
      <button class="as-btn" id="saveRel" style="width:100%;margin-top:8px">保存关系设定</button>
    </div>
    <div class="rel-edit">
      <div class="sec-title">🗝️ 我们的专属回忆（只属于你们俩）</div>
      <div class="mem-list">
        ${(state.memories.perChar[targetId] || []).length
          ? state.memories.perChar[targetId]
              .map((m, i) => `<div class="mem-item"><span>${esc(m)}</span><span class="mem-del" data-pmem-del="${i}">✕</span></div>`)
              .join("")
          : `<div class="as-tip">还什么都没记住，聊天中你们的故事会出现在这里</div>`}
      </div>
      <div class="me-row" style="margin-top:8px">
        <input id="pmemAddInput" class="me-input" placeholder="手动记一条，如：我们约好周末吃火锅">
        <button class="as-btn" id="pmemAddBtn" style="flex:none">添加</button>
      </div>
    </div>`}
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
  const relBtn = panel.querySelector("#saveRel");
  if (relBtn) {
    relBtn.onclick = () => {
      const v = panel.querySelector("#relInput").value.trim();
      if (v) state.relationships[targetId] = v;
      else delete state.relationships[targetId]; // 清空则回到默认人设
      save();
      relBtn.textContent = "✓ 已保存，下次对话生效";
      setTimeout(() => (relBtn.textContent = "保存关系设定"), 1600);
    };
  }
  // 专属回忆：删除 / 添加（改完即时生效，不关闭面板）
  panel.querySelectorAll("[data-pmem-del]").forEach((el) => {
    el.onclick = () => {
      const arr = state.memories.perChar[targetId] || [];
      arr.splice(parseInt(el.dataset.pmemDel, 10), 1);
      if (arr.length) state.memories.perChar[targetId] = arr;
      else delete state.memories.perChar[targetId];
      save();
      el.closest(".mem-item").remove();
      if (!arr.length) panel.querySelector(".mem-list").innerHTML = `<div class="as-tip">还什么都没记住，聊天中你们的故事会出现在这里</div>`;
    };
  });
  const pmemBtn = panel.querySelector("#pmemAddBtn");
  if (pmemBtn) {
    pmemBtn.onclick = () => {
      const input = panel.querySelector("#pmemAddInput");
      const v = input.value.trim();
      if (!v) return;
      state.memories.perChar[targetId] = state.memories.perChar[targetId] || [];
      state.memories.perChar[targetId].push(v);
      save();
      const listEl = panel.querySelector(".mem-list");
      const tip = listEl.querySelector(".as-tip");
      if (tip) tip.remove();
      const item = document.createElement("div");
      item.className = "mem-item";
      item.innerHTML = `<span>${esc(v)}</span><span class="mem-del">✕</span>`;
      listEl.appendChild(item);
      input.value = "";
      item.querySelector(".mem-del").onclick = () => {
        const arr = state.memories.perChar[targetId] || [];
        const idx = arr.indexOf(v);
        if (idx > -1) arr.splice(idx, 1);
        if (!arr.length) delete state.memories.perChar[targetId];
        save();
        item.remove();
      };
    };
  }
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
if (!getToken()) {
  renderAuthScreen("login");
} else {
  maybeMorningNudge();   // 早安戳一戳（含节日彩蛋）
  ensureDailyMoments();  // 每日好友动态
  maybeProactivePing();  // 主动私聊（失踪戳 + 生日祝福）
  render();
  refreshServerGroups().then(() => { if (!state.activeGroup && !state.activeFriend && !state.activeUserChat) render(); });
  // 后台拉云端：其他设备可能有更新
  api("GET", "/api/data").then((r) => {
    if (!r.data) { queueCloudSync(); return; }
    const server = JSON.parse(r.data);
    const serverAt = server._syncedAt || r.updated_at || 0;
    if (serverAt > (state._syncedAt || 0)) {
      state = server;
      load();
      render();
    }
  }).catch(() => {});
}
