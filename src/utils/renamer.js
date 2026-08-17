/** 所有重命名规则函数 */
import { numbering, modify, deleteRule, replace, convert, extension, dateRule } from './rules.mjs';

/** 规则标识名 → apply 函数映射 */
const ruleMap = { numbering, modify, delete: deleteRule, replace, convert, extension, date: dateRule };

/** 当前平台的路径分隔符（从预加载 API 同步获取，回退到 /） */
const pathSep = (() => {
  /** 尝试从预加载 API 获取平台标识 */
  try {
    /** 判断是否为 Windows 平台并返回对应分隔符 */
    return window.electronAPI?.getPlatform?.() === 'win32' ? '\\' : '/';
  } catch { /* 获取失败回退到 Unix 分隔符 */ }
  /** 异常回退：返回 Unix 分隔符 */
  return '/';
})();

/**
 * 拼接文件夹路径和文件名（平台感知）。
 * @param {string} folder - 文件夹路径
 * @param {string} name - 文件名
 * @returns {string} 完整路径
 */
const joinPath = (folder, name) => {
  /** folder 为空则直接返回文件名 */
  if (!folder) return name;
  /** 使用平台分隔符拼接路径 */
  return folder + pathSep + name;
};

/**
 * 检查某个 Tab 是否有用户配置的有效参数。
 * 未配置的规则将被跳过，不影响文件名。
 * @param {string} tabId - Tab 标识
 * @param {Object} params - 该 Tab 的参数对象
 * @returns {boolean} 是否已配置
 */
const isConfigured = (tabId, params) => {
  /** 序号和日期规则有完整的内置默认值，空参数也能产出有意义结果 */
  if (tabId === 'numbering' || tabId === 'date') return true;
  /** 其他规则：无参数对象或空对象视为未配置 */
  if (!params || Object.keys(params).length === 0) return false;
  /** 有有效配置，返回 true */
  return true;
};

/**
 * 计算预览文件名。
 * 只应用当前激活 Tab 的规则（规则独立，不叠加）。
 * 始终以 originalName（原始/上次 Apply 后的文件名）为基准。
 * @param {Object} store - 全局响应式 store
 */
export const previewRenames = async (store) => {
  /** 筛选勾选的文件 */
  const checkedFiles = store.files.filter((f) => f.checked);
  /** 无勾选文件则返回提示 */
  if (checkedFiles.length === 0) return { ok: false, reason: 'noSelection' };
  /** 当前激活的 Tab 标识 */
  const tabId = store.activeTab;
  /** 当前 Tab 的规则参数 */
  const params = store.tabParams?.[tabId] || {};
  /** 规则未配置则返回提示 */
  if (!isConfigured(tabId, params)) return { ok: false, reason: 'notConfigured', tabId };
  /** 获取对应规则函数 */
  const fn = ruleMap[tabId];
  /** 规则函数不存在则返回 */
  if (!fn) return { ok: false, reason: 'noRule' };
  /** 勾选文件总数（供序号反转用） */
  const totalCount = checkedFiles.length;

  /** 日期规则需预先从主进程获取文件时间戳 */
  if (tabId === 'date') {
    /** 遍历勾选文件获取时间戳 */
    for (const file of checkedFiles) {
      /** 只获取尚未缓存的时间戳 */
      if (file.createdAt === undefined) {
        /** 调用主进程获取文件时间戳 */
        const dates = await window.electronAPI.getFileDates(file.path);
        /** 缓存创建时间 */
        file.createdAt = dates.createdAt;
        /** 缓存修改时间 */
        file.modifiedAt = dates.modifiedAt;
      }
    }
  }

  /** 逐文件应用当前规则 */
  checkedFiles.forEach((file, idx) => {
    /** 以原始文件名（首次加载或上次 Apply 后）为基准 */
    const originalName = file.originalName || file.name;
    /** 构造虚拟文件对象，name 为原始文件名 */
    const virtualFile = { ...file, name: originalName };
    /** 扩展参数，加入文件总数 */
    const extendedParams = { ...params, _totalCount: totalCount };
    /** 应用当前规则获取新文件名 */
    const newName = fn(virtualFile, extendedParams, idx);
    /** 写入预览名称 */
    file.newName = newName;
    /** 与原始文件名比较判断是否实际修改 */
    file.status = newName === originalName ? 'original' : 'modified';
  });
  /** 返回成功 */
  return { ok: true };
};

/**
 * 检测勾选文件中是否存在重名冲突。
 * @param {Object} store - 全局 store
 * @returns {{conflicts: Map, hasConflict: boolean}} 冲突信息
 */
const detectConflicts = (store) => {
  /** 新路径 → 原路径列表 映射 */
  const conflicts = new Map();
  /** 只检查已修改的文件 */
  const checkedFiles = store.files.filter((f) => f.checked && f.status === 'modified');
  /** 遍历构建冲突映射 */
  for (const file of checkedFiles) {
    /** 拼接新文件完整路径（使用 joinPath 确保跨平台兼容） */
    const newPath = joinPath(store.currentFolder, file.newName);
    /** 检查是否已存在该目标路径 */
    const existing = conflicts.get(newPath);
    if (existing) {
      /** 已有冲突，追加原路径 */
      existing.push(file.path);
    } else {
      /** 首次出现，记录原路径 */
      conflicts.set(newPath, [file.path]);
    }
  }
  /** 过滤：只保留同一目标出现 2 次及以上的真正冲突 */
  const realConflicts = new Map();
  /** 遍历所有冲突项 */
  for (const [newPath, oldPaths] of conflicts) {
    /** 仅保留多于 1 个原路径的真正冲突 */
    if (oldPaths.length > 1) {
      /** 记录为真正冲突 */
      realConflicts.set(newPath, oldPaths);
    }
  }
  /** 返回冲突映射和是否存在冲突 */
  return { conflicts: realConflicts, hasConflict: realConflicts.size > 0 };
};

