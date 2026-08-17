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
    <div class="form-group form-check">
      <input type="checkbox" id="conv-upper" :checked="store.tabParams[store.activeTab].mode === 'upper'" @change="setParam('mode', $event.target.checked ? 'upper' : '')">
      <label for="conv-upper">{{ t('convert.upper') }}</label>
    </div>
    <div class="form-group form-check">
      <input type="checkbox" id="conv-lower" :checked="store.tabParams[store.activeTab].mode === 'lower'" @change="setParam('mode', $event.target.checked ? 'lower' : '')">
      <label for="conv-lower">{{ t('convert.lower') }}</label>
    </div>
    <div class="form-group form-check">
      <input type="checkbox" id="conv-title" :checked="store.tabParams[store.activeTab].mode === 'title'" @change="setParam('mode', $event.target.checked ? 'title' : '')">
      <label for="conv-title">{{ t('convert.title') }}</label>
    </div>
    <!-- 拼音功能暂未实现，待后续版本支持 -->
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
  font-size: 13px;
  color: #374151;
}
</style>
