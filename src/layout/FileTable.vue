<script setup>
/** Vue 响应式 API */
import { inject, computed, ref } from 'vue';
/** 全局 store 标识符 */
import { storeKey } from '../store/index.js';
/** 文件名解析工具 */
import { parseFilename } from '../utils/filename.mjs';
/** 国际化翻译函数 */
import { t } from '../i18n/index.js';

/** 注入全局 store */
const store = inject(storeKey);

/** 是否处于拖拽悬停状态 */
const isDragOver = ref(false);
/** 是否处于加载状态 */
const isLoading = ref(false);

/** 已勾选文件数量 */
const checkedCount = computed(() => store.files.filter((f) => f.checked).length);

/* ── 排序 ── */

/** 当前排序字段（null 表示不排序） */
const sortKey = ref(null);
/** 当前排序方向（asc 升序 / desc 降序） */
const sortDir = ref('asc');

/**
 * 根据排序字段提取文件的比较值。
 * @param {Object} file - 文件对象
 * @param {string} key - 排序字段
 * @returns {string} 比较用的字符串
 */
const getSortValue = (file, key) => {
  /** 按原始文件名排序 */
  if (key === 'name') return file.name.toLowerCase();
  /** 按新文件名排序 */
  if (key === 'newName') return (file.newName || '').toLowerCase();
  /** 按扩展名排序 */
  if (key === 'ext') return (parseFilename(file.newName || file.name).ext || '').toLowerCase();
  /** 按状态排序：用数字优先级 */
  if (key === 'status') { const order = { original: 0, modified: 1, renamed: 2, error: 3 }; return String(order[file.status] || 0); }
  /** 默认 */
  return '';
};

/** 切换排序：点击同一字段循环 none→asc→desc→none */
const toggleSort = (key) => {
  /** 当前已是该字段且升序 */
  if (sortKey.value === key && sortDir.value === 'asc') { sortDir.value = 'desc'; }
  /** 当前已是该字段且降序 */
  else if (sortKey.value === key && sortDir.value === 'desc') { sortKey.value = null; sortDir.value = 'asc'; }
  /** 新字段或从 none 切换 */
  else { sortKey.value = key; sortDir.value = 'asc'; }
};

/* ── 搜索 ── */

/** 搜索关键词 */
const searchQuery = ref('');

/* ── 排序和过滤后的文件列表 ── */

/** 最终展示的文件列表（经过排序和搜索过滤） */
const displayFiles = computed(() => {
  /** 先过滤再排序 */
  let list = [...store.files];
  /** 搜索过滤 */
  if (searchQuery.value) {
    /** 搜索关键词转小写 */
    const q = searchQuery.value.toLowerCase();
    /** 按文件名模糊匹配 */
    list = list.filter((f) => f.name.toLowerCase().includes(q));
  }
  /** 排序 */
  if (sortKey.value) {
    /** 排序权重 */
    const dir = sortDir.value === 'asc' ? 1 : -1;
    /** 执行排序 */
    list.sort((a, b) => {
      /** 提取比较值 */
      const va = getSortValue(a, sortKey.value);
      /** 提取比较值 */
      const vb = getSortValue(b, sortKey.value);
      /** 比较并返回 */
      return va.localeCompare(vb, undefined, { numeric: true, sensitivity: 'base' }) * dir;
    });
  }
  /** 返回处理后的列表 */
  return list;
});

/* ── 选择操作 ── */

/** 全选 / 取消全选 */
const toggleAll = () => {
  /** 取反当前全选状态 */
  const val = !store.checkedAll;
  /** 更新全选状态 */
  store.checkedAll = val;
  /** 遍历设置每个文件的勾选状态 */
  store.files.forEach((f) => (f.checked = val));
}

/** 反选：已勾选的取消，未勾选的选中 */
const invertSelection = () => {
  /** 遍历反转每个文件的勾选状态 */
  store.files.forEach((f) => (f.checked = !f.checked));
  /** 全选状态根据实际勾选情况更新 */
  store.checkedAll = store.files.every((f) => f.checked);
}

