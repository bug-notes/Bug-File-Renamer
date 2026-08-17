/** Vue 响应式 API */
import { ref } from 'vue';
/** 中文翻译词条 */
import zh from './zh.js';
/** 英文翻译词条 */
import en from './en.js';

/** 从 appInfo.json 读取应用信息（Vite 原生支持 JSON import） */
import appInfo from '../../appInfo.json';

/** 翻译词条映射 */
const messages = { zh, en };

/**
 * 根据系统语言检测默认语言。
 * @returns {string} 'zh' 或 'en'
 */
const detectLang = () => {
  /** 获取浏览器语言并转为小写 */
  const lang = (navigator.language || 'en').toLowerCase();
  /** 以 zh 开头返回 'zh'，否则返回 'en' */
  return lang.startsWith('zh') ? 'zh' : 'en';
};

/** 当前语言（响应式，切换后所有组件自动更新） */
const lang = ref(detectLang());

/**
 * 切换当前语言。
 * @param {string} code - 语言代码 ('zh'|'en')
 */
export const setLang = (code) => {
  /** 仅在有效语言代码时切换 */
  if (messages[code]) {
    /** 修改响应式 lang 值，触发所有组件更新 */
    lang.value = code;
  }
};

/**
 * 获取翻译文本。
 * 支持嵌套 key 如 'fileTable.title'，以及 {0}, {1} 占位符替换。
 */
export const t = (key, ...args) => {
  /** app.title 从 appInfo.json 实时读取，与主进程保持同步 */
  if (key === 'app.title') {
    /** 从 appInfo.title 中获取当前语言的值，回退英文 */
    return appInfo.title[lang.value] || appInfo.title.en;
  }
  /** 按 . 分割嵌套 key 路径 */
  const keys = key.split('.');
  /** 从当前语言的词条对象开始查找 */
  let value = messages[lang.value];
  /** 逐级下钻查找翻译文本 */
  for (const k of keys) {
    /** 中间结果不存在则返回原始 key */
    if (value == null) return key;
    /** 进入下一级 */
    value = value[k];
  }
  /** 非字符串结果则返回原始 key */
  if (typeof value !== 'string') return key;
  /** 替换占位符 {0}, {1} ... */
  return value.replace(/\{(\d+)\}/g, (_, i) => (args[i] != null ? args[i] : ''));
};
