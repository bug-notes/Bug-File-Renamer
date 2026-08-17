/** Electron 安全桥梁：contextBridge */
const { contextBridge, ipcRenderer } = require('electron');

/**
 * 通过 contextBridge 向渲染进程暴露安全的 API 子集。
 * 渲染进程通过 window.electronAPI 访问，无法直接接触 Node/Electron 内部。
 */
contextBridge.exposeInMainWorld('electronAPI', {

  /* ── 文件对话框 ── */

  /** 打开系统消息对话框，返回 { response, checkboxChecked } */
  showMessageBox: (options) => ipcRenderer.invoke('dialog:showMessageBox', options),
  /** 打开系统多文件选择对话框，返回选中文件的完整路径数组 */
  openFileDialog: () => ipcRenderer.invoke('dialog:openFiles'),
  /** 打开系统文件夹选择对话框，返回选中文件夹的完整路径 */
  openFolderDialog: () => ipcRenderer.invoke('dialog:openFolder'),

  /* ── 文件系统操作 ── */

  /** 读取指定目录内容，返回 { files, dirs } */
  readDir: (dirPath) => ipcRenderer.invoke('fs:readDir', dirPath),
  /** 递归读取目录下所有文件（含嵌套子目录） */
  readDirRecursive: (dirPath) => ipcRenderer.invoke('fs:readDirRecursive', dirPath),
  /** 获取平台文件系统根目录条目（Windows: 驱动器列表，macOS/Linux: /） */
  getSystemRoots: () => ipcRenderer.invoke('fs:getSystemRoots'),
  /** 批量执行文件重命名，传入 [{oldPath, newPath}]，返回执行结果数组 */
  renameBatch: (operations) => ipcRenderer.invoke('fs:renameBatch', operations),
  /** 获取文件的创建时间和修改时间（毫秒时间戳） */
  getFileDates: (filePath) => ipcRenderer.invoke('fs:getFileDates', filePath),
  /** 获取文件所在目录路径 */
  getPathForFile: (filePath) => ipcRenderer.invoke('fs:getPathForFile', filePath),

  /* ── 系统 shell ── */

  /** 检查 URL 是否可访问，返回状态码（200 表示可用） */
  checkUrl: (url) => ipcRenderer.invoke('net:checkUrl', url),
  /** 在系统默认浏览器打开链接 */
  openExternal: (url) => ipcRenderer.invoke('shell:openExternal', url),

  /* ── 系统信息 ── */

  /** 获取当前平台标识（darwin / win32 / linux） */
  getPlatform: () => process.platform,

  /* ── 菜单事件监听 ── */

  /**
   * 监听主进程菜单触发的操作事件。
   * @param {Function} callback - 回调 (action: string, payload: any)
   */
  onMenuAction: (callback) => {
    /** 语言切换事件：payload 为 'zh' 或 'en' */
    ipcRenderer.on('menu:setLang', (_event, lang) => callback('setLang', lang));
    /** 打开文件夹事件 */
    ipcRenderer.on('menu:openFolder', () => callback('openFolder'));
  },
});
