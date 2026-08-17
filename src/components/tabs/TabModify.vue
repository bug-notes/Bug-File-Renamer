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
      <label class="section-title">{{ t('modify.prepend') }}</label>
      <input type="text" :value="store.tabParams[store.activeTab].prependText || ''" @input="setParam('prependText', $event.target.value)" :placeholder="t('modify.prependPlaceholder')">
    </div>
    <div class="form-section">
      <label class="section-title">{{ t('modify.append') }}</label>
      <input type="text" :value="store.tabParams[store.activeTab].appendText || ''" @input="setParam('appendText', $event.target.value)" :placeholder="t('modify.appendPlaceholder')">
    </div>
    <div class="form-section">
      <label class="section-title">{{ t('modify.insert') }}</label>
      <div class="form-group">
        <label>{{ t('modify.insertPosition') }}</label>
        <div class="inline-row">
          <span class="input-label">在第</span>
          <input type="number" class="input-num" :value="store.tabParams[store.activeTab].insertPosition ?? 1" @input="setParam('insertPosition', $event.target.value)" min="1">
          <span class="input-label">个字符后插入</span>
        </div>
      </div>
      <div class="form-group">
        <label>{{ t('modify.insertContent') }}</label>
        <input type="text" :value="store.tabParams[store.activeTab].insertText || ''" @input="setParam('insertText', $event.target.value)" :placeholder="t('modify.insertPlaceholder')">
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
  font-size: 13px;
  color: #6b7280;
  font-weight: 400;
}
/** 文本输入框和数字输入框 */
input[type="text"],
input[type="number"] {
  padding: 8px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  color: #111827;
  background: #fff;
  font-family: inherit;
}
/** 输入框聚焦态 */
input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59,130,246,0.15);
}
/** 内联行 */
.inline-row {
  display: flex;
  align-items: center;
  gap: 6px;
}
/** 内联标签文字 */
.input-label {
  font-size: 13px;
  color: #6b7280;
  white-space: nowrap;
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
