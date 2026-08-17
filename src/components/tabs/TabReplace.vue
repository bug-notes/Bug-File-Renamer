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
      <label>{{ t('replace.search') }}</label>
      <input type="text" :value="store.tabParams[store.activeTab].search || ''" @input="setParam('search', $event.target.value)" placeholder="如 old 或 \d+">
    </div>
    <div class="form-group">
      <label>{{ t('replace.replacement') }}</label>
      <input type="text" :value="store.tabParams[store.activeTab].replacement || ''" @input="setParam('replacement', $event.target.value)" placeholder="如 new">
    </div>
    <div class="form-group form-check">
      <input type="checkbox" id="chk-case" :checked="store.tabParams[store.activeTab].caseSensitive !== false" @change="setParam('caseSensitive', $event.target.checked)">
      <label for="chk-case">{{ t('replace.caseSensitive') }}</label>
    </div>
    <div class="form-group form-check">
      <input type="checkbox" id="chk-regex" :checked="store.tabParams[store.activeTab].useRegex || false" @change="setParam('useRegex', $event.target.checked)">
      <label for="chk-regex">{{ t('replace.useRegex') }}</label>
    </div>
    <div class="form-group form-check">
      <input type="checkbox" id="chk-all" :checked="store.tabParams[store.activeTab].replaceAll !== false" @change="setParam('replaceAll', $event.target.checked)">
      <label for="chk-all">{{ t('replace.replaceAll') }}</label>
    </div>
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
/** 表单组输入框 */
.form-group input {
  padding: 7px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  color: #111827;
  background: #fff;
  font-family: inherit;
}
/** 表单组输入框聚焦态 */
.form-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59,130,246,0.15);
}
/** 复选框行 */
.form-check {
  flex-direction: row;
  align-items: center;
  gap: 8px;
}
/** 复选框输入 */
.form-check input {
  width: auto;
}
/** 复选框标签 */
.form-check label {
  cursor: pointer;
}
</style>
