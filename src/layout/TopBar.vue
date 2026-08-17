<script setup>
/** Vue 响应式 API */
import { inject, ref, computed } from 'vue';
/** 全局 store 标识符 */
import { storeKey } from '../store/index.js';
/** 重命名预览、执行、撤销 */
import { previewRenames, applyRenames, undoRenames } from '../utils/renamer.js';
/** 国际化翻译函数 */
import { t } from '../i18n/index.js';
/** 顶部图标 SVG */
import iconSvg from '../assets/icon.svg';

/** 注入全局 store */
const store = inject(storeKey);

/** macOS 平台检测（从主进程预加载 API 同步获取，避免 navigator.platform 弃用问题） */
const isMac = ref(window.electronAPI?.getPlatform?.() === 'darwin');

/** 撤销按钮是否可用 */
const canUndo = computed(() => store.undoStack && store.undoStack.length > 0);

/** 触发预览重命名 */
const handlePreview = async () => {
  /** 调用预览函数 */
  const result = await previewRenames(store);
  /** 检查预览结果并给出反馈 */
  if (result && !result.ok) {
    /** 根据原因设置全局 Toast */
    if (result.reason === 'noSelection') store.toastMessage = '请先勾选需要重命名的文件';
    /** 规则未配置 */
    else if (result.reason === 'notConfigured') store.toastMessage = '请先配置重命名规则';
  }
};

/** 触发应用重命名 */
const handleApply = () => {
  applyRenames(store);
};

/** 触发撤销 */
const handleUndo = async () => {
  /** 调用撤销函数 */
  const result = await undoRenames(store);
  /** 显示撤销结果 */
  if (result.ok) store.toastMessage = `已撤销 ${result.count} 个文件的重命名`;
};
</script>

<template>
  <!-- 顶部工具栏 -->
  <header class="top-bar" :class="{ 'top-bar-mac': isMac }">
    <!-- 左侧：应用图标 + 标题 -->
    <div class="top-bar-left">
      <img :src="iconSvg" class="top-bar-icon" alt="logo" />
      <h1 class="top-bar-title">{{ t('app.title') }}</h1>
    </div>
    <!-- 右侧：操作按钮 -->
    <div class="top-bar-right">
      <button class="btn btn-outline" @click="handleUndo" :disabled="!canUndo">
        <i class="fa-solid fa-undo"></i> 撤销
      </button>
      <button class="btn btn-blue" @click="handlePreview">
        <i class="fa-solid fa-eye"></i> {{ t('topBar.preview') }}
      </button>
      <button class="btn btn-green" @click="handleApply">
        <i class="fa-solid fa-check"></i> {{ t('topBar.apply') }}
      </button>
    </div>
  </header>
</template>

<style scoped>
/** 工具栏容器 */
.top-bar {
  background: #2d3748;
  color: #fff;
  padding: 8px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  z-index: 10;
  flex-shrink: 0;
  /** 允许窗口拖动 */
  -webkit-app-region: drag;
}
/** macOS 红绿灯偏移 */
.top-bar-mac {
  padding-left: 80px;
}
/** 左侧标题区域 */
.top-bar-left {
  display: flex;
  align-items: center;
  gap: 4px;
  -webkit-app-region: drag;
}
/** 应用图标 */
.top-bar-icon {
  width: 36px;
  height: 36px;
}
/** 应用标题 */
.top-bar-title {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.5px;
}
/** 右侧按钮组（不允许拖动） */
.top-bar-right {
  display: flex;
  gap: 8px;
  -webkit-app-region: no-drag;
}
/** 按钮不可拖动 */
.btn {
  -webkit-app-region: no-drag;
}
/** 撤销按钮 */
.btn-outline {
  background: transparent;
  border: 1px solid #6b7280;
  color: #d1d5db;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}
/** 撤销按钮悬停态 */
.btn-outline:hover:not(:disabled) {
  border-color: #93c5fd;
  color: #fff;
}
/** 撤销按钮禁用态 */
.btn-outline:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
