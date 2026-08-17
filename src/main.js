/** Vue 应用创建 API */
import { createApp } from 'vue';
/** 根组件 */
import App from './App.vue';
/** 全局响应式 store 和依赖注入 key */
import { store, storeKey } from './store/index.js';
/** 全局样式 */
import './styles/main.css';

/** 创建 Vue 应用实例 */
const app = createApp(App);
/** 通过 provide 向所有后代组件注入全局 store */
app.provide(storeKey, store);
/** 将应用挂载到 #app DOM 节点 */
app.mount('#app');
