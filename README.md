# 拜托吃早饭 🍳

一个角色扮演式英语学习应用：添加你喜欢的"好友"，用英语聊天，每条 AI 回复都自带生词讲解、语法点和中英双语朗读。

## 特性

- 💬 微信风格聊天界面（聊天 / 联系人 / 发现 / 我）
- 🤖 AI 角色扮演：好友由 LLM 驱动，人设鲜明、记住你说过的细节、不重复自己
- 📖 每条消息可展开查看生词释义与语法讲解（AI 实时生成）
- 🔊 网页朗读（后续将绑定角色音色）
- 🖼️ 自定义头像：给自己和好友上传任意图片
- 📱 纯前端实现，数据全部存在浏览器本地

## 运行

双击 `index.html` 用浏览器打开即可，无需构建。

## 配置 AI（必须）

1. 打开应用 →「我」→ 🤖 AI 大脑
2. 选择接口并粘贴 API Key：
   - **智谱 GLM**（免费）：[open.bigmodel.cn](https://open.bigmodel.cn) 注册后创建
   - **Google Gemini**（免费额度）：[aistudio.google.com/apikey](https://aistudio.google.com/api-key)
   - **DeepSeek**：[platform.deepseek.com](https://platform.deepseek.com)
3. 点「测试连接」确认，然后去聊天吧

> API Key 只保存在你自己浏览器的 localStorage 中，不经过任何第三方服务器，直接从你的浏览器发给你选择的 AI 平台。

## 技术栈

原生 HTML / CSS / JavaScript，零依赖零构建。OpenAI 兼容接口对接（智谱 / Gemini / DeepSeek）。

## Roadmap

- [ ] 接入 TTS，为每个角色绑定差异化音色
- [ ] 单词本 / 每日复习（发现页）
- [ ] 学习统计与打卡（我的页）
- [ ] Capacitor 打包成手机 APP
