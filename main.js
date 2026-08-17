/** Electron 主进程 API */
const { app, BrowserWindow, ipcMain, dialog, protocol, net, nativeImage, shell } = require('electron');
/** Node.js 路径处理模块 */
const path = require('path');
/** Node.js 文件系统模块 */
const fs = require('fs');
/** 自动更新模块 */
const { autoUpdater } = require('electron-updater');
/** 菜单模块（src/utils/menu.js，菜单构建和语言切换） */
const { buildAndSet, getSysLang, text } = require('./src/utils/menu.js');
/** IPC 通道注册模块（src/utils/ipc.js，所有 ipcMain.handle 集中管理） */
const { ipcRegister } = require('./src/utils/ipc.js');

/** 读取 appInfo.json */
const appInfoRaw = JSON.parse(fs.readFileSync(path.join(__dirname, 'appInfo.json'), 'utf-8'));

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

/** 主窗口实例引用 */
let mainWindow = null;

/**
 * 创建并配置主窗口。
 */
function createWindow() {
  /** 获取系统语言 */
  const lang = getSysLang(app);
  /** 获取本地化应用信息 */
  const appInfo = getAppInfo(lang);

  /** 实例化 BrowserWindow */
  mainWindow = new BrowserWindow({
    /** 窗口宽度（像素） */
    width: 1400,
    /** 窗口高度（像素） */
    height: 880,
    /** 最小窗口宽度 */
    minWidth: 1100,
    /** 最小窗口高度 */
    minHeight: 880,
    /** 窗口标题（显示在标题栏，根据系统语言本地化） */
    title: appInfo.title,
    /** 应用图标路径（macOS Dock / Windows 任务栏） */
    icon: path.join(__dirname, 'assets', 'icon.png'),
    /** 窗口背景色（深灰色，消除白屏闪烁） */
    backgroundColor: '#1f2937',
    /** 渲染进程 Web 偏好设置 */
    webPreferences: {
      /** 预加载脚本路径（安全桥梁） */
      preload: path.join(__dirname, 'preload.js'),
      /** 开启上下文隔离（安全） */
      contextIsolation: true,
      /** 关闭 Node.js 集成（安全） */
      nodeIntegration: false,
      /** 开启 webview 标签支持（广告区域等） */
      webviewTag: true,
    },
    /** macOS 隐藏标题栏，仅保留红绿灯按钮 */
    titleBarStyle: 'hiddenInset',
  });

  /** 根据运行环境加载不同入口 */
  if (process.env.NODE_ENV === 'development') {
    /** 开发环境：加载 Vite 开发服务器地址 */
    mainWindow.loadURL('http://localhost:5173');
    /** 自动打开 Chrome DevTools */
    mainWindow.webContents.openDevTools();
  } else {
    /** 生产环境：加载构建后的 app:// 协议页面 */
    mainWindow.loadURL('app://./index.html');

    /** 拦截 DevTools 打开 */
    mainWindow.webContents.on('devtools-opened', () => {
      /** 立即关闭 DevTools */
      mainWindow.webContents.closeDevTools();
    });

    /** 拦截 F12 和 Cmd/Ctrl+Shift+I 开发者工具快捷键 */
    mainWindow.webContents.on('before-input-event', (_event, input) => {
      /** F12 键 */
      if (input.key === 'F12') {
        /** 拦截 F12 */
        _event.preventDefault();
      }
      /** Cmd/Ctrl + Shift + I */
      if ((input.meta || input.control) && input.shift && input.key.toLowerCase() === 'i') {
        /** 拦截组合键 */
        _event.preventDefault();
      }
    });

    /** 禁止窗口导航到外部 URL（防钓鱼劫持） */
    mainWindow.webContents.on('will-navigate', (_event, url) => {
      /** 仅允许 app:// 协议，其他一律阻止 */
      if (!url.startsWith('app://')) {
        /** 阻止导航到外部 URL */
        _event.preventDefault();
      }
    });

    /** 禁止通过 window.open 打开新窗口或弹窗 */
    mainWindow.webContents.setWindowOpenHandler(() => {
      /** 返回 deny 阻止所有弹窗 */
      return { action: 'deny' };
    });
  }
}

/** 注册自定义 app:// 协议 */
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { standard: true, secure: true, supportFetchAPI: true, stream: true } },
]);

/** 防止同时弹出多个更新对话框 */
let updateDialogOpen = false;

/**
 * 强制更新：检测到新版本后弹出对话框，用户必须更新否则退出。
 * 启动时静默检测（无更新不弹窗），菜单手动触发时给出反馈。
 * @param {boolean} isManual - 是否由用户手动触发（菜单点击）
 */
const checkForUpdates = (isManual = false) => {
  /** 根据系统语言获取翻译文本 */
  const lang = getSysLang(app);
  /** 获取当前语言的翻译对象，回退英文 */
  const t = text[lang] || text.en;

  /** 清除 update-not-available 残留监听器 */
  autoUpdater.removeAllListeners('update-not-available');
  /** 清除 error 残留监听器 */
  autoUpdater.removeAllListeners('error');

  /** 监听：无可用更新（仅手动触发时弹窗提示） */
  autoUpdater.once('update-not-available', () => {
    /** 仅手动触发时显示对话框 */
    if (isManual) {
      /** 弹出"已是最新版本"对话框 */
      dialog.showMessageBox(mainWindow, {
        /** 信息类型 */
        type: 'info',
        /** 标题 */
        title: t.checkUpdate,
        /** 当前版本号 */
        message: 'v' + appInfoRaw.version,
        /** 详细说明 */
        detail: t.latest,
      });
    }
  });

  /** 监听：更新出错 */
  autoUpdater.once('error', () => {
    /** 解锁对话框状态 */
    updateDialogOpen = false;
    /** 仅手动触发时显示错误提示 */
    if (isManual) {
      /** 弹出更新失败对话框 */
      dialog.showMessageBox(mainWindow, {
        /** 错误类型 */
        type: 'error',
        /** 标题 */
        title: t.checkUpdate,
        /** 错误消息 */
        message: t.updateError,
        /** 确认按钮 */
        buttons: ['OK'],
      });
    }
  });

  /** 触发更新检测 */
  autoUpdater.checkForUpdates().catch(() => {});
};

