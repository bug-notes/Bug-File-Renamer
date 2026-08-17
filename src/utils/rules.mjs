/** 文件名解析与合并工具 */
import { parseFilename, joinFilename } from './filename.mjs';

/**
 * 序号规则：对文件进行编号重命名。
 * @param {Object} file - 文件对象
 * @param {Object} params - 规则参数
 * @param {number} index - 文件在全量列表中的序号
 * @returns {string} 新文件名
 */
export const numbering = (file, params, index) => {
  /** 分离文件名和扩展名 */
  const { name, ext } = parseFilename(file.name);
  /** 序号前缀（可选） */
  const prefix = params.prefix || '';
  /** 序号后缀（可选） */
  const suffix = params.suffix || '';
  /** 起始序号，默认 1 */
  const start = params.startNumber != null ? parseInt(params.startNumber) : 1;
  /** 序号增量步长，默认 1 */
  const step = params.step != null ? parseInt(params.step) : 1;
  /** 位数补零，null 时默认 2 位 */
  const padding = params.padding != null ? parseInt(params.padding) : 2;
  /** 是否倒序 */
  const reverse = params.reverse || false;
  /** 序号位置：prefix=文件名前, suffix=文件名后 */
  const position = params.position || 'prefix';
  /** 文件总数（用于倒序计算） */
  const total = params._totalCount || 0;

  /** 倒序时反转索引：最后一个文件序号为 0 */
  const actualIndex = reverse ? (total - 1 - index) : index;
  /** 计算实际的序号值 */
  const num = start + actualIndex * step;
  /** 补零格式化：padding>0 时左侧补 0 */
  const numStr = padding > 0 ? String(num).padStart(padding, '0') : String(num);

  /** 根据位置拼接最终文件名 */
  let newName;
  if (position === 'prefix') {
    /** 序号在文件名前 */
    newName = prefix + numStr + suffix + name;
  } else {
    /** 序号在文件名后 */
    newName = name + prefix + numStr + suffix;
  }
  /** 合并扩展名返回 */
  return joinFilename(newName, ext);
};

/**
 * 修改规则：文件名前/后添加文字，或指定位置插入文字。
 * 支持同时执行多个操作（先 prepend，再 append，最后 insert）。
 */
export const modify = (file, params) => {
  /** 分离文件名和扩展名 */
  const { name, ext } = parseFilename(file.name);
  /** 从原始名称开始累积变换 */
  let newName = name;
  /** 文件名前添加 */
  if (params.prependText) newName = params.prependText + newName;
  /** 文件名后添加 */
  if (params.appendText) newName = newName + params.appendText;
  /** 指定位置插入文字 */
  if (params.insertText) {
    /** 插入位置（1-index，用户输入 1 即第一个字符后） */
    const pos = Math.max(1, parseInt(params.insertPosition) || 1);
    /** 在位置 pos 处插入文本 */
    newName = newName.slice(0, pos) + params.insertText + newName.slice(pos);
  }
  /** 合并扩展名返回 */
  return joinFilename(newName, ext);
};

/**
 * 删除规则：从文件名中移除字符。
 * 支持删除指定文字、定位删除、从末尾删除，可叠加。
 */
export const deleteRule = (file, params) => {
  /** 分离文件名和扩展名 */
  const { name, ext } = parseFilename(file.name);
  /** 从原始名称开始累积变换 */
  let newName = name;
  /** 删除所有匹配的指定文字 */
  if (params.deleteText) {
    /** 转义正则特殊字符 */
    const escaped = params.deleteText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    /** 全局替换为空（即删除） */
    newName = newName.replace(new RegExp(escaped, 'g'), '');
  }
  /** 定位删除：从第 N 字符开始删除 M 个字符（deleteStart 为 1-index，用户输入 1 即从第一个字符开始） */
  if (params.deleteCount) {
    /** 起始位置：用户输入为 1-index，转换为 0-index */
    const start = Math.max(0, (parseInt(params.deleteStart) || 1) - 1);
    /** 删除字符数 */
    const count = parseInt(params.deleteCount) || 0;
    /** 仅当 count>0 时执行 */
    if (count > 0) newName = newName.slice(0, start) + newName.slice(start + count);
  }
  /** 从末尾删除 N 个字符 */
  if (params.deleteFromEnd) {
    /** 删除字符数 */
    const count = parseInt(params.deleteFromEnd) || 0;
    /** 仅当 count>0 时执行 */
    if (count > 0) newName = newName.slice(0, Math.max(0, newName.length - count));
  }
  /** 合并扩展名返回 */
  return joinFilename(newName, ext);
};

/**
 * 替换规则：查找并替换文件名中的文本。
 * 支持普通文本替换和正则表达式替换。
 */
export const replace = (file, params) => {
  /** 分离文件名和扩展名 */
  const { name, ext } = parseFilename(file.name);
  /** 查找文本（可为正则表达式字符串） */
  const search = params.search || '';
  /** 替换为文本 */
  const replacement = params.replacement || '';
  /** 是否使用正则表达式模式 */
  const useRegex = params.useRegex || false;
  /** 是否区分大小写（默认区分，与 UI 复选框默认勾选一致） */
  const caseSensitive = params.caseSensitive !== false;
  /** 是否替换所有匹配（默认是） */
  const replaceAll = params.replaceAll !== false;
  /** 无查找内容则原样返回 */
  if (!search) return joinFilename(name, ext);
  /** 构建正则标志 */
  let flags = '';
  /** 不区分大小写时加 i 标志 */
  if (!caseSensitive) flags += 'i';
  /** 替换所有时加 g 标志 */
  if (replaceAll) flags += 'g';
  /** 结果名称 */
  let newName;
  if (useRegex) {
    try {
      /** 直接使用用户输入的正则表达式 */
      newName = name.replace(new RegExp(search, flags), replacement);
    } catch {
      /** 正则无效时保持原名 */
      newName = name;
    }
  } else {
    /** 普通文本替换：先转义特殊字符 */
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    /** 构建正则并替换 */
    newName = name.replace(new RegExp(escaped, flags), replacement);
  }
  /** 合并扩展名返回 */
  return joinFilename(newName, ext);
};