/** 清空所有勾选 */
const clearSelection = () => {
  /** 遍历取消所有文件的勾选 */
  store.files.forEach((f) => (f.checked = false));
  /** 重置全选状态 */
  store.checkedAll = false;
}

/** 切换单个文件的勾选状态 */
const toggleOne = (file) => {
  /** 取反当前文件的勾选状态 */
  file.checked = !file.checked;
  /** 根据全部文件更新全选状态 */
  store.checkedAll = store.files.every((f) => f.checked);
}

/** 刷新当前文件夹的文件列表 */
const refreshFiles = async () => {
  /** 无当前文件夹则跳过 */
  if (!store.currentFolder) return;
  /** 开启加载态 */
  isLoading.value = true;
  /** 最小加载动画时间 300ms */
  await new Promise((r) => setTimeout(r, 300));
  /** 读取当前目录内容 */
  const result = await window.electronAPI.readDir(store.currentFolder);
  /** 读取成功则更新文件列表 */
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
    /** 重置排序状态 */
    sortKey.value = null;
    /** 清空搜索 */
    searchQuery.value = '';
    /** 清空撤销栈 */
    store.undoStack = [];
  }
  /** 关闭加载态 */
  isLoading.value = false;
}

/* ── 拖拽导入 ── */

/** 拖拽悬停：阻止默认行为并显示拖拽覆盖层 */
const handleDragOver = (e) => {
  /** 阻止浏览器默认行为（打开文件） */
  e.preventDefault();
  /** 显示拖拽覆盖层 */
  isDragOver.value = true;
}

/** 拖拽离开：隐藏拖拽覆盖层 */
const handleDragLeave = () => {
  /** 隐藏拖拽覆盖层 */
  isDragOver.value = false;
}

/** 处理文件/文件夹拖放导入 */
const handleDrop = async (e) => {
  /** 阻止浏览器默认打开文件行为 */
  e.preventDefault();
  /** 隐藏拖拽覆盖层 */
  isDragOver.value = false;

  /** 收集拖放的文件路径 */
  const droppedPaths = [];
  /** 获取拖放的文件列表 */
  const droppedFiles = e.dataTransfer.files;
  /** 有文件则遍历提取系统路径 */
  if (droppedFiles && droppedFiles.length) {
    /** 遍历拖放的文件列表 */
    for (const f of droppedFiles) {
      /** 提取文件系统路径 */
      if (f.path) droppedPaths.push(f.path);
    }
  }

  /** 无有效路径则返回 */
  if (!droppedPaths.length) return;

  /** 开启加载态 */
  isLoading.value = true;
  /** 所有文件累积列表 */
  const allFiles = [];

  /** 遍历拖放的每个路径 */
  for (const filePath of droppedPaths) {
    /** 尝试作为目录读取 */
    const dirCheck = await window.electronAPI.readDir(filePath);
    /** 读取失败说明路径为文件 */
    if (dirCheck.error) {
      /** 路径为文件，直接加入列表 */
      const name = filePath.replace(/^.*[/\\]/, '');
      /** 将文件加入列表 */
      allFiles.push({ name, path: filePath });
    } else if (dirCheck.files) {
      /** 路径为目录，递归读取所有嵌套文件 */
      const nested = await window.electronAPI.readDirRecursive(filePath);
      /** 将嵌套文件合并到列表 */
      allFiles.push(...nested);
    }
  }

  /** 无文件则关闭加载态并返回 */
  if (!allFiles.length) { isLoading.value = false; return; }

  /** 提取文件所在目录作为当前文件夹（处理根目录边界：C:\file.txt → C:\） */
  const lastSlash = Math.max(allFiles[0].path.lastIndexOf('/'), allFiles[0].path.lastIndexOf('\\'));
  /** 设置当前文件夹：根目录保留完整路径 */
  store.currentFolder = lastSlash > 0 ? allFiles[0].path.slice(0, lastSlash) : allFiles[0].path;
  /** 设置展开目标路径 */
  store.dropPath = store.currentFolder;

  /** 映射为 store 文件格式并按名称排序 */
  store.files = allFiles
    .map((f, i) => ({
      id: i, name: f.name, path: f.path, originalName: f.name,
      checked: false, status: 'original', newName: '',
    }))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
  /** 重置全选状态 */
  store.checkedAll = false;
  /** 重置排序 */
  sortKey.value = null;
  /** 清空搜索 */
  searchQuery.value = '';
  /** 清空撤销栈 */
  store.undoStack = [];
  /** 关闭加载态 */
  isLoading.value = false;
}

