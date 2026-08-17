<script setup>
/** Vue 生命周期及响应式 API */
import { onMounted, watch, inject } from 'vue';
/** 国际化语言切换和翻译函数 */
import { setLang, t } from './i18n/index.js';
/** 全局 store 标识符 */
import { storeKey } from './store/index.js';
/** 顶部工具栏 */
import TopBar from './layout/TopBar.vue';
/** 左侧文件浏览器 */
import FileTree from './layout/FileTree.vue';
/** 中间文件列表 */
import FileTable from './layout/FileTable.vue';
/** 右侧重命名规则面板 */
import RulePanel from './layout/RulePanel.vue';

/** 注入全局 store */
const store = inject(storeKey);

/** 监听 Toast 消息变化，自动设置消失定时器 */
watch(() => store.toastMessage, (msg) => {
  /** 消息为空则跳过 */
  if (!msg) return;
  /** 清除旧定时器 */
  if (store.toastTimer) clearTimeout(store.toastTimer);
  /** 2 秒后自动清除 */
  store.toastTimer = setTimeout(() => { store.toastMessage = ''; }, 2000);
});

/** 挂载后监听主进程菜单事件 */
onMounted(() => {
  /** 设置初始页面标题 */
  document.title = t('app.title');
  /** 获取预加载脚本暴露的 API */
  const api = window.electronAPI;
  if (api && api.onMenuAction) {
    api.onMenuAction((action, payload) => {
      if (action === 'setLang') {
        /** 切换全局语言 */
        setLang(payload);
        /** 同步更新页面标题 */
        document.title = t('app.title');
      }
    });
  }
});
</script>

<template>
  <!-- 应用根布局 -->
  <div class="app-layout">
    <TopBar />
    <!-- 三栏主内容区 -->
    <div class="main-content">
      <FileTree />
      <FileTable />
      <RulePanel />
    </div>
    <!-- 全局居中 Toast 提示 -->
    <transition name="toast-fade">
      <div v-if="store.toastMessage" class="global-toast">{{ store.toastMessage }}</div>
    </transition>
  </div>
</template>

<style scoped>
/** 应用根布局容器 */
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}
/** 三栏主内容区 */
.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}
/** 全局居中 Toast */
.global-toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(31, 41, 55, 0.92);
  color: #fff;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 15px;
  white-space: nowrap;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  z-index: 9999;
  pointer-events: none;
}
/** Toast 淡入淡出 */
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 0.25s;
}
/** Toast 入场初始态 */
.toast-fade-enter-from,
/** Toast 离场结束态 */
.toast-fade-leave-to {
  opacity: 0;
}
</style>
