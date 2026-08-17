<script setup>
/** Tab 公共逻辑 composable */
import { useTab } from '../../store/index.js';
/** 国际化翻译函数 */
import { t } from '../../i18n/index.js';

/** 注入 store 和参数更新函数 */
const { store, setParam } = useTab();
</script>

<template>
  <!-- 规则表单 -->
  <div class="rule-form">
    <div class="form-section">
      <div class="form-group">
        <label>{{ t('extension.newExtension') }}</label>
        <input type="text" :value="store.tabParams[store.activeTab].newExtension || ''" @input="setParam('newExtension', $event.target.value); setParam('mode', $event.target.value ? 'change' : '')" :placeholder="t('extension.newExtensionPlaceholder')">
      </div>
    </div>

    <div class="form-section">
      <label class="section-title">{{ t('extension.convertTitle') }}</label>
      <div class="radio-option" @click="setParam('mode', 'upper')">
        <i :class="['fa-regular', store.tabParams[store.activeTab].mode === 'upper' ? 'fa-circle-dot' : 'fa-circle']"></i>
        <span>{{ t('extension.upper') }}</span>
      </div>
      <div class="radio-option" @click="setParam('mode', 'lower')">
        <i :class="['fa-regular', store.tabParams[store.activeTab].mode === 'lower' ? 'fa-circle-dot' : 'fa-circle']"></i>
        <span>{{ t('extension.lower') }}</span>
      </div>
      <div class="radio-option" @click="setParam('mode', 'remove')">
        <i :class="['fa-regular', store.tabParams[store.activeTab].mode === 'remove' ? 'fa-circle-dot' : 'fa-circle']"></i>
        <span>{{ t('extension.remove') }}</span>
      </div>
      <div class="radio-option" @click="setParam('mode', '')">
        <i :class="['fa-regular', !store.tabParams[store.activeTab].mode ? 'fa-circle-dot' : 'fa-circle']"></i>
        <span>{{ t('extension.keep') }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/** 表单容器 */
.rule-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
/** 表单组区块 */
.form-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
/** 区块标题 */
.section-title {
  font-size: 14px;
  color: #374151;
  font-weight: 600;
}
/** 表单组 */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
/** 表单组标签 */
.form-group label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}
/** 单选选项 */
.radio-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  cursor: pointer;
  font-size: 13px;
  color: #374151;
}
/** 单选选项图标 */
.radio-option i {
  font-size: 13px;
  color: #3b82f6;
  width: 16px;
  text-align: center;
}
/** 单选选项悬停态 */
.radio-option:hover {
  color: #111827;
}
/** 文本输入框 */
input[type="text"] {
  padding: 8px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  color: #111827;
  background: #fff;
  font-family: inherit;
}
/** 文本输入框聚焦态 */
input[type="text"]:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59,130,246,0.15);
}
</style>
