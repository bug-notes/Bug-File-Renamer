/** Vite 构建配置 */
import { defineConfig } from 'vite';
/** Vue SFC 编译插件 */
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  /** Vue SFC 编译插件 */
  plugins: [vue()],
  /** 使用相对路径，适配 Electron file:// 协议 */
  base: './',
  /** 设置源码根目录为 src */
  root: 'src',
  build: {
    /** 输出到项目根目录的 dist */
    outDir: '../dist',
    /** 每次构建清空输出目录 */
    emptyOutDir: true,
    /** 输出 ES2015 以避免 crossorigin module 问题 */
    target: 'es2015',
    /** 关闭 module preload polyfill */
    modulePreload: false,
    /** 生产环境移除 console 和 debugger */
    drop: ['console', 'debugger'],
  },
  /** esbuild 代码混淆选项 */
  esbuild: {
    /** 丢弃 console 和 debugger 语句 */
    drop: ['console', 'debugger'],
    /** 启用标识符简化 */
    minifyIdentifiers: true,
    /** 启用语法简化 */
    minifySyntax: true,
  },
  /** Vite 开发服务器端口 */
  server: { port: 5173 },
});
