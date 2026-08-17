/** 英文翻译 */
export default {
  /** 顶部工具栏 */
  topBar: {
    /** 预览修改按钮 */
    preview: 'Preview',
    /** 应用修改按钮 */
    apply: 'Apply',
  },
  /** 文件树 */
  fileTree: {
    /** 面板标题 */
    title: 'File Browser',
    /** 刷新按钮提示 */
    refresh: 'Refresh File Tree',
    /** 加载中提示 */
    loading: 'Refreshing file tree...',
    /** 无权限对话框标题 */
    permTitle: 'Folder Access Denied',
    /** 无权限对话框内容 */
    permMessage: 'The following folders are not accessible. Open folder picker to grant access?\n\n{0}\n\nSelect the corresponding folder to gain access.',
    /** 授权按钮 */
    permGrant: 'Grant Access',
    /** 取消按钮 */
    permCancel: 'Cancel',
  },
  /** 文件列表 */
  fileTable: {
    /** 面板标题 */
    title: 'File List',
    /** 全选按钮 */
    selectAll: 'Select All',
    /** 反选按钮 */
    invert: 'Invert',
    /** 取消选择按钮 */
    clear: 'Clear',
    /** 刷新按钮提示 */
    refresh: 'Refresh',
    /** 原始文件名列标题 */
    originalName: 'Original Name',
    /** 新文件名列标题 */
    newName: 'New Name',
    /** 扩展名列标题 */
    extension: 'Extension',
    /** 状态列标题 */
    status: 'Status',
    /** 加载中提示 */
    loading: 'Loading file list...',
    /** 未选择文件夹的空状态提示 */
    emptyNoFolder: 'Click a folder or drag files here',
    /** 文件夹为空的提示 */
    emptyNoFiles: 'No files in this folder',
    /** 拖拽释放提示 */
    dropHint: 'Drop to import files',
    /** 当前文件夹路径标签 */
    currentFolder: 'Current folder: ',
    /** 状态：原始 */
    statusOriginal: 'Original',
    /** 状态：已修改 */
    statusModified: 'Modified',
    /** 状态：已重命名 */
    statusRenamed: 'Renamed',
    /** 状态：错误 */
    statusError: 'Error',
  },
  /** 规则面板 */
  rulePanel: {
    /** 面板标题 */
    title: 'Rename Rules',
    /** 重置按钮提示 */
    reset: 'Reset current rule',
    /** 重置中提示 */
    resetting: 'Resetting rules...',
  },
  /** 规则标签页名称 */
  tabs: {
    /** 序号标签 */
    numbering: 'Number',
    /** 修改标签 */
    modify: 'Modify',
    /** 删除标签 */
    delete: 'Delete',
    /** 替换标签 */
    replace: 'Replace',
    /** 转换标签 */
    convert: 'Convert',
    /** 扩展名标签 */
    extension: 'Extension',
    /** 日期标签 */
    date: 'Date',
  },
  /** 序号规则 */
  numbering: {
    /** 序号位置 */
    position: 'Position',
    /** 文件名前 */
    positionPrefix: 'Before name',
    /** 文件名后 */
    positionSuffix: 'After name',
    /** 起始序号 */
    startNumber: 'Start Number',
    /** 序号增量 */
    step: 'Step',
    /** 序号位数 */
    padding: 'Digits',
    /** 序号前缀 */
    prefix: 'Prefix',
    /** 序号前缀占位符 */
    prefixPlaceholder: 'e.g. IMG_',
    /** 序号后缀 */
    suffix: 'Suffix',
    /** 序号后缀占位符 */
    suffixPlaceholder: 'e.g. _v2',
    /** 序号方向 */
    direction: 'Direction',
    /** 正序 */
    forward: 'Forward (1, 2, 3...)',
    /** 倒序 */
    reverse: 'Reverse (..., 3, 2, 1)',
  },
  /** 修改规则 */
  modify: {
    /** 文件名前添加 */
    prepend: 'Prepend',
    /** 前添加占位符 */
    prependPlaceholder: 'e.g. [Backup]',
    /** 文件名后添加 */
    append: 'Append',
    /** 后添加占位符 */
    appendPlaceholder: 'e.g. _final',
    /** 定位插入 */
    insert: 'Insert',
    /** 插入位置 */
    insertPosition: 'Position',
    /** 插入内容 */
    insertContent: 'Content',
    /** 插入内容占位符 */
    insertPlaceholder: 'e.g. _v2',
  },
  /** 删除规则 */
  delete: {
    /** 删除指定文字 */
    deleteText: 'Remove Text',
    /** 删除文字占位符 */
    deleteTextPlaceholder: 'e.g. _old',
    /** 定位删除 */
    deleteRange: 'Remove Range',
    /** 起始位置 */
    deleteStart: 'Start',
    /** 起始位置后缀 */
    deleteStartSuffix: 'chars from start',
    /** 删除长度 */
    deleteLength: 'Length',
    /** 删除长度后缀 */
    deleteLengthSuffix: 'chars',
    /** 从末尾删除 */
    deleteEnd: 'Remove from End',
    /** 末尾删除标签 */
    deleteEndLabel: 'Remove',
    /** 末尾删除后缀 */
    deleteEndSuffix: 'chars from end',
  },
  /** 替换规则 */
  replace: {
    /** 查找内容 */
    search: 'Find',
    /** 查找占位符 */
    searchPlaceholder: 'e.g. old or \\d+',
    /** 替换为 */
    replacement: 'Replace with',
    /** 替换占位符 */
    replacementPlaceholder: 'e.g. new',
    /** 区分大小写开关 */
    caseSensitive: 'Case Sensitive',
    /** 使用正则表达式开关 */
    useRegex: 'Use Regex',
    /** 替换所有匹配开关 */
    replaceAll: 'Replace All',
  },
  /** 转换规则 */
  convert: {
    /** 全部大写 */
    upper: 'UPPERCASE',
    /** 全部小写 */
    lower: 'lowercase',
    /** 首字母大写 */
    title: 'Title Case',
    /** 汉字转拼音 */
    pinyin: 'Hanzi to Pinyin',
  },
  /** 扩展名规则 */
  extension: {
    /** 新扩展名 */
    newExtension: 'New Extension',
    /** 新扩展名占位符 */
    newExtensionPlaceholder: 'e.g. txt',
    /** 扩展名转换标题 */
    convertTitle: 'Extension Convert',
    /** 全部大写 */
    upper: 'Uppercase (TXT)',
    /** 全部小写 */
    lower: 'Lowercase (txt)',
    /** 删除扩展名 */
    remove: 'Remove Extension',
    /** 保持原样 */
    keep: 'Keep Original',
  },
  /** 日期规则 */
  date: {
    /** 日期来源 */
    source: 'Date Source',
    /** 修改日期 */
    sourceModified: 'Modified Date',
    /** 创建日期 */
    sourceCreated: 'Created Date',
    /** 日期格式 */
    format: 'Date Format',
    /** 格式说明 */
    formatHint: 'yyyy=year MM=month dd=day HH=hour mm=minute ss=second',
    /** 命名方式 */
    naming: 'Naming',
    /** 替换文件名 */
    namingReplace: 'Replace Name',
    /** 作为前缀 */
    namingPrefix: 'As Prefix',
    /** 作为后缀 */
    namingSuffix: 'As Suffix',
    /** 示例 */
    example: 'Example: yyyy-MM-dd_HHmm → 2026-05-22_1430',
  },
};
