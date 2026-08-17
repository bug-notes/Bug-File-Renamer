/**
 * IPC 通道注册模块。
 * 将所有 ipcMain.handle 集中管理。
 */
const ipcRegister = (ipcMain, mainWindow, app, dialog, path, fs, shell, net) => {

  /** 已知用户文件夹的路径 → 本地化显示名映射 */
  const knownFolderNames = {};

  /**
   * macOS / Windows：磁盘文件夹名是英文（Desktop），需要映射为本地化显示名。
   * 通过 app.getLocale() 判断语言，对照翻译表。
   * Linux：磁盘名本身就是本地化的，不需要映射。
   */
  if (process.platform === 'darwin' || process.platform === 'win32') {
    /** 系统当前语言 */
    const locale = app.getLocale();
    /** 是否为中文系统 */
    const isZh = typeof locale === 'string' && locale.startsWith('zh');
    /** 用户标准文件夹 key 及中英文显示名 */
    const folderDefs = [
      { key: 'desktop', zh: '桌面', en: 'Desktop' },
      { key: 'downloads', zh: '下载', en: 'Downloads' },
      { key: 'documents', zh: '文稿', en: 'Documents' },
      { key: 'music', zh: '音乐', en: 'Music' },
      { key: 'pictures', zh: '图片', en: 'Pictures' },
      { key: 'videos', zh: '视频', en: 'Videos' },
    ];
    /** 遍历构建路径→本地化显示名映射 */
    for (const d of folderDefs) {
      try {
        const realPath = app.getPath(d.key);
        knownFolderNames[realPath] = isZh ? d.zh : d.en;
      } catch { /* 跳过当前平台不支持的 key */ }
    }
  }

  /* Linux：磁盘文件夹名本身就是本地化的（中文系统磁盘上就是"桌面"），
     readdirSync 拿到的直接就是正确显示名，无需 knownFolderNames 映射。 */

  /* IPC 通道：文件对话框 */

  /** 显示消息对话框（供渲染进程使用） */
  ipcMain.handle('dialog:showMessageBox', async (_event, options) => {
    /** 调用系统原生对话框并返回用户选择 */
    const result = await dialog.showMessageBox(mainWindow, options);
    /** 返回 response 和 checkboxChecked */
    return { response: result.response, checkboxChecked: result.checkboxChecked };
  });

  /* IPC 通道：文件系统操作 */

  /** 打开多文件选择对话框 */
  ipcMain.handle('dialog:openFiles', async () => {
    /** 调用系统原生对话框 API */
    const result = await dialog.showOpenDialog(mainWindow, {
      /** 允许选择多个文件 */
      properties: ['openFile', 'multiSelections'],
      /** 接受所有文件类型 */
      filters: [{ name: 'All Files', extensions: ['*'] }],
    });
    /** 取消时返回空数组，否则返回文件路径列表 */
    return result.canceled ? [] : result.filePaths;
  });

  /** 打开文件夹选择对话框 */
  ipcMain.handle('dialog:openFolder', async () => {
    /** 调用系统原生文件夹选择对话框 */
    const result = await dialog.showOpenDialog(mainWindow, {
      /** 限制为仅选择目录 */
      properties: ['openDirectory'],
    });
    /** 取消时返回 null，否则返回选中的文件夹路径 */
    return result.canceled ? null : result.filePaths[0];
  });

  /* IPC 通道：文件系统操作 */

  /** 读取目录内容 */
  ipcMain.handle('fs:readDir', async (_event, dirPath) => {
    try {
      /** 同步读取目录条目（带文件类型信息） */
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });
      /** 文件列表 */
      const files = [];
      /** 子目录列表 */
      const dirs = [];
      /** 遍历区分文件和目录 */
      for (const entry of entries) {
        /** 排除隐藏文件/目录（以点开头） */
        if (entry.name.startsWith('.')) continue;
        /** 目录则加入子目录列表 */
        if (entry.isDirectory()) {
          /** 拼接完整路径 */
          const fullPath = path.join(dirPath, entry.name);
          /** 检查是否为已知用户文件夹，使用本地化显示名 */
          const displayName = knownFolderNames[fullPath] || entry.name;
          /** 子目录入队（含路径和显示名） */
          dirs.push({ name: displayName, path: fullPath });
        /** 文件则加入文件列表 */
        } else if (entry.isFile()) {
          /** 文件入队（含路径） */
          files.push({ name: entry.name, path: path.join(dirPath, entry.name) });
        }
      }
      /** 返回分类后的文件和目录列表 */
      return { files, dirs };
    } catch (err) {
      /** 权限不足等错误，返回错误信息 */
      return { error: err.message };
    }
  });

  /** 递归读取目录下所有文件 */
  ipcMain.handle('fs:readDirRecursive', async (_event, dirPath) => {
    /** 累积结果列表 */
    const results = [];
    /** 递归 walk 内部函数 */
    function walk(dir) {
      /** 尝试读取目录，跳过无权限目录 */
      try {
        /** 同步读取当前目录条目 */
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        /** 遍历每个条目 */
        for (const entry of entries) {
          /** 排除隐藏文件/目录（以点开头） */
          if (entry.name.startsWith('.')) continue;
          /** 拼接完整路径 */
          const fullPath = path.join(dir, entry.name);
          /** 目录则递归进入 */
          if (entry.isDirectory()) { walk(fullPath); }
          /** 文件则加入结果 */
          else if (entry.isFile()) { results.push({ name: entry.name, path: fullPath }); }
        }
      } catch { /* 跳过无权限目录 */ }
    }
    /** 启动递归遍历 */
    walk(dirPath);
    /** 返回所有文件列表 */
    return results;
  });

  /** 获取平台文件系统根目录条目 */
  ipcMain.handle('fs:getSystemRoots', async () => {
    /** Node.js os 模块 */
    const os = require('os');

    /** macOS / Linux：用户主目录作为唯一根节点，展开后即为桌面、下载等 */
    if (process.platform === 'darwin' || process.platform === 'linux') {
      /** 获取用户主目录路径 */
      const home = os.homedir();
      /** 以用户名作为显示名 */
      return [{ name: path.basename(home), path: home }];
    }

    /** Windows：常用用户文件夹 + 驱动器盘符（显示名复用 knownFolderNames 映射） */
    /** 根节点列表 */
    const roots = [];
    /** 用户标准文件夹 key 列表（与 knownFolderNames 构建一致） */
    const winKeys = ['desktop', 'downloads', 'documents', 'music', 'pictures', 'videos'];
    /** 遍历检查每个标准用户文件夹是否存在 */
    for (const key of winKeys) {
      try {
        /** 获取系统标准路径 */
        const p = app.getPath(key);
        /** 确认目录可访问 */
        fs.accessSync(p);
        /** 以本地化名称加入列表 */
        const displayName = knownFolderNames[p] || path.basename(p);
        roots.push({ name: displayName, path: p });
      } catch { /* 文件夹不存在或无法访问则跳过 */ }
    }
    /** 遍历 A-Z 盘符 */
    for (let c = 'A'.charCodeAt(0); c <= 'Z'.charCodeAt(0); c++) {
      /** 拼接盘符路径 */
      const drive = String.fromCharCode(c) + ':\\';
      try {
        /** 检测驱动器是否可访问 */
        fs.accessSync(drive);
        /** 可访问则加入列表 */
        roots.push({ name: drive, path: drive });
      } catch { /* 跳过不可用驱动器 */ }
    }
    /** 返回文件夹和驱动器列表 */
    return roots;
  });

  /** 批量执行文件重命名 */
  ipcMain.handle('fs:renameBatch', async (_event, operations) => {
    /** 结果列表 */
    const results = [];
    /** 遍历每条重命名操作 */
    for (const { oldPath, newPath } of operations) {
      try {
        /** 执行同步重命名 */
        fs.renameSync(oldPath, newPath);
        /** 记录成功 */
        results.push({ oldPath, newPath, status: 'ok' });
      } catch (err) {
        /** 记录失败及错误原因 */
        results.push({ oldPath, newPath, status: 'error', error: err.message });
      }
    }
    /** 返回所有操作的结果 */
    return results;
  });

  /** 获取文件创建和修改时间 */
  ipcMain.handle('fs:getFileDates', async (_event, filePath) => {
    try {
      /** 同步获取文件状态信息 */
      const stat = fs.statSync(filePath);
      /** 返回创建时间和修改时间（毫秒时间戳） */
      return { createdAt: stat.birthtime.getTime(), modifiedAt: stat.mtime.getTime() };
    } catch {
      /** 获取失败时返回 0 */
      return { createdAt: 0, modifiedAt: 0 };
    }
  });

  /** 获取文件所在目录 */
  ipcMain.handle('fs:getPathForFile', async (_event, filePath) => {
    /** 通过路径 API 提取所在目录 */
    return path.dirname(filePath);
  });

  /* IPC 通道：系统 shell */

  /** 在系统默认浏览器打开外部链接 */
  ipcMain.handle('shell:openExternal', async (_event, url) => {
    /** 仅允许 https 协议 */
    if (!url.startsWith('https://') && !url.startsWith('http://')) return;
    /** 调用系统默认浏览器打开 */
    await shell.openExternal(url);
  });

  /** 检查 URL 是否可访问（返回状态码） */
  ipcMain.handle('net:checkUrl', async (_event, url) => {
    return new Promise((resolve) => {
      /** 发起请求检查状态码 */
      const req = net.request({ url, method: 'HEAD' });
      /** 收到响应 */
      req.on('response', (res) => {
        /** 返回状态码 */
        resolve(res.statusCode);
      });
      /** 请求失败 */
      req.on('error', () => {
        /** 返回 0 表示无法访问 */
        resolve(0);
      });
      /** 超时 5 秒 */
      req.on('timeout', () => {
        /** 返回 0 表示超时 */
        resolve(0);
      });
      /** 发送请求 */
      req.end();
    });
  });
};

module.exports = { ipcRegister };
