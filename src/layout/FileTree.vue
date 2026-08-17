<script setup>
/** Vue 响应式 API */
import { inject, ref, onMounted, watch, nextTick } from 'vue';
/** 全局 store 标识符 */
import { storeKey } from '../store/index.js';
/** 国际化翻译函数 */
import { t } from '../i18n/index.js';
/** 递归树节点组件 */
import TreeNode from './TreeNode.vue';

/** 注入全局 store */
const store = inject(storeKey);
/** 树根节点列表 */
const treeNodes = ref([]);
/** 刷新加载状态 */
const isLoading = ref(false);
/** 刷新按钮旋转动画状态 */
const spinning = ref(false);

/**
 * 收集当前树中所有 expanded 为 true 的节点路径。
 * @param {Array} nodes - 树节点数组
 * @returns {Set<string>} 已展开路径集合
 */
const collectExpandedPaths = (nodes) => {
  /** 路径集合 */
  const paths = new Set();
  /** 递归遍历内部函数 */
  const walk = (list) => {
    /** 遍历节点列表 */
    for (const node of list) {
      /** 已展开节点记录路径 */
      if (node.expanded) paths.add(node.path);
      /** 有子节点则继续遍历 */
      if (node.children && node.children.length) walk(node.children);
    }
  };
  /** 启动递归遍历 */
  walk(nodes);
  /** 返回收集到的路径集合 */
  return paths;
};

/**
 * 递归加载并重建树节点，同时恢复展开状态。
 * @param {Array} dirList - 目录条目列表 [{name, path}]
 * @param {Set<string>} expandedPaths - 需要恢复展开的路径集合
 * @returns {Promise<Array>} 重建后的树节点数组
 */
const rebuildNodes = async (dirList, expandedPaths) => {
  /** 并行处理所有目录条目 */
  return Promise.all(dirList.map(async (d) => {
    /** 尝试读取目录以检测权限和子目录 */
    const res = await window.electronAPI.readDir(d.path);
    /** 读取失败视为无权限 */
    const locked = !!(res && res.error);
    /** 可访问时的子目录列表 */
    const childDirs = (!locked && res.dirs) ? res.dirs : [];
    /** 是否有子目录 */
    const hasKids = childDirs.length > 0;
    /** 是否之前处于展开状态 */
    const wasExpanded = expandedPaths.has(d.path);

    /** 子节点引用 */
    let children;
    if (locked) {
      /** 无权限时 children 为 null（不显示箭头） */
      children = null;
    } else if (wasExpanded && hasKids) {
      /** 之前展开且有子目录：递归恢复 */
      children = await rebuildNodes(childDirs, expandedPaths);
    } else if (hasKids) {
      /** 未展开但有子目录：保留 null 表示待加载 */
      children = null;
    } else {
      /** 空目录 */
      children = [];
    }

    /** 返回重建后的节点对象 */
    return {
      name: d.name,
      path: d.path,
      expanded: wasExpanded && !locked,
      loading: false,
      children,
      locked,
    };
  }));
};

/**
 * 加载当前文件夹的文件列表到 store。
 * @param {string} folderPath - 文件夹路径
 */
const loadCurrentFolderFiles = async (folderPath) => {
  /** 读取目录文件 */
  const result = await window.electronAPI.readDir(folderPath);
  if (result.files) {
    /** 映射为 store 文件格式并按名称排序 */
    store.files = result.files
      .map((f, i) => ({
        id: i, name: f.name, path: f.path, originalName: f.name,
        checked: false, status: 'original', newName: '',
      }))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
    /** 重置全选状态 */
    store.checkedAll = false;
    /** 清空撤销栈 */
    store.undoStack = [];
  }
};

/**
 * 收集当前已锁定文件夹的名称列表（用于提示）。
 * @returns {Array<string>}
 */
const getLockedNames = () => {
  /** 锁定文件夹名称列表 */
  const names = [];
  /** 递归收集内部函数 */
  const walk = (nodes) => {
    /** 遍历节点列表 */
    for (const node of nodes) {
      /** 锁定节点记录名称 */
      if (node.locked) names.push(node.name);
      /** 有子节点则继续遍历 */
      if (node.children && node.children.length) walk(node.children);
    }
  };
  /** 启动递归遍历 */
  walk(treeNodes.value);
  /** 返回锁定文件夹名称列表 */
  return names;
};

/** 创建标准树节点对象 */
const makeNode = (name, path, children) => {
  /** 返回标准化节点对象 */
  return { name, path, expanded: false, loading: false, children };
}

/** 刷新树：重新检查权限，保留展开状态 */
const refreshTree = async () => {
  /** 开启加载态 */
  isLoading.value = true;
  /** 触发旋转动画 */
  spinning.value = true;
  /** 最小加载动画时间 300ms */
  await new Promise((r) => setTimeout(r, 300));
  try {
    /** 保存当前展开路径 */
    const expandedPaths = collectExpandedPaths(treeNodes.value);

    /** 获取系统根目录条目 */
    const roots = await window.electronAPI.getSystemRoots();

    /** 重建根节点树（已恢复展开状态） */
    treeNodes.value = await rebuildNodes(roots, expandedPaths);

    /** 重新加载当前文件夹文件列表 */
    if (store.currentFolder) {
      await loadCurrentFolderFiles(store.currentFolder);
    }

    /** 检查是否仍有锁定文件夹 */
    const lockedNames = getLockedNames();
    if (lockedNames.length > 0) {
      /** 弹出授权询问对话框 */
      const result = await window.electronAPI.showMessageBox({
        type: 'warning',
        title: t('fileTree.permTitle'),
        message: t('fileTree.permTitle'),
        detail: t('fileTree.permMessage', lockedNames.join('、')),
        buttons: [t('fileTree.permGrant'), t('fileTree.permCancel')],
        defaultId: 0,
        cancelId: 1,
      });
      /** 用户点击「去授权」 */
      if (result.response === 0) {
        /** 打开文件夹选择器让用户手动导航授权（macOS Powerbox 机制） */
        await window.electronAPI.openFolderDialog();
        /** 关闭加载态再递归刷新（内部会重新开启） */
        isLoading.value = false;
        spinning.value = false;
        /** 授权后再次刷新 */
        await refreshTree();
        /** 递归调用已处理后续状态，提前返回 */
        return;
      }
    }
  } finally {
    /** 关闭加载态 */
    isLoading.value = false;
    /** 停止旋转动画 */
    spinning.value = false;
  }
};

