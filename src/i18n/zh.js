/** 中文翻译 */
export default {
  /** 顶部工具栏 */
  topBar: {
    /** 预览修改按钮 */
    preview: '预览修改',
    /** 应用修改按钮 */
    apply: '应用修改',
  },
  /** 文件树 */
  fileTree: {
    /** 面板标题 */
    title: '文件浏览器',
    /** 刷新按钮提示 */
    refresh: '刷新文件树',
    /** 加载中提示 */
    loading: '正在刷新文件树...',
    /** 无权限对话框标题 */
    permTitle: '文件夹无访问权限',
    /** 无权限对话框内容 */
    permMessage: '以下文件夹没有访问权限，是否打开文件夹选择器手动授权？\n\n{0}\n\n选择对应文件夹后即可获得访问权限。',
    /** 授权按钮 */
    permGrant: '去授权',
    /** 取消按钮 */
    permCancel: '取消',
  },
  /** 文件列表 */
  fileTable: {
    /** 面板标题 */
    title: '文件列表',
    /** 全选按钮 */
    selectAll: '全选',
    /** 反选按钮 */
    invert: '反选',
    /** 取消选择按钮 */
    clear: '取消',
    /** 刷新按钮提示 */
    refresh: '刷新文件列表',
    /** 原始文件名列标题 */
    originalName: '原始文件名',
    /** 新文件名列标题 */
    newName: '新文件名',
    /** 扩展名列标题 */
    extension: '扩展名',
    /** 状态列标题 */
    status: '状态',
    /** 加载中提示 */
    loading: '正在加载文件列表...',
    /** 未选择文件夹的空状态提示 */
    emptyNoFolder: '点击左侧文件夹或拖拽文件到此处',
    /** 文件夹为空的提示 */
    emptyNoFiles: '该文件夹中没有文件',
    /** 拖拽释放提示 */
    dropHint: '释放以导入文件',
    /** 当前文件夹路径标签 */
    currentFolder: '当前文件夹：',
    /** 状态：原始 */
    statusOriginal: '原始',
    /** 状态：已修改 */
    statusModified: '已修改',
    /** 状态：已重命名 */
    statusRenamed: '已重命名',
    /** 状态：错误 */
    statusError: '错误',
  },
  /** 规则面板 */
  rulePanel: {
    /** 面板标题 */
    title: '重命名规则',
    /** 重置按钮提示 */
    reset: '重置当前规则',
    /** 重置中提示 */
    resetting: '正在重置重命名规则...',
  },
  /** 规则标签页名称 */
  tabs: {
    /** 序号标签 */
    numbering: '序号',
    /** 修改标签 */
    modify: '修改',
    /** 删除标签 */
    delete: '删除',
    /** 替换标签 */
    replace: '替换',
    /** 转换标签 */
    convert: '转换',
    /** 扩展名标签 */
    extension: '扩展名',
    /** 日期标签 */
    date: '日期',
  },
  /** 序号规则 */
  numbering: {
    /** 序号位置 */
    position: '序号位置',
    /** 文件名前 */
    positionPrefix: '文件名前',
    /** 文件名后 */
    positionSuffix: '文件名后',
    /** 起始序号 */
    startNumber: '起始序号',
    /** 序号增量 */
    step: '序号增量',
    /** 序号位数 */
    padding: '序号位数',
    /** 序号前缀 */
    prefix: '序号前缀',
    /** 序号前缀占位符 */
    prefixPlaceholder: '在序号前添加内容',
    /** 序号后缀 */
    suffix: '序号后缀',
    /** 序号后缀占位符 */
    suffixPlaceholder: '在序号后添加内容',
    /** 序号方向 */
    direction: '序号方向',
    /** 正序 */
    forward: '正序（1, 2, 3...）',
    /** 倒序 */
    reverse: '倒序（..., 3, 2, 1）',
  },
  /** 修改规则 */
  modify: {
    /** 文件名前添加 */
    prepend: '文件名前添加',
    /** 前添加占位符 */
    prependPlaceholder: '如 [备份]',
    /** 文件名后添加 */
    append: '文件名后添加',
    /** 后添加占位符 */
    appendPlaceholder: '如 _final',
    /** 定位插入 */
    insert: '定位插入',
    /** 插入位置 */
    insertPosition: '插入位置',
    /** 插入位置提示 */
    insertContent: '插入内容',
    /** 插入内容占位符 */
    insertPlaceholder: '如 _v2',
  },
  /** 删除规则 */
  delete: {
    /** 删除指定文字 */
    deleteText: '删除指定文字',
    /** 删除文字占位符 */
    deleteTextPlaceholder: '如 _old',
    /** 定位删除 */
    deleteRange: '定位删除',
    /** 起始位置 */
    deleteStart: '起始位置',
    /** 起始位置后缀 */
    deleteStartSuffix: '个字符开始',
    /** 删除长度 */
    deleteLength: '删除长度',
    /** 删除长度后缀 */
    deleteLengthSuffix: '个字符',
    /** 从末尾删除 */
    deleteEnd: '从末尾删除',
    /** 末尾删除标签 */
    deleteEndLabel: '删除末尾',
    /** 末尾删除后缀 */
    deleteEndSuffix: '个字符',
  },
  /** 替换规则 */
  replace: {
    /** 查找内容 */
    search: '查找内容',
    /** 查找占位符 */
    searchPlaceholder: '如 old 或 \\d+',
    /** 替换为 */
    replacement: '替换为',
    /** 替换占位符 */
    replacementPlaceholder: '如 new',
    /** 区分大小写开关 */
    caseSensitive: '区分大小写',
    /** 使用正则表达式开关 */
    useRegex: '使用正则表达式',
    /** 替换所有匹配开关 */
    replaceAll: '替换所有匹配',
  },
  /** 转换规则 */
  convert: {
    /** 全部大写 */
    upper: '全部大写',
    /** 全部小写 */
    lower: '全部小写',
    /** 首字母大写 */
    title: '首字母大写',
    /** 汉字转拼音 */
    pinyin: '汉字转拼音',
  },
  /** 扩展名规则 */
  extension: {
    /** 新扩展名 */
    newExtension: '新扩展名',
    /** 新扩展名占位符 */
    newExtensionPlaceholder: '如 txt',
    /** 扩展名转换标题 */
    convertTitle: '扩展名转换',
    /** 全部大写 */
    upper: '全部大写（TXT）',
    /** 全部小写 */
    lower: '全部小写（txt）',
    /** 删除扩展名 */
    remove: '删除扩展名',
    /** 保持原样 */
    keep: '保持原样',
  },
  /** 日期规则 */
  date: {
    /** 日期来源 */
    source: '日期来源',
    /** 修改日期 */
    sourceModified: '修改日期',
    /** 创建日期 */
    sourceCreated: '创建日期',
    /** 日期格式 */
    format: '日期格式',
    /** 格式说明 */
    formatHint: 'yyyy=年 MM=月 dd=日 HH=时 mm=分 ss=秒',
    /** 命名方式 */
    naming: '命名方式',
    /** 替换文件名 */
    namingReplace: '替换文件名',
    /** 作为前缀 */
    namingPrefix: '作为前缀',
    /** 作为后缀 */
    namingSuffix: '作为后缀',
    /** 示例 */
    example: '示例：yyyy-MM-dd_HHmm → 2026-05-22_1430',
  },
};
