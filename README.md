<p align="center"><img src="./icon.png" width="100" height="100" alt="" style="flex-shrink:0;" /></p>
<p align="center"><strong style="font-size:32px;">Bug文件重命名</strong></p>
<p align="center"><strong>跨平台批量文件重命名 · 7 种规则 · 实时预览 · 冲突检测 · 一键完成</strong></p>
<p align="center"><strong>几百个文件名一秒改完，选文件 → 设规则 → 一键完成，像写公式一样批量重命名</strong></p>
<p align="center">
  <img src="https://img.shields.io/badge/macOS-Intel%20%7C%20Apple%20Silicon-blue" alt="macOS">
  <img src="https://img.shields.io/badge/Windows-x64%20%7C%20x86-green" alt="Windows">
  <img src="https://img.shields.io/badge/Linux-x64%20%7C%20ARM-orange" alt="Linux">
</p>
<p align="right"><a href="./README.en.md">English</a> · 中文</p>

---

![screenshot](./screenshot-cn.png)

---

## 📥 下载

> 部分安装包超过 100MB，请到 [GitHub Releases](https://github.com/bug-notes/Bug-File-Renamer/releases/tag/release) 下载。

[![GitHub Release](https://img.shields.io/badge/GitHub-Release-3b82f6?logo=github)](https://github.com/bug-notes/Bug-File-Renamer/releases/tag/release)



## ⚡ 核心亮点

- **👁️ 实时预览** — 执行前看到每个文件的最终命名效果，不改错一个
- **🔀 冲突检测** — 重名自动加序号区分，不会覆盖或丢失任何文件
- **📂 拖拽导入** — 文件或文件夹直接拖入窗口，自动识别并递归子目录
- **✅ 批量勾选** — 全选 / 反选 / 单选，只处理你需要的文件
- **🖥️ 跨平台** — macOS / Windows / Linux 统一界面和体验，无需学习
- **⚡ 本地处理** — 纯本地引擎，不联网，大文件量秒级响应
- **🌐 中文/英文** — 根据系统语言自动切换，中文用户零门槛

---

## 🔧 7 种命名规则

- **🔢 序号** — 自定义前缀、后缀、起始值、步长、补零位数，正序倒序随心切
- **✏️ 修改** — 文件名前/后追加文字，或指定位置插入任意内容
- **✂️ 删除** — 按位置精确删除、删除指定文字、从末尾删除 N 个字符
- **🔄 替换** — 普通文本替换或正则表达式替换，区分大小写、全局或单次
- **🔤 转换** — 全大写 / 全小写 / 首字母大写 / 汉字转拼音
- **📎 扩展名** — 统一修改扩展名，支持大小写转换，或直接去掉扩展名
- **📅 日期** — 提取文件创建或修改时间，自定义格式生成日期标记

---

## 🌍 支持平台

- 🍎 **macOS** Intel (x64) / Apple Silicon (ARM) → `.dmg`
- 🪟 **Windows** x64 / x86 (32 位) → `.exe` 安装包 + 便携版
- 🐧 **Linux** x64 / ARM → `.AppImage`

---

## 💡 适用场景

- 📷 **摄影** — 几百张照片，按规则一键批量改名，不用手动一个个重命名
- 🎬 **视频** — 无人机或相机素材，自动按项目名+拍摄日期编号，后期剪辑不再混乱
- 👨‍💻 **开发** — 重构代码时批量改文件名、加统一前缀或后缀，保持项目规范
- 🧪 **测试** — 按序号生成测试用例文件，日志按日期归档，一目了然
- 📄 **合同** — 扫描件和电子合同按公司名+日期规范化命名，查找不再翻半天
- 🎵 **音乐** — 批量去掉文件名中的广告水印或乱码，整理成规范的歌单格式
- 📚 **电子书** — 书库按作者+书名统一格式，阅读器里整齐排布
- 🏠 **日常** — 微信、QQ 下载的图片按日期整理，清爽告别杂乱文件夹
- 🧹 **运维** — 服务器日志按日期归档，定时清理过期文件，脚本化管理

---

## 🛠️ 技术文档

### 基本介绍

- **名称**：`Bug File Renamer`（`Bug` 文件重命名）
- **定位**：跨平台桌面端文件名批量修改工具
- **作者**：`Bug` 笔记
- **版本**：`1.0.0`
- **官网**：`www.seeseeu.cn`
- **开源地址**：`github.com/bug-notes/Bug-File-Renamer`
- **支持平台**：`macOS`（`Intel` + `Apple Silicon`）、`Windows`（`x64` + `x86`）、`Linux`（`x64` + `ARM`）
- **语言**：中文 / `English`，跟随系统自动切换

### 技术栈

- **Electron `25`** — 桌面端框架。成熟稳定、跨平台兼容好、社区庞大、`electron-builder` 打包生态完善
- **Vue `3.4`** — 前端 `UI` 框架。响应式系统天然适合实时预览场景、`Composition API` 逻辑复用清晰、体积小
- **Vite `4.5`** — 构建工具。开发秒级热更新、构建快、原生支持 `Vue SFC`、配置简洁
- **electron-builder `24`** — 打包发布。一键输出 `dmg`/`nsis`/`AppImage`、自动签名、多架构支持
- **electron-updater `6`** — 自动更新。与 `electron-builder` 无缝集成、支持 `generic` 静态服务、强制更新机制
- **@vitejs/plugin-vue `4.6`** — `Vue SFC` 编译。`Vite` 官方插件、编译 `.vue` 单文件组件
- **Node.js test（内置）** — 单元测试。零依赖、原生支持、与项目工具链一致

### 架构设计

#### 整体架构

- **主进程**（`Electron Main Process`）— 窗口管理、系统菜单、自动更新、自定义协议、`IPC` 处理
- **安全桥梁**（`Preload Script`）— `contextBridge` 暴露安全 `API`，隔离 `Node.js` 环境
- **渲染进程**（`Vue 3 SPA`）— `UI` 交互、规则引擎计算、状态管理、国际化

#### 数据流

- **文件导入**（主进程 → `IPC` → 渲染进程）— 通过系统对话框或拖拽获取文件路径，`readDir` 读取目录内容
- **规则配置**（渲染进程组件 → `store`）— 用户在规则面板配置参数，写入全局响应式 `store.tabParams`
- **预览计算**（`store` → `renamer.js` → 组件）— 规则引擎按固定顺序链式处理文件名，结果写入 `file.newName`
- **执行重命名**（渲染进程 → `IPC` → 主进程）— `renameBatch` 传递操作列表，主进程调用 `fs.renameSync`
- **结果回流**（主进程 → `IPC` → 渲染进程）— 返回每条操作的成功/失败状态，更新 `file.status`

#### 安全设计

- **上下文隔离**（`contextIsolation: true`）— 渲染进程无法直接访问 `Node.js`/`Electron` 内部
- **禁用 Node 集成**（`nodeIntegration: false`）— 防止渲染进程执行系统级代码
- **协议白名单**（仅放行 `app://` 协议）— 阻止导航到外部 `URL`，防钓鱼劫持
- **禁止弹窗**（`setWindowOpenHandler` 返回 `deny`）— 防止恶意站点打开新窗口
- **生产禁用 DevTools**（拦截 `F12` 和 `Cmd+Shift+I`）— 防止用户误开/恶意调试
- **外部链接隔离**（`shell.openExternal` 仅放行 `https`）— 在系统默认浏览器打开，不污染应用窗口

#### 组件设计

##### 布局

- **`App.vue`** — 根组件，三栏布局容器，菜单事件监听
- **`TopBar.vue`**（父：`App`）— 顶部工具栏（应用图标、标题、预览/应用按钮）
- **`FileTree.vue`**（父：`App`）— 左侧文件树（系统目录、展开/折叠、权限检测）
- **`FileTable.vue`**（父：`App`）— 中间文件列表（表格、勾选、拖拽导入）
- **`RulePanel.vue`**（父：`App`）— 右侧规则面板（`Tab` 切换、重置、广告位）
- **`TreeNode.vue`**（父：`FileTree`）— 递归树节点（展开/折叠/锁定图标）

##### 规则 Tab 组件

- **`TabNumbering.vue`**（父：`RulePanel`）— 序号规则参数表单
- **`TabModify.vue`**（父：`RulePanel`）— 修改规则参数表单
- **`TabDelete.vue`**（父：`RulePanel`）— 删除规则参数表单
- **`TabReplace.vue`**（父：`RulePanel`）— 替换规则参数表单
- **`TabConvert.vue`**（父：`RulePanel`）— 转换规则参数表单
- **`TabExtension.vue`**（父：`RulePanel`）— 扩展名规则参数表单
- **`TabDate.vue`**（父：`RulePanel`）— 日期规则参数表单

##### 广告组件

- **`AdBanner.vue`**（父：`RulePanel`）— 底部广告位（`webview`）

### 目录设计

#### 根目录

- **`main.js`**（入口）— `Electron` 主进程，窗口创建、菜单、更新、协议注册
- **`preload.js`**（入口）— 安全桥梁，通过 `contextBridge` 暴露 `window.electronAPI`
- **`vite.config.js`**（配置）— `Vite` 构建配置，入口、输出、混淆、开发服务器
- **`package.json`**（配置）— 依赖管理、`npm scripts`、`electron-builder` 打包配置
- **`appInfo.json`**（配置）— 应用元信息（中英文名称、描述、版本、更新地址）

#### 入口与状态

- **`src/index.html`**（入口）— `HTML` 入口，挂载 `#app` 节点
- **`src/main.js`**（入口）— `Vue` 应用创建、`store` 注入、全局样式引入
- **`src/App.vue`**（根组件）— 三栏布局 + 菜单事件监听
- **`src/store/index.js`**（状态）— 全局响应式 `store`（文件列表、当前文件夹、激活 `Tab`、规则参数）

#### 国际化

- **`src/i18n/index.js`**（引擎）— 翻译引擎，嵌套 `key` 查找 + 占位符替换
- **`src/i18n/zh.js`**（词条）— 中文翻译
- **`src/i18n/en.js`**（词条）— 英文翻译

#### 布局组件

- **`src/layout/TopBar.vue`**（布局）— 顶部工具栏
- **`src/layout/FileTree.vue`**（布局）— 左侧文件树
- **`src/layout/TreeNode.vue`**（布局）— 递归树节点
- **`src/layout/FileTable.vue`**（布局）— 中间文件列表
- **`src/layout/RulePanel.vue`**（布局）— 右侧规则面板

#### Tab 组件

- **`src/components/tabs/TabNumbering.vue`**（业务）— 序号规则参数表单
- **`src/components/tabs/TabModify.vue`**（业务）— 修改规则参数表单
- **`src/components/tabs/TabDelete.vue`**（业务）— 删除规则参数表单
- **`src/components/tabs/TabReplace.vue`**（业务）— 替换规则参数表单
- **`src/components/tabs/TabConvert.vue`**（业务）— 转换规则参数表单
- **`src/components/tabs/TabExtension.vue`**（业务）— 扩展名规则参数表单
- **`src/components/tabs/TabDate.vue`**（业务）— 日期规则参数表单

#### 广告组件

- **`src/components/ad/AdBanner.vue`**（业务）— 底部广告位

#### 工具与引擎

- **`src/utils/renamer.js`**（引擎）— 重命名引擎（预览、冲突检测、冲突解决、执行）
- **`src/utils/rules.mjs`**（引擎）— `7` 种规则函数实现
- **`src/utils/filename.mjs`**（引擎）— 文件名解析（`parseFilename`）与合并（`joinFilename`）
- **`src/utils/menu.js`**（工具）— 菜单构建、语言切换、翻译文本
- **`src/utils/ipc.js`**（工具）— `IPC` 通道注册（对话框、文件系统、`Shell`、网络检查）
- **`src/utils/about.js`**（工具）— 关于窗口创建与模板渲染

#### 样式

- **`src/styles/main.css`**（样式）— 全局样式（按钮、输入框、工具提示、布局、状态标签、暗色背景）

#### 静态资源

- **`assets/icon.png`**（资源）— 应用图标
- **`assets/icon.svg`**（资源）— 顶部工具栏 `SVG` 图标
- **`assets/about.html`**（资源）— 关于窗口 `HTML` 模板

#### 测试

- **`tests/filename.test.mjs`**（测试）— 文件名解析/合并
- **`tests/numbering.test.mjs`**（测试）— 序号规则
- **`tests/modify.test.mjs`**（测试）— 修改规则
- **`tests/delete.test.mjs`**（测试）— 删除规则
- **`tests/replace.test.mjs`**（测试）— 替换规则
- **`tests/convert.test.mjs`**（测试）— 转换规则
- **`tests/extension.test.mjs`**（测试）— 扩展名规则
- **`tests/date.test.mjs`**（测试）— 日期规则
- **`tests/rename-exec.test.mjs`**（测试）— 重命名执行流程

#### 构建产物

- **`dist/`**（输出）— `Vite` 构建产物
- **`release/`**（输出）— `electron-builder` 打包产物（`dmg`/`exe`/`AppImage`）

### 功能设计

#### 三栏布局

- **左侧文件树**（`320px`）— 系统常用目录快速访问、文件夹展开/折叠、权限检测、拖拽后自动展开目标路径
- **中间文件列表**（自适应）— 文件表格（原名称/新名称/扩展名/状态）、全选/反选/清空、拖拽导入
- **右侧规则面板**（`320px`）— `7` 个规则 `Tab` 切换、参数配置、重置按钮、底部广告位
- **顶部工具栏**（全宽）— 应用图标 + 标题 + 预览/应用按钮、`macOS` 红绿灯偏移、窗口拖拽区域

#### 文件树

- **默认目录** — `Desktop`/`Downloads`/`Documents`/`Pictures`/`Music` 系统路径一键访问
- **懒加载** — 点击展开时动态加载子目录，初始仅加载根节点
- **权限感知** — 无权限目录显示锁定图标，点击弹窗引导用户去系统设置授权
- **状态保持** — 刷新后恢复之前的展开状态，不丢失导航位置
- **拖拽联动** — 拖入文件/文件夹后自动展开到目标目录

#### 文件列表

- **表格展示** — 原文件名、新文件名（预览后显示）、扩展名、状态（原始/已修改/已重命名/错误）
- **文件图标** — 根据扩展名自动匹配 `Font Awesome` 图标 + 颜色区分（图片橙色、音频紫色、视频红色、`PDF` 红色、代码绿色）
- **批量选择** — 全选/反选/清空/单选、显示已选数量 `N/M`
- **拖拽导入** — 支持拖入文件或文件夹，文件夹自动递归子目录
- **系统文件** — 隐藏文件（`.` 开头）和系统文件（`Thumbs.db`/`Desktop.ini`）灰色区分
- **底部路径栏** — 显示当前文件夹完整路径

#### 7 种重命名规则

- **序号** — 按序号重命名文件。参数：前缀/后缀、起始值、步长、补零位数、正序/倒序、序号位置（名前/名后）
- **修改** — 文件名添加/插入文字。参数：文件名前添加、文件名后添加、指定位置插入
- **删除** — 从文件名中移除字符。参数：删除指定文字（全局匹配）、按位置删除 `N` 个字符、从末尾删除 `N` 个字符
- **替换** — 查找并替换文件名文本。参数：查找文本、替换文本、正则模式、区分大小写、全局替换
- **转换** — 改变文件名大小写形式。参数：全大写/全小写/首字母大写/汉字转拼音
- **扩展名** — 修改文件扩展名。参数：更改为指定扩展名、扩展名转大写/小写、删除扩展名
- **日期** — 以文件日期重命名。参数：日期来源（创建/修改时间）、自定义格式（`yyyy-MM-dd_HHmm` 等）、命名方式（替换/前缀/后缀）

#### 规则链引擎

- **执行顺序** — `delete` → `replace` → `convert` → `modify` → `numbering` → `date` → `extension`
- **链式处理** — 每个规则的输出作为下一个规则的输入，当前名称逐步变换
- **跳过未配置** — 参数为空的规则自动跳过，不影响文件名
- **序号特殊处理** — 仅默认值（`start=1`/`step=1`/`padding=2`）视为未配置
- **日期预处理** — 预览前通过 `IPC` 获取文件时间戳并缓存，避免重复请求

#### 冲突检测与解决

- **检测** — 遍历所有已修改文件，按新名称完整路径分组，同一目标出现 `2` 次及以上视为冲突
- **解决** — 保留第一个文件原名，后续重复文件在扩展名前加 `(1)`/`(2)` 等序号后缀
- **执行时机** — 在预览计算之后、实际重命名之前自动执行

#### 国际化

- **语言检测** — 启动时读取 `app.getLocale()`，以 `zh` 开头返回中文，否则英文
- **翻译引擎** — 支持嵌套 `key`（如 `fileTable.title`），支持 `{0}`/`{1}` 占位符替换
- **覆盖范围** — 菜单、窗口标题、组件文本、状态标签、错误提示、关于窗口
- **实时切换** — 菜单切换语言后通过 `IPC` 通知渲染进程 `setLang`，所有组件响应式更新
- **应用标题** — 从 `appInfo.json` 实时读取，主进程与渲染进程保持同步

#### 自动更新

- **检测机制** — 启动时静默检测（无更新不弹窗），菜单手动触发（无更新给出反馈）
- **强制更新** — 检测到新版本必须更新，仅提供"立即更新"和"退出应用"两个选项
- **下载反馈** — 弹出"正在下载"提示，下载完成后提示"立即重启安装"
- **防重复弹窗** — `updateDialogOpen` 标志位防止多个更新对话框同时弹出
- **更新源** — `appInfo.json` 的 `updateUrl` 字段，使用 `generic` 静态服务

#### 关于窗口

- **窗口类型** — 模态窗口（阻塞父窗口）、固定 `420x360`、不可调整大小
- **内容渲染** — 读取 `assets/about.html` 模板，替换占位符（图标 `base64`、名称、版本、作者、描述、网站）
- **外部链接** — 拦截导航和 `window.open`，用系统默认浏览器打开
- **生命周期** — 语言切换时自动关闭、关闭后清除引用、同一时间只允许一个实例

#### 开发与构建

- **`npm run dev`** — 启动 `Vite` 开发服务器（`localhost:5173`），热更新
- **`npm run build`** — `Vite` 构建前端到 `dist/`
- **`npm run start`** — 构建 + 启动 `Electron` 应用
- **`npm test`** — 运行 `Node.js` 原生测试（`tests/` 目录）
- **`npm run build:mac`** — 构建 + 打包为 `macOS dmg`（`x64` + `arm64`）
- **`npm run build:win`** — 构建 + 打包为 `Windows nsis` 安装包 + 便携版（`x64` + `ia32`）
- **`npm run build:linux`** — 构建 + 打包为 `Linux AppImage`（`x64` + `arm64`）
- **`npm run build:all`** — 构建 + 全平台打包

#### 打包输出

- **`macOS`** — `.dmg`，`x64` + `arm64`（通用）
- **`Windows`** — `.exe` 安装包（`NSIS`）+ 便携版，`x64` + `ia32`
- **`Linux`** — `.AppImage`，`x64` + `arm64`

---

## 📧 反馈与联系

有好的想法或建议：**foreverox@vip.qq.com**
官网：[www.seeseeu.cn](https://www.seeseeu.cn)

---

<p align="center">© 2026 Bug笔记 · 个人软件工坊</p>
