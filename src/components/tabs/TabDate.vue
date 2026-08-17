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
    <div class="form-group">
      <label>{{ t('date.source') }}</label>
      <select :value="store.tabParams[store.activeTab].dateSource || 'created'" @change="setParam('dateSource', $event.target.value)">
        <option value="modified">{{ t('date.sourceModified') }}</option>
        <option value="created">{{ t('date.sourceCreated') }}</option>
      </select>
    </div>
    <div class="form-group">
      <label>{{ t('date.format') }}</label>
      <input type="text" :value="store.tabParams[store.activeTab].dateFormat || 'yyyy-MM-dd HHmmss'" @input="setParam('dateFormat', $event.target.value)">
      <span class="format-hint">{{ t('date.formatHint') }}</span>
    </div>
    <div class="form-group">
      <label>{{ t('date.naming') }}</label>
      <select :value="store.tabParams[store.activeTab].naming || 'replace'" @change="setParam('naming', $event.target.value)">
        <option value="replace">{{ t('date.namingReplace') }}</option>
        <option value="prefix">{{ t('date.namingPrefix') }}</option>
        <option value="suffix">{{ t('date.namingSuffix') }}</option>
      </select>
    </div>
    <p class="form-tip">{{ t('date.example') }}</p>
  </div>
</template>

<style scoped>
/** 表单容器 */
.rule-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
/** 表单组 */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
/** 表单组标签 */
.form-group label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}
/** 表单组输入框和下拉框 */
.form-group input,
.form-group select {
  padding: 7px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  color: #111827;
  background: #fff;
  font-family: inherit;
}
/** 表单组输入框和下拉框聚焦态 */
.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59,130,246,0.15);
}
/** 格式提示文字 */
.format-hint {
  font-size: 10px;
  color: #9ca3af;
  margin-top: 2px;
}
/** 表单提示卡片 */
.form-tip {
  font-size: 10px;
  color: #9ca3af;
  padding: 8px;
  background: #f9fafb;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}
</style>