/** 注册持久的更新事件监听（update-available / update-downloaded 多次触发均需响应） */

/** 监听：发现新版本 */
autoUpdater.on('update-available', () => {
  /** 根据系统语言获取翻译文本 */
  const lang = getSysLang(app);
  /** 获取当前语言的翻译对象，回退英文 */
  const t = text[lang] || text.en;
  /** 已有对话框打开则跳过 */
  if (updateDialogOpen) return;
  /** 标记对话框已打开 */
  updateDialogOpen = true;
  /** 弹出强制更新对话框（仅「立即更新」和「退出应用」两个选项） */
  dialog.showMessageBox(mainWindow, {
    /** 警告类型 */
    type: 'warning',
    /** 对话框标题 */
    title: t.checkUpdate,
    /** 主消息 */
    message: t.updateAvailable,
    /** 按钮文本 */
    buttons: [t.updateNow, t.quitApp],
    /** 默认选中第一个按钮 */
    defaultId: 0,
    /** 取消按钮索引（第二个按钮 = 退出） */
    cancelId: 1,
  }).then(({ response }) => {
    /** 用户选择「立即更新」 */
    if (response === 0) {
      /** 解除对话框锁定 */
      updateDialogOpen = false;
      /** 弹出下载中提示 */
      dialog.showMessageBox(mainWindow, {
        /** 信息类型 */
        type: 'info',
        /** 标题 */
        title: t.checkUpdate,
        /** 下载中消息 */
        message: t.downloading,
        /** 确认按钮 */
        buttons: ['OK'],
      });
    } else {
      /** 用户选择「退出应用」或关闭对话框 */
      app.quit();
    }
  });
});

/** 监听：更新下载完成 */
autoUpdater.on('update-downloaded', () => {
  /** 根据系统语言获取翻译文本 */
  const lang = getSysLang(app);
  /** 获取当前语言的翻译对象，回退英文 */
  const t = text[lang] || text.en;
  /** 已有对话框打开则跳过 */
  if (updateDialogOpen) return;
  /** 标记对话框已打开 */
  updateDialogOpen = true;
  /** 弹出重启安装提示 */
  dialog.showMessageBox(mainWindow, {
    /** 信息类型 */
    type: 'info',
    /** 标题 */
    title: t.checkUpdate,
    /** 主消息 */
    message: t.updateReady,
    /** 按钮 */
    buttons: [t.restartNow, t.quitApp],
    /** 默认选中第一个 */
    defaultId: 0,
  }).then(({ response }) => {
    /** 用户选择「立即重启」 */
    if (response === 0) {
      /** 退出并安装更新 */
      autoUpdater.quitAndInstall();
    } else {
      /** 用户选择「退出应用」 */
      app.quit();
    }
  });
});

/**
 * 应用就绪回调。
 */
app.whenReady().then(() => {
  /** 拼接 macOS Dock 图标路径 */
  const iconPath = path.join(__dirname, 'assets', 'icon.png');
  /** 仅在 macOS 平台设置 Dock 图标 */
  if (process.platform === 'darwin' && app.dock) {
    /** 使用原生图标 API 设置 Dock 图标 */
    app.dock.setIcon(nativeImage.createFromPath(iconPath));
  }

  /** 注册 app:// 协议处理器 */
  protocol.handle('app', (request) => {
    /** 解析请求路径，去除协议前缀 */
    const requestedPath = request.url.replace('app://./', '');
    /** 构建本地文件绝对路径 */
    const filePath = path.join(__dirname, 'dist', requestedPath || 'index.html');
    /** 通过 net.fetch 返回本地文件内容 */
    return net.fetch('file:///' + filePath.replace(/\\/g, '/'));
  });

  /** 获取初始系统语言 */
  const initLang = getSysLang(app);

  /** 创建主窗口（内部使用 initLang 设置标题） */
  createWindow();

  /** 构建应用菜单 */
  buildAndSet(app, mainWindow, initLang);

  /** 注册所有 IPC 通道 */
  ipcRegister(ipcMain, mainWindow, app, dialog, path, fs, shell, net);

  /** 从 appInfo.json 读取更新检测地址 */
  autoUpdater.setFeedURL({ provider: 'generic', url: appInfoRaw.updateUrl });

  /** 启动时静默强制检测更新（无更新时不弹窗） */
  checkForUpdates(false);
});

/** 所有窗口关闭时触发（macOS 上不退出应用，保持 dock 驻留） */
app.on('window-all-closed', () => {
  /** 非 macOS 平台直接退出应用 */
  if (process.platform !== 'darwin') app.quit();
});

/** macOS 点击 Dock 图标时触发（重新创建窗口） */
app.on('activate', () => {
  /** 所有窗口都关闭时重新创建主窗口 */
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

/** 导出 getAppInfo 供 menu.js 动态导入，导出 checkForUpdates 供更新检测 */
module.exports = { getAppInfo, checkForUpdates };