/* ── 文件图标 & 样式 ── */

/** 判断是否为系统隐藏文件 */
const isSystemFile = (name) => {
  /** 以 . 开头或常见系统文件名视为系统文件 */
  return name.startsWith('.') || name === 'Thumbs.db' || name === 'Desktop.ini';
}

/** 根据扩展名返回对应的 Font Awesome 图标类名 */
const getFileIcon = (name) => {
  /** 提取扩展名并转小写 */
  const ext = (parseFilename(name).ext || '').toLowerCase();
  /** 扩展名 → 图标映射表 */
  const map = {
    '.pdf': 'fa-file-pdf',
    '.doc': 'fa-file-word', '.docx': 'fa-file-word',
    '.xls': 'fa-file-excel', '.xlsx': 'fa-file-excel', '.csv': 'fa-file-csv',
    '.jpg': 'fa-file-image', '.jpeg': 'fa-file-image', '.png': 'fa-file-image',
    '.gif': 'fa-file-image', '.svg': 'fa-file-image', '.webp': 'fa-file-image',
    '.mp3': 'fa-file-audio', '.wav': 'fa-file-audio', '.flac': 'fa-file-audio',
    '.mp4': 'fa-file-video', '.mov': 'fa-file-video', '.avi': 'fa-file-video',
    '.zip': 'fa-file-zipper', '.rar': 'fa-file-zipper', '.7z': 'fa-file-zipper',
    '.txt': 'fa-file-lines', '.md': 'fa-file-lines',
    '.js': 'fa-file-code', '.ts': 'fa-file-code', '.py': 'fa-file-code',
    '.html': 'fa-file-code', '.css': 'fa-file-code', '.json': 'fa-file-code',
  };
  /** 回退到默认文件图标 */
  return map[ext] || 'fa-file';
}

/** 根据扩展名返回对应的图标颜色 CSS 类名 */
const getIconColor = (name) => {
  /** 系统文件灰色显示 */
  if (isSystemFile(name)) return 'icon-dim';
  /** 提取扩展名并转小写 */
  const ext = (parseFilename(name).ext || '').toLowerCase();
  /** 图片文件：橙色 */
  if (['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'].includes(ext)) return 'icon-image';
  /** 音频文件：紫色 */
  if (['.mp3', '.wav', '.flac', '.aac'].includes(ext)) return 'icon-audio';
  /** 视频文件：红色 */
  if (['.mp4', '.mov', '.avi', '.mkv'].includes(ext)) return 'icon-video';
  /** PDF 文件：深红色 */
  if (['.pdf'].includes(ext)) return 'icon-pdf';
  /** 代码文件：绿色 */
  if (['.js', '.ts', '.py', '.html', '.css', '.json'].includes(ext)) return 'icon-code';
  /** 压缩包：灰色 */
  if (['.zip', '.rar', '.7z', '.tar', '.gz'].includes(ext)) return 'icon-archive';
  /** 默认无色 */
  return '';
}

/** 返回文件行对应的 CSS 类名 */
const rowClass = (file) => {
  return {
    'row-checked': file.checked,
    'row-system': isSystemFile(file.name),
  };
}

/** 返回文件状态对应的 CSS 标签类名 */
const statusClass = (status) => {
  /** 状态 → 样式类映射 */
  const map = { original: 'tag-original', modified: 'tag-modified', renamed: 'tag-renamed', error: 'tag-error' };
  /** 返回对应样式类，回退到 original */
  return map[status] || 'tag-original';
}

