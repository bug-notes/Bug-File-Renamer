/**
 * 分离文件名和扩展名。
 * 以最后一个 . 为分割点，隐藏文件（.开头）视为无名称。
 * @param {string} fileName - 完整文件名
 * @returns {{name: string, ext: string}} 分离后的名称和扩展名
 */
export const parseFilename = (fileName) => {
  /** 定位最后一个点号的位置 */
  const dotIndex = fileName.lastIndexOf('.');
  /** 无点号或点号在开头（隐藏文件），整体视为名称 */
  if (dotIndex <= 0) return { name: fileName, ext: '' };
  /** 以点号分割名称和扩展名 */
  return { name: fileName.slice(0, dotIndex), ext: fileName.slice(dotIndex) };
};

/**
 * 合并名称和扩展名为完整文件名。
 * @param {string} name - 文件名（不含扩展名）
 * @param {string} ext - 扩展名（可含或不含点号）
 * @returns {string} 完整文件名
 */
export const joinFilename = (name, ext) => {
  /** 无扩展名时直接返回名称 */
  if (!ext) return name;
  /** 扩展名不含点号时自动补上 */
  return name + (ext.startsWith('.') ? ext : '.' + ext);
};