/** 挂载时加载默认系统目录 */
onMounted(async () => {
  await refreshTree();
});

/** 递归展开到目标路径 */
const expandPath = async (targetPath) => {
  /** 遍历根节点查找匹配路径 */
  for (const node of treeNodes.value) {
    /** 检查当前节点是否为目标路径的祖先（完全相同或以路径分隔符开头，避免路径前缀误匹配） */
    if (targetPath === node.path || targetPath.startsWith(node.path + '/') || targetPath.startsWith(node.path + '\\')) {
      /** 未展开则先加载子目录 */
      if (!node.expanded) {
        /** 读取子目录列表 */
        const res = await window.electronAPI.readDir(node.path);
        /** 将子目录映射为树节点 */
        node.children = (res.dirs && res.dirs.length)
          ? res.dirs.map((d) => makeNode(d.name, d.path, null))
          : [];
        /** 标记已展开 */
        node.expanded = true;
      }
      /** 继续向子节点展开 */
      if (node.children && node.children.length) {
        await expandChildren(node.children, targetPath);
      }
      /** 找到匹配后停止遍历 */
      break;
    }
  }
}

/** 在子节点列表中递归展开到目标路径 */
const expandChildren = async (children, targetPath) => {
  /** 遍历子节点 */
  for (const child of children) {
    /** 检查子节点是否为目标路径的祖先（完全相同或以路径分隔符开头） */
    if (targetPath === child.path || targetPath.startsWith(child.path + '/') || targetPath.startsWith(child.path + '\\')) {
      /** 未展开则先加载下一级 */
      if (!child.expanded) {
        /** 读取子目录列表 */
        const res = await window.electronAPI.readDir(child.path);
        /** 将子目录映射为树节点 */
        child.children = (res.dirs && res.dirs.length)
          ? res.dirs.map((d) => makeNode(d.name, d.path, null))
          : [];
        /** 标记已展开 */
        child.expanded = true;
      }
      /** 继续向更深层展开 */
      if (child.children && child.children.length) {
        await expandChildren(child.children, targetPath);
      }
      /** 找到匹配后停止遍历 */
      break;
    }
  }
}

/** 拖拽文件后自动展开到目标路径 */
watch(() => store.dropPath, async (newPath) => {
  /** 无目标路径则跳过 */
  if (!newPath) return;
  /** 等待 DOM 更新后展开 */
  await nextTick();
  /** 执行递归展开 */
  await expandPath(newPath);
});
</script>

<template>
  <!-- 文件树侧边栏 -->
  <aside class="file-tree">
    <!-- 文件树标题栏 -->
    <div class="file-tree-header">
      <h2 class="file-tree-title">{{ t('fileTree.title') }}</h2>
      <button
        class="refresh-btn"
        :class="{ spinning: spinning }"
        :title="t('fileTree.refresh')"
        @click="refreshTree"
      >
        <i class="fa-solid fa-rotate-right"></i>
      </button>
    </div>
    <!-- 加载中遮罩 -->
    <div v-if="isLoading" class="tree-loading-overlay">
      <i class="fa-solid fa-spinner fa-spin tree-loading-icon"></i>
      <span>{{ t('fileTree.loading') }}</span>
    </div>
    <!-- 树节点列表 -->
    <nav v-show="!isLoading" class="tree-nav">
      <TreeNode
        v-for="node in treeNodes"
        :key="node.path"
        :node="node"
        :depth="0"
      />
    </nav>
  </aside>
</template>

<style scoped>
/** 文件树侧边栏容器 */
.file-tree {
  width: 320px;
  flex-shrink: 0;
  background: #fff;
  color: #374151;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  border-right: 1px solid #d1d5db;
}
/** 文件树标题栏 */
.file-tree-header {
  padding: 12px 16px;
  border-bottom: 1px solid #d1d5db;
  background: #2d3748;
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
/** 文件树标题文字 */
.file-tree-title {
  color: #fff;
  font-size: 15px;
  font-weight: 600;
}
/** 刷新按钮 */
.refresh-btn {
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  padding: 4px 6px;
  border-radius: 4px;
  -webkit-app-region: no-drag;
  transition: background 0.15s;
  line-height: 1;
}
/** 刷新按钮悬停态 */
.refresh-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}
/** 刷新中旋转动画 */
.refresh-btn.spinning i {
  animation: spin 0.8s linear infinite;
}
/** 旋转关键帧动画 */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
/** 加载中遮罩 */
.tree-loading-overlay {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  gap: 12px;
  font-size: 13px;
}
/** 加载中图标 */
.tree-loading-icon {
  font-size: 28px;
  color: #d1d5db;
}
/** 树节点导航区 */
.tree-nav {
  padding: 8px;
  flex: 1;
  width: 100%;
  min-height: 0;
  overflow-x: scroll;
}
</style>