/** 返回文件状态对应的显示文字 */
const statusLabel = (status) => {
  /** 状态 → 文字映射 */
  const map = { original: t('fileTable.statusOriginal'), modified: t('fileTable.statusModified'), renamed: t('fileTable.statusRenamed'), error: t('fileTable.statusError') };
  /** 返回对应文字标签，回退到"原始" */
  return map[status] || '原始';
}
</script>

<template>
  <!-- 文件列表面板 -->
  <section class="file-table-panel">
    <!-- 标题栏：文件名 + 操作按钮 -->
    <div class="file-table-header">
      <h2 class="file-table-title">{{ t('fileTable.title') }}</h2>
      <div class="header-actions">
        <button class="action-link" @click="toggleAll">{{ t('fileTable.selectAll') }}</button>
        <button class="action-link" @click="invertSelection">{{ t('fileTable.invert') }}</button>
        <button class="action-link" @click="clearSelection">{{ t('fileTable.clear') }}</button>
        <button class="action-link tip tip-left" @click="refreshFiles" :data-tip="t('fileTable.refresh')">
          <i class="fa-solid fa-rotate-right"></i>
        </button>
        <span v-if="store.files.length" class="file-table-count">
          {{ checkedCount }} / {{ store.files.length }}
        </span>
      </div>
    </div>

    <!-- 搜索栏 -->
    <div v-if="store.currentFolder && store.files.length > 0" class="search-bar">
      <i class="fa-solid fa-magnifying-glass search-icon"></i>
      <input
        type="text"
        class="search-input"
        :value="searchQuery"
        @input="searchQuery = $event.target.value"
        placeholder="搜索文件名..."
      >
      <span v-if="searchQuery" class="search-count">显示 {{ displayFiles.length }} / {{ store.files.length }} 个文件</span>
    </div>

    <!-- 加载中 -->
    <div v-if="isLoading" class="state-overlay">
      <i class="fa-solid fa-spinner fa-spin state-icon"></i>
      <span>{{ t('fileTable.loading') }}</span>
    </div>

    <!-- 空状态：未选择文件夹 -->
    <div v-else-if="store.files.length === 0 && !store.currentFolder" class="state-overlay">
      <i class="fa-regular fa-folder-open state-icon"></i>
      <span>{{ t('fileTable.emptyNoFolder') }}</span>
    </div>

    <!-- 空状态：文件夹为空 -->
    <div v-else-if="store.files.length === 0" class="state-overlay">
      <i class="fa-regular fa-folder state-icon"></i>
      <span>{{ t('fileTable.emptyNoFiles') }}</span>
    </div>

    <!-- 文件列表表格 -->
    <div
      v-else
      class="file-table-container"
      :class="{ 'drag-over': isDragOver }"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <div v-if="isDragOver" class="drop-overlay">
        <i class="fa-solid fa-download drop-icon"></i>
        <span>{{ t('fileTable.dropHint') }}</span>
      </div>
      <table class="file-table">
        <thead>
          <tr>
            <th class="col-check">
              <input type="checkbox" :checked="store.checkedAll" @change="toggleAll">
            </th>
            <th class="col-name sortable" @click="toggleSort('name')">
              <span>{{ t('fileTable.originalName') }}</span>
              <i v-if="sortKey === 'name'" :class="['fa-solid', sortDir === 'asc' ? 'fa-caret-up' : 'fa-caret-down']" class="sort-icon"></i>
            </th>
            <th class="col-new sortable" @click="toggleSort('newName')">
              <span>{{ t('fileTable.newName') }}</span>
              <i v-if="sortKey === 'newName'" :class="['fa-solid', sortDir === 'asc' ? 'fa-caret-up' : 'fa-caret-down']" class="sort-icon"></i>
            </th>
            <th class="col-ext sortable" @click="toggleSort('ext')">
              <span>{{ t('fileTable.extension') }}</span>
              <i v-if="sortKey === 'ext'" :class="['fa-solid', sortDir === 'asc' ? 'fa-caret-up' : 'fa-caret-down']" class="sort-icon"></i>
            </th>
            <th class="col-status sortable" @click="toggleSort('status')">
              <span>{{ t('fileTable.status') }}</span>
              <i v-if="sortKey === 'status'" :class="['fa-solid', sortDir === 'asc' ? 'fa-caret-up' : 'fa-caret-down']" class="sort-icon"></i>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="file in displayFiles" :key="file.id" :class="rowClass(file)">
            <td class="col-check">
              <input type="checkbox" :checked="file.checked" @change="toggleOne(file)">
            </td>
            <td class="col-name" :title="parseFilename(file.name).name">
              <div class="name-cell">
                <i :class="['fa-solid', getFileIcon(file.name), 'file-icon', getIconColor(file.name)]"></i>
                <span class="name-text">{{ parseFilename(file.name).name }}</span>
              </div>
            </td>
            <td class="col-new" :title="file.newName ? parseFilename(file.newName).name : ''">
              <span v-if="file.newName" class="new-name-text">{{ parseFilename(file.newName).name }}</span>
            </td>
            <td class="col-ext">{{ file.newName ? parseFilename(file.newName).ext : parseFilename(file.name).ext }}</td>
            <td class="col-status">
              <span :class="['status-tag', statusClass(file.status)]">
                {{ statusLabel(file.status) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 当前文件夹路径 -->
    <div v-if="store.currentFolder" class="path-bar">
      <span class="path-label">{{ t('fileTable.currentFolder') }}</span>
      <span class="path-value">{{ store.currentFolder }}</span>
    </div>
  </section>
</template>

<style scoped>
/** 文件列表面板容器 */
.file-table-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
/** 文件列表标题栏 */
.file-table-header {
  background: #2d3748;
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #4a5568;
  flex-shrink: 0;
}
/** 文件列表标题 */
.file-table-title {
  color: #fff;
  font-size: 15px;
  font-weight: 600;
}
/** 标题栏操作按钮组 */
.header-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}
/** 操作链接按钮 */
.action-link {
  background: none;
  border: none;
  color: #93c5fd;
  font-size: 12px;
  cursor: pointer;
  padding: 2px 8px;
  border-radius: 4px;
  font-family: inherit;
  transition: background 0.15s;
}
/** 操作链接按钮悬停态 */
.action-link:hover {
  background: rgba(147, 197, 253, 0.15);
}
/** 文件计数文字 */
.file-table-count {
  color: #9ca3af;
  font-size: 12px;
  margin-left: 8px;
}

/* ── States ── */
/** 状态遮罩层 */
.state-overlay {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  color: #9ca3af;
  gap: 12px;
  font-size: 14px;
}
/** 状态图标 */
.state-icon {
  font-size: 40px;
  color: #d1d5db;
}

/* ── Table ── */
/** 搜索栏 */
.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
}
/** 搜索图标 */
.search-icon {
  font-size: 13px;
  color: #9ca3af;
  flex-shrink: 0;
}
/** 搜索输入框 */
.search-input {
  flex: 1;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 13px;
  color: #111827;
  background: #fff;
  font-family: inherit;
  min-width: 0;
}
/** 搜索输入框聚焦态 */
.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59,130,246,0.15);
}
/** 搜索结果计数 */
.search-count {
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
  flex-shrink: 0;
}
/** 文件表格容器 */
.file-table-container {
  flex: 1;
  overflow: auto;
  background: #fff;
  position: relative;
}
/** 文件表格容器拖拽悬停态 */
.file-table-container.drag-over {
  border: 2px dashed #3b82f6;
  border-radius: 4px;
}
/** 拖拽释放遮罩层 */
.drop-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(59, 130, 246, 0.08);
  z-index: 5;
  gap: 8px;
  font-size: 16px;
  color: #3b82f6;
}
/** 拖拽释放图标 */
.drop-icon {
  font-size: 48px;
}

