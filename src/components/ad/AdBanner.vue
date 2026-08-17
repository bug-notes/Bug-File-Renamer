<script setup>
/** Vue 响应式 API */
import { ref, onMounted, onBeforeUnmount } from 'vue';
/** 应用配置信息 */
import appInfo from '../../../appInfo.json';

/** 从 appInfo.json 读取广告地址 */
const adUrl = appInfo.adUrl;
/** 网站域名（用于占位链接） */
const website = appInfo.website;
/** webview 元素引用 */
const webviewEl = ref(null);
/** 广告加载成功标记（默认 false，成功后切为 webview） */
const adReady = ref(false);
/** 加载超时定时器 */
let timeoutId = null;

/** webview 加载失败回调（回退占位） */
const onFail = () => {
  /** 清除超时定时器 */
  clearTimeout(timeoutId);
  /** 回退到占位 */
  adReady.value = false;
};

/** 拦截 webview 内导航，用系统浏览器打开 */
const onWillNavigate = (e) => {
  /** 阻止 webview 内跳转 */
  e.preventDefault();
  /** 用系统默认浏览器打开 */
  window.electronAPI.openExternal(e.url);
};

/** 拦截新窗口打开（target="_blank" 等） */
const onNewWindow = (e) => {
  /** 阻止 webview 打开新窗口 */
  e.preventDefault();
  /** 用系统默认浏览器打开 */
  window.electronAPI.openExternal(e.url);
};

/** 点击占位区域打开网站 */
const openAdLink = () => {
  window.electronAPI.openExternal('https://' + website);
};

/** 挂载后先检查广告地址是否可用，再决定是否加载 webview */
onMounted(async () => {
  /** 通过 IPC 检查广告地址状态码 */
  const status = await window.electronAPI.checkUrl(adUrl);
  if (status === 200) {
    /** 状态码 200，启动 webview 加载广告 */
    adReady.value = true;
    await new Promise((r) => setTimeout(r, 100));
    /** 获取 webview DOM 元素 */
    const el = webviewEl.value;
    if (el) {
      /** 监听加载失败（回退占位） */
      el.addEventListener('did-fail-load', onFail);
      /** 监听导航事件 */
      el.addEventListener('will-navigate', onWillNavigate);
      /** 监听新窗口事件 */
      el.addEventListener('new-window', onNewWindow);
    }
    /** 设置 10 秒超时保险，超时回退占位 */
    timeoutId = setTimeout(() => {
      adReady.value = false;
    }, 10000);
  }
  /** 非 200 状态码或网络错误，保持默认占位 */
});

/** 卸载前清理定时器 */
onBeforeUnmount(() => {
  clearTimeout(timeoutId);
});
</script>

<template>
  <!-- 广告区域容器 -->
  <div class="ad-banner">
    <!-- 默认占位（广告未就绪时始终显示） -->
    <div v-if="!adReady" class="ad-placeholder" @click="openAdLink">
      <!-- 广告图标 -->
      <i class="fa-solid fa-ad ad-placeholder-icon"></i>
      <!-- 文字信息区域 -->
      <div class="ad-placeholder-info">
        <!-- 作者标识 -->
        <span class="ad-placeholder-author">@Bug笔记</span>
        <!-- 网站地址 -->
        <span class="ad-placeholder-url">{{ website }}</span>
      </div>
    </div>
    <!-- 广告就绪后显示 webview -->
    <webview
      v-else
      ref="webviewEl"
      :src="adUrl"
      class="ad-webview"
    />
  </div>
</template>

<style scoped>
/** 广告区域容器 */
.ad-banner {
  flex-shrink: 0;
  height: 70px;
  border-top: 1px solid #d1d5db;
  background: #fff;
  overflow: hidden;
}
/** webview 全尺寸 */
.ad-webview {
  width: 100%;
  height: 100%;
  border: none;
}
/** 占位区域 */
.ad-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: linear-gradient(135deg, #1e3a5f 0%, #2d3748 100%);
  cursor: pointer;
  transition: opacity 0.15s;
}
/** 占位区域悬停态 */
.ad-placeholder:hover {
  opacity: 0.9;
}
/** 占位图标 */
.ad-placeholder-icon {
  font-size: 50px;
  color: #93c5fd;
}
/** 占位文字信息区域 */
.ad-placeholder-info {
  display: flex;
  align-items: start;
  flex-direction: column;
}
/** 占位作者 */
.ad-placeholder-author {
  font-size: 22px;
  color: #93c5fd;
}
/** 占位网址 */
.ad-placeholder-url {
  font-size: 14px;
  color: #93c5fd;
}
</style>
