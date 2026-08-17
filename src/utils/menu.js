/** Electron 菜单构建和对话框 API */
const { Menu, dialog } = require('electron');
/** Node.js 文件系统模块（用于读取 JSON） */
const fs = require('fs');
/** Node.js 路径处理模块 */
const path = require('path');
/** 关于窗口模块 */
const { openAboutWindow, closeAboutWindow } = require('./about.js');

/** 读取 appInfo.json 原始内容 */
const appInfoRaw = JSON.parse(fs.readFileSync(path.join(__dirname, '../../appInfo.json'), 'utf-8'));

/**
 * 根据语言获取本地化的应用信息。
 * @param {string} lang - 语言代码 ('zh'|'en')
 * @returns {Object} 本地化应用信息（含 version）
 */
const getAppInfo = (lang) => {
  /** 返回扁平化的本地化应用信息 */
  return {
    /** 应用名称 */
    name: appInfoRaw.name[lang] || appInfoRaw.name.en,
    /** 应用标题 */
    title: appInfoRaw.title[lang] || appInfoRaw.title.en,
    /** 应用描述 */
    description: appInfoRaw.description[lang] || appInfoRaw.description.en,
    /** 网站地址（语言无关） */
    website: appInfoRaw.website,
    /** 作者（语言无关） */
    author: appInfoRaw.author,
    /** 版本号（语言无关） */
    version: appInfoRaw.version,
  };
};

/**
 * 菜单国际化文本。
 * 中文 (zh) 和英文 (en)，key 对应功能标签。
 */
const text = {
  zh: {
    /** 设置菜单标题 */
    settings: '设置',
    /** 语言子菜单标题 */
    language: '语言',
    /** 帮助菜单标题 */
    help: '帮助',
    /** 关于标签 */
    about: '关于',
    /** 检测更新标签 */
    checkUpdate: '检测更新',
    /** 正在检查更新提示 */
    checking: '正在检查更新...',
    /** 已是最新版本提示 */
    latest: '当前已是最新版本。',
    /** 版本标签 */
    version: '版本',
    /** 作者标签 */
    author: '作者',
    /** 描述标签 */
    description: '描述',
    /** 网站标签 */
    website: '网站',
    /** 发现新版本提示 */
    updateAvailable: '检测到新版本，必须更新后才能继续使用。',
    /** 立即更新按钮 */
    updateNow: '立即更新',
    /** 退出应用按钮 */
    quitApp: '退出应用',
    /** 正在下载提示 */
    downloading: '正在下载更新，请稍候...',
    /** 更新下载完成提示 */
    updateReady: '更新已下载完成，是否立即重启安装？',
    /** 立即重启按钮 */
    restartNow: '立即重启',
    /** 更新失败提示 */
    updateError: '更新检测失败，请检查网络连接后重试。',
  },
  en: {
    /** 设置菜单标题 */
    settings: 'Settings',
    /** 语言子菜单标题 */
    language: 'Language',
    /** 帮助菜单标题 */
    help: 'Help',
    /** 关于标签 */
    about: 'About',
    /** 检测更新标签 */
    checkUpdate: 'Check for Updates',
    /** 正在检查更新提示 */
    checking: 'Checking for updates...',
    /** 已是最新版本提示 */
    latest: 'You are up to date.',
    /** 版本标签 */
    version: 'Version',
    /** 作者标签 */
    author: 'Author',
    /** 描述标签 */
    description: 'Description',
    /** 网站标签 */
    website: 'Website',
    /** 发现新版本提示 */
    updateAvailable: 'A new version is available. You must update to continue.',
    /** 立即更新按钮 */
    updateNow: 'Update Now',
    /** 退出应用按钮 */
    quitApp: 'Quit',
    /** 正在下载提示 */
    downloading: 'Downloading update, please wait...',
    /** 更新下载完成提示 */
    updateReady: 'Update downloaded. Restart now to install?',
    /** 立即重启按钮 */
    restartNow: 'Restart Now',
    /** 更新失败提示 */
    updateError: 'Update check failed. Please check your network and try again.',
  },
};

/**
 * 根据系统语言检测当前使用的语言代码。
 * @param {Object} app - Electron app 实例
 * @returns {string} 'zh' 或 'en'
 */
const getSysLang = (app) => {
  /** 获取系统语言，若未获取到则回退英文 */
  const locale = app.getLocale() || 'en';
  /** 以 zh 开头返回 'zh'，否则返回 'en' */
  return locale.startsWith('zh') ? 'zh' : 'en';
};

