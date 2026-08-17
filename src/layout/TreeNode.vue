<script setup>
/** Vue 依赖注入 */
import { inject } from 'vue';
/** store 标识符 */
import { storeKey } from '../store/index.js';

/** 组件属性定义 */
const props = defineProps({
  /** 树节点数据 */
  node: { type: Object, required: true },
  /** 当前深度（用于计算缩进） */
  depth: { type: Number, default: 0 },
});

/** 注入全局 store */
const store = inject(storeKey);

/** 判断节点是否显示展开箭头 */
const hasArrow = (node) => {
  /** children 为 null（未加载）或长度 > 0 时显示箭头 */
  return node.children === null || node.children.length > 0;
};

/** 预检子目录是否有孙目录 */
const checkGrandchildren = async (childDirs) => {
  return Promise.all(childDirs.map(async (d) => {
    /** 读取子目录内容 */
    const res = await window.electronAPI.readDir(d.path);
    /** 判断是否有孙目录 */
    const hasKids = res.dirs && res.dirs.length > 0;
    /** 返回带 children 标记的节点 */
    return {
      name: d.name, path: d.path,
      expanded: false, loading: false,
      children: hasKids ? null : [],
    };
  }));
};

/** 加载文件列表到 store */
const loadFiles = (files) => {
  /** 映射为 store 文件格式并按名称排序 */
  store.files = files
    .map((f, i) => ({
      id: i, name: f.name, path: f.path, originalName: f.name,
      checked: false, status: 'original', newName: '',
    }))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
  /** 重置全选状态 */
  store.checkedAll = false;
  /** 清空撤销栈 */
  store.undoStack = [];
};

/** 展开/折叠节点，Ctrl+点击递归加载。无权限节点不响应点击 */
const toggleNode = async (event) => {
  /** 获取当前节点数据 */
  const node = props.node;
  /** 无权限目录不展开 */
  if (node.locked) return;

  /** 检测是否为 Ctrl/Cmd 点击 */
  const isModClick = event.ctrlKey || event.metaKey;
  /** Ctrl/Cmd 点击：递归加载所有嵌套文件 */
  if (isModClick) {
    /** 设置为当前文件夹 */
    store.currentFolder = node.path;
    /** 递归读取所有文件 */
    const files = await window.electronAPI.readDirRecursive(node.path);
    /** 加载到 store */
    loadFiles(files);
    /** 提前返回，跳过展开逻辑 */
    return;
  }

  /** 普通点击：设置为当前文件夹 */
  store.currentFolder = node.path;
  /** 读取当前目录文件 */
  const result = await window.electronAPI.readDir(node.path);
  /** 有文件则加载到 store */
  if (result.files) loadFiles(result.files);

  /** 未展开时才加载子目录 */
  if (!node.expanded) {
    /** 标记加载中 */
    node.loading = true;
    /** 读取子目录 */
    const res = await window.electronAPI.readDir(node.path);
    /** 有子目录则预检孙目录 */
    if (res.dirs && res.dirs.length) {
      /** 递归预检并赋值 */
      node.children = await checkGrandchildren(res.dirs);
    } else {
      /** 无子目录则设为空数组 */
      node.children = [];
    }
    /** 取消加载中标记 */
    node.loading = false;
  }
  /** 切换展开/折叠状态 */
  node.expanded = !node.expanded;
};

/** 暴露 toggleNode 供父组件调用 */
defineExpose({ toggleNode });
</script>

<template>
  <div>
    <div
      class="tree-item"
      :class="{ active: store.currentFolder === node.path }"
      :style="{ paddingLeft: (12 + depth * 20) + 'px' }"
      @click="toggleNode"
    >
      <i v-if="node.loading" class="fa-solid fa-spinner fa-spin tree-arrow"></i>
      <i v-else-if="hasArrow(node)" class="fa-solid tree-arrow"
        :class="node.expanded ? 'fa-chevron-down' : 'fa-chevron-right'"></i>
      <span v-else class="tree-arrow"></span>
      <i v-if="node.locked" class="fa-solid fa-lock tree-lock-icon"></i>
      <i v-else class="fa-solid fa-folder tree-folder-icon"></i>
      <span class="tree-label" :class="{ 'text-locked': node.locked }">{{ node.name }}</span>
    </div>
    <template v-if="node.expanded && node.children && node.children.length">
      <TreeNode
        v-for="child in node.children"
        :key="child.path"
        :node="child"
        :depth="depth + 1"
      />
    </template>
  </div>
</template>

<style scoped>
/** 树节点行 */
.tree-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
  font-size: 13px;
  color: #374151;
}
/** 树节点行悬停态 */
.tree-item:hover {
  background: #f3f4f6;
}
/** 树节点行激活态 */
.tree-item.active {
  background: #dbeafe;
  color: #1e40af;
}
/** 激活态文件夹图标 */
.tree-item.active .tree-folder-icon {
  color: #3b82f6;
}
/** 激活态节点标签 */
.tree-item.active .tree-label {
  font-weight: 600;
}
/** 展开/折叠箭头 */
.tree-arrow {
  font-size: 10px;
  width: 14px;
  text-align: center;
  flex-shrink: 0;
  color: #9ca3af;
}
/** 文件夹图标 */
.tree-folder-icon {
  font-size: 14px;
  color: #93c5fd;
  width: 18px;
  text-align: center;
  flex-shrink: 0;
}
/** 无权限目录图标 */
.tree-lock-icon {
  font-size: 12px;
  color: #f87171;
  width: 18px;
  text-align: center;
  flex-shrink: 0;
}
/** 无权限目录文字 */
.text-locked {
  color: #9ca3af;
}
/** 树节点标签 */
.tree-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
