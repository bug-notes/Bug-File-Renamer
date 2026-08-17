/** Vue 响应式 API：reactive 创建响应式对象 */
import { reactive } from 'vue';
/** Vue 依赖注入 API */
import { inject } from 'vue';

/**
 * 为每个规则 Tab 创建独立的空参数对象。
 * 切换 Tab 时参数不会丢失，各自保存。
 */
const createTabParams = () => ({
  /** 序号规则参数 */
  numbering: {},
  /** 修改规则参数 */
  modify: {},
  /** 删除规则参数 */
  delete: {},
  /** 替换规则参数 */
  replace: {},
  /** 转换规则参数 */
  convert: {},
  /** 扩展名规则参数 */
  extension: {},
  /** 日期规则参数 */
  date: {},
});

/**
 * 全局响应式状态存储。
 * 所有组件通过 provide/inject 共享此对象。
 */
export const store = reactive({
  /** 当前加载的文件夹路径 */
  currentFolder: null,
  /** 拖拽文件后触发的树展开目标路径 */
  dropPath: null,
  /** 文件列表：数组元素为 {id, name, path, checked, status, newName} */
  files: [],
  /** 当前激活的规则 Tab 标识 */
  activeTab: 'numbering',
  /** 各 Tab 独立的规则参数映射 */
  tabParams: createTabParams(),
  /** 全选复选框状态 */
  checkedAll: false,
  /** 撤销操作栈：每次 apply 成功后存入 [{oldPath, newPath}[]]，切换文件夹时清空 */
  undoStack: [],
  /** 全局 Toast 消息（空字符串表示不显示），App.vue 渲染为居中浮层 */
  toastMessage: '',
  /** Toast 自动消失定时器引用 */
  toastTimer: null,
});

/**
 * 重置指定 Tab 的规则参数为空对象。
 * @param {string} tabId - Tab 标识（numbering/modify/delete/replace/convert/extension/date）
 */
export const resetTabParams = (tabId) => {
  /** 将该 Tab 参数替换为空对象 */
  store.tabParams[tabId] = {};
};

/** provide/inject 依赖注入的标识符 Symbol */
export const storeKey = Symbol('store');

/**
 * 规则 Tab 组件的共享逻辑 composable。
 * 七个 Tab 组件通过此函数注入 store 并获得 setParam 工具函数。
 * @returns {{store: Object, setParam: Function}}
 */
export const useTab = () => {
  /** 注入全局 store 实例 */
  const s = inject(storeKey);
  /**
   * 更新当前激活 Tab 的单个参数。
   * @param {string} key - 参数键名
   * @param {*} value - 参数值
   */
  const setParam = (key, value) => {
    /** 使用展开运算符创建新对象，确保 Vue 响应式能检测到变化 */
    s.tabParams[s.activeTab] = { ...s.tabParams[s.activeTab], [key]: value };
  };
  /** 返回 store 引用和参数更新函数 */
  return { store: s, setParam };
};
