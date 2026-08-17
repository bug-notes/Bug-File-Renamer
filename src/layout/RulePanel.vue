<script setup>
/** Vue 响应式 API */
import { inject, computed, markRaw, ref } from 'vue';
/** 全局 store 和重置工具 */
import { storeKey, resetTabParams } from '../store/index.js';
/** 国际化翻译函数 */
import { t } from '../i18n/index.js';
/** 序号规则 Tab */
import TabNumbering from '../components/tabs/TabNumbering.vue';
/** 修改规则 Tab */
import TabModify from '../components/tabs/TabModify.vue';
/** 删除规则 Tab */
import TabDelete from '../components/tabs/TabDelete.vue';
/** 替换规则 Tab */
import TabReplace from '../components/tabs/TabReplace.vue';
/** 转换规则 Tab */
import TabConvert from '../components/tabs/TabConvert.vue';
/** 扩展名规则 Tab */
import TabExtension from '../components/tabs/TabExtension.vue';
/** 日期规则 Tab */
import TabDate from '../components/tabs/TabDate.vue';
/** 底部广告组件 */
import AdBanner from '../components/ad/AdBanner.vue';

/** 注入全局 store */
const store = inject(storeKey);

/** 所有规则 Tab 定义 */
const tabs = [
  { id: 'numbering', label: t('tabs.numbering'), icon: 'fa-list-ol', component: markRaw(TabNumbering) },
  { id: 'modify', label: t('tabs.modify'), icon: 'fa-pen-to-square', component: markRaw(TabModify) },
  { id: 'delete', label: t('tabs.delete'), icon: 'fa-eraser', component: markRaw(TabDelete) },
  { id: 'replace', label: t('tabs.replace'), icon: 'fa-rotate', component: markRaw(TabReplace) },
  { id: 'convert', label: t('tabs.convert'), icon: 'fa-font', component: markRaw(TabConvert) },
  { id: 'extension', label: t('tabs.extension'), icon: 'fa-file-signature', component: markRaw(TabExtension) },
  { id: 'date', label: t('tabs.date'), icon: 'fa-calendar', component: markRaw(TabDate) },
];

/** 根据当前激活 Tab 动态计算要渲染的组件 */
const activeComponent = computed(() => {
  /** 查找当前激活 Tab 的配置 */
  const tab = tabs.find((t) => t.id === store.activeTab);
  /** 返回对应组件或 null */
  return tab ? tab.component : null;
});

/** 是否正在执行重置动画 */
const resetting = ref(false);

/** 切换激活的规则 Tab */
const switchTab = (tabId) => {
  store.activeTab = tabId;
}

/** 重置当前 Tab 的规则参数 */
const handleReset = async () => {
  /** 显示重置动画 */
  resetting.value = true;
  /** 清空当前 Tab 参数 */
  resetTabParams(store.activeTab);
  /** 动画持续 300ms */
  await new Promise((r) => setTimeout(r, 300));
  /** 隐藏动画 */
  resetting.value = false;
}
</script>

<template>
  <aside class="rule-panel">
    <div class="rule-panel-header">
      <h2 class="rule-panel-title">{{ t('rulePanel.title') }}</h2>
      <button class="reset-btn tip tip-left" @click="handleReset" :data-tip="t('rulePanel.reset')">
        <i :class="['fa-solid', resetting ? 'fa-spinner fa-spin' : 'fa-rotate-right']"></i>
      </button>
    </div>

    <!-- Tab nav -->
    <nav class="tab-nav">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-btn"
        :class="{ active: store.activeTab === tab.id }"
        @click="switchTab(tab.id)"
      >
        <i :class="['fa-solid', tab.icon]"></i>
        <span>{{ tab.label }}</span>
      </button>
    </nav>

    <!-- Dynamic component -->
    <div class="tab-content" :class="{ 'tab-resetting': resetting }">
      <div v-if="resetting" class="reset-overlay">
        <i class="fa-solid fa-spinner fa-spin"></i>
        <span>{{ t('rulePanel.resetting') }}</span>
      </div>
      <component :is="activeComponent" />
    </div>

    <!-- 底部广告区域（不受 tab 切换影响） -->
    <!-- 外层 flex 容器：水平垂直居中 -->
    <div class="ad-wrapper">
      <!-- 内层容器：90% 宽度，80px 高度 -->
      <div class="ad-inner">
        <AdBanner />
      </div>
    </div>
  </aside>
</template>

<style scoped>
/** 规则面板容器 */
.rule-panel {
  width: 320px;
  flex-shrink: 0;
  border-left: 1px solid #374151;
  display: flex;
  flex-direction: column;
  background: #fff;
  overflow: hidden;
}
/** 规则面板头部 */
.rule-panel-header {
  padding: 12px 16px;
  border-bottom: 1px solid #4a5568;
  background: #2d3748;
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
/** 重置按钮 */
.reset-btn {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  transition: color 0.15s;
}
/** 重置按钮悬停态 */
.reset-btn:hover {
  color: #fff;
}
/** 规则面板标题 */
.rule-panel-title {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
}
/** Tab 导航栏 */
.tab-nav {
  display: flex;
  border-bottom: 1px solid #d1d5db;
  background: #fff;
  flex-shrink: 0;
  overflow-x: auto;
  padding: 0 4px;
}
/** Tab 按钮 */
.tab-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 8px 4px 7px;
  border: none;
  background: none;
  color: #6b7280;
  font-size: 10px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: color 0.15s, border-color 0.15s, background 0.15s;
  font-family: inherit;
  white-space: nowrap;
  border-radius: 4px 4px 0 0;
}
/** Tab 按钮悬停态 */
.tab-btn:hover {
  color: #111827;
  background: rgba(0,0,0,0.04);
}
/** Tab 按钮激活态 */
.tab-btn.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
  background: rgba(59,130,246,0.06);
  font-weight: 600;
}
/** Tab 按钮图标 */
.tab-btn i {
  font-size: 15px;
}
/** Tab 内容区 */
.tab-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #fff;
  position: relative;
}
/** 重置中禁止交互 */
.tab-resetting {
  pointer-events: none;
}
/** 重置遮罩层 */
.reset-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: rgba(255,255,255,0.9);
  z-index: 5;
  color: #6b7280;
  font-size: 13px;
}
/** 重置遮罩层图标 */
.reset-overlay i {
  font-size: 22px;
  color: #3b82f6;
}
/** 广告外层容器 */
.ad-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
/** 广告内层容器 */
.ad-inner {
  width: 90%;
  height: 80px;
}
</style>
