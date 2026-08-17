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
      <label>{{ t('numbering.position') }}</label>
      <select :value="store.tabParams[store.activeTab].position || 'prefix'" @change="setParam('position', $event.target.value)">
        <option value="prefix">{{ t('numbering.positionPrefix') }}</option>
        <option value="suffix">{{ t('numbering.positionSuffix') }}</option>
      </select>
    </div>
    <div class="form-group">
      <label>{{ t('numbering.startNumber') }}</label>
      <input type="number" :value="store.tabParams[store.activeTab].startNumber ?? 1" @input="setParam('startNumber', $event.target.value)" min="1">
    </div>
    <div class="form-group">
      <label>{{ t('numbering.step') }}</label>
      <input type="number" :value="store.tabParams[store.activeTab].step ?? 1" @input="setParam('step', $event.target.value)" min="1">
    </div>
    <div class="form-group">
      <label>{{ t('numbering.padding') }}</label>
      <input type="number" :value="store.tabParams[store.activeTab].padding ?? 2" @input="setParam('padding', $event.target.value)" min="0" max="6" placeholder="2">
    </div>
    <div class="form-group">
      <label>{{ t('numbering.prefix') }}</label>
      <input type="text" :value="store.tabParams[store.activeTab].prefix || ''" @input="setParam('prefix', $event.target.value)" placeholder="如 IMG_">
    </div>
    <div class="form-group">
      <label>{{ t('numbering.suffix') }}</label>
      <input type="text" :value="store.tabParams[store.activeTab].suffix || ''" @input="setParam('suffix', $event.target.value)" placeholder="如 _v2">
    </div>
    <div class="form-section">
      <label class="section-title">{{ t('numbering.direction') }}</label>
      <div class="radio-option" @click="setParam('reverse', false)">
        <i :class="['fa-regular', !store.tabParams[store.activeTab].reverse ? 'fa-circle-dot' : 'fa-circle']"></i>
        <span>{{ t('numbering.forward') }}</span>
      </div>
      <div class="radio-option" @click="setParam('reverse', true)">
        <i :class="['fa-regular', store.tabParams[store.activeTab].reverse ? 'fa-circle-dot' : 'fa-circle']"></i>
        <span>{{ t('numbering.reverse') }}</span>
      </div>
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
  text-align: left;
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
</style>