/**
 * 冲突解决策略：为重复的文件名添加 (1), (2) 等序号后缀。
 * @param {Object} store - 全局 store
 * @param {Map} conflicts - 冲突映射
 */
const resolveConflicts = (store, conflicts) => {
  /** 自增序号计数器 */
  let counter = 1;
  /** 遍历每个冲突组 */
  for (const [, oldPaths] of conflicts) {
    /** 跳过第一个文件（保留原名），从第二个开始加后缀 */
    for (let i = 1; i < oldPaths.length; i++) {
      /** 找到对应的文件对象 */
      const file = store.files.find((f) => f.path === oldPaths[i]);
      /** 文件存在且有预览名称时才处理 */
      if (file && file.newName) {
        /** 定位扩展名前的最后一个 . */
        const dotIdx = file.newName.lastIndexOf('.');
        /** 有扩展名时在扩展名前插入序号 */
        if (dotIdx > 0) {
          /** 在扩展名前插入序号 */
          file.newName = file.newName.slice(0, dotIdx) + ` (${counter})` + file.newName.slice(dotIdx);
        } else {
          /** 无扩展名则在末尾追加 */
          file.newName = file.newName + ` (${counter})`;
        }
        /** 计数器递增 */
        counter++;
      }
    }
  }
};

/**
 * 执行批量重命名。
 * 流程：预览 → 冲突检测与解决 → 调用主进程 fs:renameBatch → 更新文件状态。
 * @param {Object} store - 全局 store
 */
export const applyRenames = async (store) => {
  /** 筛选勾选的文件 */
  const checkedFiles = store.files.filter((f) => f.checked);
  /** 无勾选则直接返回 */
  if (checkedFiles.length === 0) return;
  /** 步骤 1：重新计算预览名称 */
  await previewRenames(store);
  /** 步骤 2：检测并解决冲突 */
  const { conflicts, hasConflict } = detectConflicts(store);
  if (hasConflict) {
    /** 调用冲突解决函数 */
    resolveConflicts(store, conflicts);
    /** 冲突解决后再次检测：确保解析后的名称不与未勾选的文件冲突 */
    resolveConflicts(store, detectConflicts(store).conflicts);
  }
  /** 步骤 3：筛选实际修改的文件 */
  const modifiedFiles = store.files.filter((f) => f.checked && f.status === 'modified');
  /** 步骤 4：构建重命名操作列表 */
  const operations = modifiedFiles.map((f) => {
    /** 拼接新文件完整路径（使用 joinPath 确保跨平台兼容） */
    const newPath = joinPath(store.currentFolder, f.newName);
    /** 返回操作对象 */
    return { oldPath: f.path, newPath };
  });
  /** 步骤 5：通过 IPC 调用主进程执行实际重命名 */
  const results = await window.electronAPI.renameBatch(operations);
  /** 步骤 6：更新文件状态并记录到撤销栈 */
  for (let i = 0; i < results.length; i++) {
    /** 当前操作结果 */
    const r = results[i];
    /** 对应的文件对象 */
    const file = modifiedFiles[i];
    /** 判断操作是否成功 */
    if (r.status === 'ok') {
      /** 更新状态为已重命名 */
      file.status = 'renamed';
      /** 更新文件路径 */
      file.path = r.newPath;
      /** 更新文件名 */
      file.name = file.newName;
      /** 更新原始文件名基准（供下次预览使用） */
      file.originalName = file.newName;
    } else {
      /** 更新状态为错误 */
      file.status = 'error';
      /** 记录错误信息 */
      file._error = r.error;
    }
  }
  /** 将本次成功操作存入撤销栈（仅成功项） */
  store.undoStack.push(results.filter((r) => r.status === 'ok'));
};

/**
 * 撤销最近一次批量重命名。
 * 将撤销栈顶部操作反向执行（newPath ↔ oldPath 互换）。
 * @param {Object} store - 全局 store
 * @returns {Promise<{ok: boolean, count: number}>} 撤销结果
 */
export const undoRenames = async (store) => {
  /** 撤销栈为空则直接返回 */
  if (!store.undoStack || store.undoStack.length === 0) return { ok: false, count: 0 };
  /** 弹出最近的撤销记录 */
  const lastOps = store.undoStack.pop();
  /** 构建反向操作列表 */
  const reverseOps = lastOps.map((op) => ({ oldPath: op.newPath, newPath: op.oldPath }));
  /** 通过 IPC 执行反向重命名 */
  const results = await window.electronAPI.renameBatch(reverseOps);
  /** 更新文件状态 */
  for (let i = 0; i < results.length; i++) {
    /** 当前结果 */
    const r = results[i];
    /** 对应的原始操作 */
    const original = lastOps[i];
    /** 在文件列表中查找对应文件 */
    const file = store.files.find((f) => f.path === original.newPath);
    /** 文件存在且撤销成功 */
    if (file && r.status === 'ok') {
      /** 恢复文件路径 */
      file.path = original.oldPath;
      /** 恢复文件名 */
      file.name = original.oldPath.replace(/^.*[/\\]/, '');
      /** 恢复原始文件名基准 */
      file.originalName = file.name;
      /** 恢复状态 */
      file.status = 'original';
      /** 清空预览名 */
      file.newName = '';
    }
  }
  /** 返回成功及撤销数量 */
  return { ok: true, count: lastOps.length };
};