/** 文件表格 */
.file-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}
/** 文件表格表头（粘性定位） */
.file-table thead {
  position: sticky;
  top: 0;
  z-index: 2;
  background: #f9fafb;
}
/** 文件表格表头单元格 */
.file-table th {
  padding: 10px 16px;
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #d1d5db;
  border-right: 1px solid #e5e7eb;
}
/** 可排序表头 */
th.sortable {
  cursor: pointer;
  user-select: none;
}
/** 可排序表头悬停态 */
th.sortable:hover {
  color: #374151;
}
/** 表头内文字与图标之间的间隔 */
.sort-icon {
  margin-left: 6px;
  font-size: 11px;
  color: #3b82f6;
  float: right;
}
/** 文件表格表头最后一个单元格 */
.file-table th:last-child {
  border-right: none;
}
/** 文件表格数据单元格 */
.file-table td {
  padding: 10px 16px;
  font-size: 13px;
  border-bottom: 1px solid #f3f4f6;
  border-right: 1px solid #f3f4f6;
  color: #111827;
}
/** 文件表格数据最后一个单元格 */
.file-table td:last-child {
  border-right: none;
}

/* ── Column widths ── */
/** 复选框列 */
.col-check {
  width: 40px;
  text-align: center;
}
/** 扩展名列 */
.col-ext {
  width: 95px;
  color: #6b7280;
}
/** 状态列 */
.col-status {
  width: 110px;
  text-align: center;
}
/** 表头状态列 */
th.col-status {
  text-align: center;
}
/** 文件名列和新名列 */
.col-name,
.col-new {
  overflow: hidden;
}