/**
 * 转换规则：改变文件名的大小写形式。
 * 支持全部大写、全部小写、首字母大写、汉字转拼音。
 */
export const convert = (file, params) => {
  /** 分离文件名和扩展名 */
  const { name, ext } = parseFilename(file.name);
  /** 转换模式 */
  const mode = params.mode || '';
  /** 结果名称 */
  let newName;
  /** 根据模式转换 */
  switch (mode) {
    /** 全部大写 */
    case 'upper': newName = name.toUpperCase(); break;
    /** 全部小写 */
    case 'lower': newName = name.toLowerCase(); break;
    /** 每个单词首字母大写 */
    case 'title': newName = name.replace(/\b\w/g, (c) => c.toUpperCase()); break;
    /** 汉字转拼音（暂未实现，待后续版本支持） */
    case 'pinyin': newName = name; break;
    /** 无模式则保持原样 */
    default: newName = name;
  }
  /** 合并扩展名返回 */
  return joinFilename(newName, ext);
};

/**
 * 扩展名规则：修改文件扩展名。
 * 支持更改为指定扩展名、大小写转换、删除扩展名。
 */
export const extension = (file, params) => {
  /** 分离文件名和原始扩展名 */
  const { name, ext: origExt } = parseFilename(file.name);
  /** 操作模式 */
  const mode = params.mode || '';
  /** 新扩展名文本（change 模式用） */
  const raw = params.newExtension || '';
  /** 结果扩展名 */
  let ext;
  /** 根据模式生成新扩展名 */
  switch (mode) {
    /** 更改为指定扩展名 */
    case 'change': ext = raw.startsWith('.') ? raw : '.' + raw; break;
    /** 扩展名转大写 */
    case 'upper': ext = origExt.toUpperCase(); break;
    /** 扩展名转小写 */
    case 'lower': ext = origExt.toLowerCase(); break;
    /** 删除扩展名 */
    case 'remove': ext = ''; break;
    /** 默认保持原样 */
    default: ext = origExt;
  }
  /** 合并名称和新扩展名返回 */
  return joinFilename(name, ext);
};

/**
 * 日期规则：以文件日期（创建/修改）重命名。
 * 支持自定义格式字符串，可替换原名或作为前缀/后缀。
 */
export const dateRule = (file, params) => {
  /** 分离文件名和扩展名 */
  const { name, ext } = parseFilename(file.name);
  /** 日期来源：modified 或 created */
  const source = params.dateSource || 'created';
  /** 日期格式字符串 */
  const format = params.dateFormat || 'yyyy-MM-dd HHmmss';
  /** 命名方式：replace / prefix / suffix */
  const naming = params.naming || 'replace';
  /** 根据来源获取时间戳 */
  const timestamp = source === 'created' ? (file.createdAt || 0) : (file.modifiedAt || 0);
  /** 构建 Date 对象 */
  const date = new Date(timestamp);
  /** 格式化得到日期字符串 */
  const dateStr = formatDate(date, format);
  /** 结果名称 */
  let newName;
  /** 根据命名方式拼接 */
  switch (naming) {
    /** 日期作为前缀 */
    case 'prefix': newName = dateStr + '_' + name; break;
    /** 日期作为后缀 */
    case 'suffix': newName = name + '_' + dateStr; break;
    /** 默认：日期替换整个文件名 */
    default: newName = dateStr;
  }
  /** 合并扩展名返回 */
  return joinFilename(newName, ext);
};

/**
 * 日期格式化函数。
 * 占位符：y=年, M=月, d=日, H=时(24h), m=分, s=秒
 * @param {Date} date - 日期对象
 * @param {string} fmt - 格式字符串
 * @returns {string} 格式化后的日期字符串
 */
const formatDate = (date, fmt) => {
  /** 补零工具函数 */
  const pad = (n) => String(n).padStart(2, '0');
  /** 链式替换各占位符 */
  return fmt
    /** 替换年份：yy→2位，其他→4位 */
    .replace(/y+/g, (m) => { const y = String(date.getFullYear()); return m.length === 2 ? y.slice(-2) : y; })
    /** 替换月份：MM→补零，M→不补 */
    .replace(/M+/g, (m) => m.length === 2 ? pad(date.getMonth() + 1) : String(date.getMonth() + 1))
    /** 替换日期 */
    .replace(/d+/g, (m) => m.length === 2 ? pad(date.getDate()) : String(date.getDate()))
    /** 替换小时 */
    .replace(/H+/g, (m) => m.length === 2 ? pad(date.getHours()) : String(date.getHours()))
    /** 替换分钟 */
    .replace(/m+/g, (m) => m.length === 2 ? pad(date.getMinutes()) : String(date.getMinutes()))
    /** 替换秒数 */
    .replace(/s+/g, (m) => m.length === 2 ? pad(date.getSeconds()) : String(date.getSeconds()));
};