/**
 * 构建并设置应用菜单。
 * 包含「设置」菜单（语言切换）和「帮助」菜单（检测更新、关于）。
 * @param {Object} app - Electron app 实例
 * @param {BrowserWindow} mainWindow - 主窗口引用
 * @param {string} lang - 当前语言代码 ('zh'|'en')
 */
const buildMenu = (app, mainWindow, lang) => {
  /** 获取当前语言的翻译文本，不存在时回退英文 */
  const t = text[lang] || text.en;
  /** 获取本地化应用信息 */
  const appInfo = getAppInfo(lang);
  /** 检测是否 macOS 平台（需要额外 appMenu） */
  const isMac = process.platform === 'darwin';
  /** 检测是否开发环境（显示 DevTools 开关） */
  const isDev = process.env.NODE_ENV === 'development';

  /** 使用 Electron 原生 API 构建菜单模板 */
  const menu = Menu.buildFromTemplate([
    /** macOS 专属：系统级应用菜单（包含关于、退出等） */
    ...(isMac ? [{ role: 'appMenu' }] : []),
    /** ── 设置菜单 ── */
    {
      /** 设置菜单标题 */
      label: t.settings,
      /** 设置子菜单 */
      submenu: [
        {
          /** 语言选项（含子菜单） */
          label: t.language,
          /** 语言子菜单 */
          submenu: [
            {
              /** English 选项标签 */
              label: 'English',
              /** radio 类型，单选互斥 */
              type: 'radio',
              /** 当前语言为英文时选中 */
              checked: lang === 'en',
              /** 点击时切换语言 */
              click: () => {
                /** 关闭已打开的关于窗口 */
                closeAboutWindow();
                /** 重新构建菜单，切换为英文 */
                buildAndSet(app, mainWindow, 'en');
                /** 通过 IPC 通知渲染进程切换语言 */
                mainWindow.webContents.send('menu:setLang', 'en');
                /** 更新窗口标题为英文 */
                mainWindow.setTitle(getAppInfo('en').title);
              },
            },
            {
              /** 中文选项标签 */
              label: '中文',
              /** radio 类型，单选互斥 */
              type: 'radio',
              /** 当前语言为中文时选中 */
              checked: lang === 'zh',
              /** 点击时切换语言 */
              click: () => {
                /** 关闭已打开的关于窗口 */
                closeAboutWindow();
                /** 重新构建菜单，切换为中文 */
                buildAndSet(app, mainWindow, 'zh');
                /** 通过 IPC 通知渲染进程切换语言 */
                mainWindow.webContents.send('menu:setLang', 'zh');
                /** 更新窗口标题为中文 */
                mainWindow.setTitle(getAppInfo('zh').title);
              },
            },
          ],
        },
        /**
         * 开发模式下追加分隔线和 DevTools 开关。
         * 生产环境此处为空（不显示）。
         */
        ...(isDev ? [{ type: 'separator' }, { role: 'toggleDevTools' }] : []),
      ],
    },
    /** ── 帮助菜单 ── */
    {
      /** 帮助菜单标题 */
      label: t.help,
      /** 帮助子菜单 */
      submenu: [
        {
          /** 检测更新菜单项 */
          label: t.checkUpdate,
          /** 点击回调 */
          click: () => {
            /** 弹出"正在检查"的提示框 */
            dialog.showMessageBox(mainWindow, {
              /** 信息类型对话框 */
              type: 'info',
              /** 对话框标题 */
              title: t.checkUpdate,
              /** 对话框消息 */
              message: t.checking,
              /** 按钮文本 */
              buttons: ['OK'],
            });
            /** require main.js 导出的强制更新函数（避免循环依赖） */
            const { checkForUpdates } = require('../../main.js');
            /** 手动触发强制更新检测（无更新时会有提示） */
            checkForUpdates(true);
          },
        },
        {
          /** 关于菜单项 */
          label: t.about,
          /** 点击回调 */
          click: () => {
            /** 打开自定义关于窗口 */
            openAboutWindow(appInfo, t);
          },
        },
      ],
    },
  ]);
  /** 将构建好的菜单模板设置为应用菜单 */
  Menu.setApplicationMenu(menu);
};

/**
 * 菜单构建入口函数。
 * 如果未显式传入语言代码，从系统自动检测。
 * @param {Object} app - Electron app 实例
 * @param {BrowserWindow} mainWindow - 主窗口
 * @param {string} [lang] - 可选的语言代码
 */
const buildAndSet = (app, mainWindow, lang) => {
  /** 未传语言则自动检测系统语言 */
  buildMenu(app, mainWindow, lang || getSysLang(app));
};

/** 导出 buildAndSet、getSysLang 和 text 供 main.js 使用 */
module.exports = { buildAndSet, getSysLang, text };