/* ── File name truncation ── */
/** 文件名单元格内容 */
.name-cell {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}
/** 文件名文字截断 */
.col-name .name-text,
.col-new .new-name-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ── Row styles ── */
/** 勾选行高亮 */
.file-table tbody tr.row-checked {
  background: #eff6ff;
}
/** 系统文件行 */
.file-table tbody tr.row-system {
  color: #9ca3af;
}
/** 系统文件行文字 */
.file-table tbody tr.row-system .name-text {
  color: #9ca3af;
}

/* ── File icons ── */
/** 文件图标 */
.file-icon {
  flex-shrink: 0;
  font-size: 14px;
  color: #9ca3af;
}
/** 图片文件图标 */
.icon-image {
  color: #f59e0b;
}
/** 音频文件图标 */
.icon-audio {
  color: #8b5cf6;
}
/** 视频文件图标 */
.icon-video {
  color: #ef4444;
}
/** PDF 文件图标 */
.icon-pdf {
  color: #dc2626;
}
/** 代码文件图标 */
.icon-code {
  color: #22c55e;
}
/** 压缩包图标 */
.icon-archive {
  color: #6b7280;
}
/** 系统文件图标 */
.icon-dim {
  color: #d1d5db;
}

/* ── New name ── */
/** 新名列 */
.col-new {
  color: #3b82f6;
}

/* ── Status tags ── */
/** 状态标签 */
.status-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 500;
}
/** 原始状态标签 */
.tag-original {
  background: #f3f4f6;
  color: #6b7280;
}
/** 已修改状态标签 */
.tag-modified {
  background: #dbeafe;
  color: #1e40af;
}
/** 已重命名状态标签 */
.tag-renamed {
  background: #dcfce7;
  color: #166534;
}
/** 错误状态标签 */
.tag-error {
  background: #fee2e2;
  color: #991b1b;
}

/* ── Path bar ── */
/** 路径栏 */
.path-bar {
  background: #f9fafb;
  padding: 10px 16px;
  border-top: 1px solid #d1d5db;
  font-size: 13px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
/** 路径值文字 */
.path-bar .path-value {
  color: #111827;
  font-family: monospace;
  font-size: 13px;
  font-weight: 500;
  word-break: break-all;
  flex: 1;
  min-width: 0;
}
/** 路径标签 */
.path-label {
  flex-shrink: 0;
  font-weight: 500;
  color: #374151;
}
</style>
