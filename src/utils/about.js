/** Electron 窗口和 shell API */
const { BrowserWindow, shell } = require('electron');
/** Node.js 文件系统模块 */
const fs = require('fs');
/** Node.js 路径处理模块 */
const path = require('path');

/** 当前打开的关于窗口引用（同一时间只允许一个） */
let aboutWin = null;

/**
 * 打开自定义关于窗口。
 * 如果已有窗口打开，先关闭再重新创建。
 * @param {Object} appInfo - 本地化应用信息
 * @param {Object} t - 当前语言翻译文本
 */
const openAboutWindow = (appInfo, t) => {
  /** 关闭已存在的关于窗口 */
  if (aboutWin && !aboutWin.isDestroyed()) {
    /** 销毁旧窗口 */
    aboutWin.destroy();
  }
  /** 构建图标文件路径 */
  const iconPath = path.join(__dirname, '../../assets', 'icon.png');
  /** 读取图标并转为 base64 data URL */
  const iconBase64 = fs.readFileSync(iconPath).toString('base64');

  /** 构建关于页面 HTML 模板路径 */
  const templatePath = path.join(__dirname, '../../assets', 'about.html');
  /** 读取 HTML 模板内容 */
  let html = fs.readFileSync(templatePath, 'utf-8');

  /** 替换图标占位符为 base64 data URL */
  html = html.replace('{{ICON}}', 'data:image/png;base64,' + iconBase64);
  /** 替换应用名称占位符（全局替换，页头和底部各一处） */
  html = html.replace(/{{NAME}}/g, appInfo.name);
  /** 替换版本标签占位符 */
  html = html.replace('{{VERSION_LABEL}}', t.version);
  /** 替换版本号占位符 */
  html = html.replace('{{VERSION}}', appInfo.version);
  /** 替换作者标签占位符 */
  html = html.replace('{{AUTHOR_LABEL}}', t.author);
  /** 替换作者名占位符 */
  html = html.replace('{{AUTHOR}}', appInfo.author);
  /** 替换描述标签占位符 */
  html = html.replace('{{DESCRIPTION_LABEL}}', t.description);
  /** 替换描述内容占位符 */
  html = html.replace('{{DESCRIPTION}}', appInfo.description);
  /** 替换网站标签占位符 */
  html = html.replace('{{WEBSITE_LABEL}}', t.website);
  /** 替换网站地址占位符（全局替换，href 和显示文本各一处） */
  html = html.replace(/{{WEBSITE}}/g, appInfo.website);
  /** 替换年份占位符 */
  html = html.replace('{{YEAR}}', String(new Date().getFullYear()));

  /** 创建关于窗口 */
  aboutWin = new BrowserWindow({
    /** 窗口宽度（像素） */
    width: 420,
    /** 窗口高度（像素） */
    height: 360,
    /** 禁止调整窗口大小 */
    resizable: false,
    /** 自动隐藏菜单栏 */
    autoHideMenuBar: true,
    /** 模态窗口，阻塞父窗口 */
    modal: true,
    /** 窗口标题 */
    title: t.about + ' ' + appInfo.name,
    /** 禁用最小化按钮 */
    minimizable: false,
    /** 禁用最大化按钮 */
    maximizable: false,
    /** 深色背景色 */
    backgroundColor: '#1f2937',
    /** 渲染进程 Web 偏好设置 */
    webPreferences: {
      /** 开启上下文隔离（安全） */
      contextIsolation: true,
      /** 关闭 Node.js 集成（安全） */
      nodeIntegration: false,
    },
  });

  /** 移除窗口内置菜单栏 */
  aboutWin.setMenuBarVisibility(false);

  /** 将 HTML 加载到窗口 */
  aboutWin.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html));

  /** 拦截 window.open 调用，用系统默认浏览器打开 */
  aboutWin.webContents.setWindowOpenHandler(({ url }) => {
    /** 用系统默认浏览器打开链接 */
    shell.openExternal(url);
    /** 阻止在 Electron 内打开新窗口 */
    return { action: 'deny' };
  });

  /** 拦截页面内导航，外部链接用系统浏览器打开 */
  aboutWin.webContents.on('will-navigate', (_event, url) => {
    /** 非 data: 协议（即外部链接）则用浏览器打开 */
    if (!url.startsWith('data:')) {
      /** 阻止在窗口内导航 */
      _event.preventDefault();
      /** 用系统默认浏览器打开 */
      shell.openExternal(url);
    }
  });

  /** 窗口关闭时清除引用 */
  aboutWin.on('closed', () => {
    /** 置空引用 */
    aboutWin = null;
  });
};

/**
 * 关闭关于窗口（语言切换时调用）。
 */
const closeAboutWindow = () => {
  /** 窗口存在且未销毁则关闭 */
  if (aboutWin && !aboutWin.isDestroyed()) {
    /** 销毁窗口 */
    aboutWin.destroy();
  }
};

/** 导出 openAboutWindow 和 closeAboutWindow */
module.exports = { openAboutWindow, closeAboutWindow };
