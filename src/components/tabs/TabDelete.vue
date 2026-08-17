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
      <label class="section-title">{{ t('delete.deleteText') }}</label>
      <input type="text" :value="store.tabParams[store.activeTab].deleteText || ''" @input="setParam('deleteText', $event.target.value)" :placeholder="t('delete.deleteTextPlaceholder')">
    </div>

    <div class="form-section">
      <label class="section-title">{{ t('delete.deleteRange') }}</label>
      <div class="param-row">
        <span class="param-label">{{ t('delete.deleteStart') }}</span>
        <input type="number" class="input-num" :value="store.tabParams[store.activeTab].deleteStart ?? 1" @input="setParam('deleteStart', $event.target.value)" min="1">
        <span class="param-suffix">{{ t('delete.deleteStartSuffix') }}</span>
      </div>
      <div class="param-row">
        <span class="param-label">{{ t('delete.deleteLength') }}</span>
        <input type="number" class="input-num" :value="store.tabParams[store.activeTab].deleteCount ?? 0" @input="setParam('deleteCount', $event.target.value)" min="1">
        <span class="param-suffix">{{ t('delete.deleteLengthSuffix') }}</span>
      </div>
    </div>

    <div class="form-section">
      <label class="section-title">{{ t('delete.deleteEnd') }}</label>
      <div class="param-row">
        <span class="param-label">{{ t('delete.deleteEndLabel') }}</span>
        <input type="number" class="input-num" :value="store.tabParams[store.activeTab].deleteFromEnd ?? 0" @input="setParam('deleteFromEnd', $event.target.value)" min="1">
        <span class="param-suffix">{{ t('delete.deleteLengthSuffix') }}</span>
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
/** 参数行（标签+输入框横向排列） */
.param-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
/** 参数标签 */
.param-label {
  font-size: 13px;
  color: #374151;
  white-space: nowrap;
  min-width: 56px;
}
/** 参数后缀文字 */
.param-suffix {
  font-size: 13px;
  color: #6b7280;
  white-space: nowrap;
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
/** 数字输入框 */
.input-num {
  width: 80px;
  padding: 7px 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  color: #111827;
  background: #fff;
  font-family: inherit;
}
/** 数字输入框聚焦态 */
.input-num:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59,130,246,0.15);
}
/** 数字输入框隐藏上下箭头 */
.input-num::-webkit-inner-spin-button,
.input-num::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/** Firefox 隐藏数字输入框上下箭头 */
.input-num[type="number"] {
  -moz-appearance: textfield;
}
</style>
