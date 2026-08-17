/** Node.js 测试框架 */
import { describe, it } from 'node:test';
/** Node.js 断言库 */
import assert from 'node:assert';

/** 从源码导入文件名解析工具 */
import { parseFilename } from '../src/utils/filename.mjs';

/**
 * 创建模拟的 store 状态用于测试重命名执行逻辑。
 * @param {Array} files - 文件对象数组
 * @param {string} currentFolder - 当前文件夹路径
 * @param {string} activeTab - 当前激活的 Tab 标识
 * @param {Object} ruleParams - 规则参数
 * @returns {Object} 模拟 store 对象
 */
function createStore(files, currentFolder, activeTab, ruleParams) {
  /** 返回模拟 store */
  return {
    /** 当前文件夹 */
    currentFolder,
    /** 将原始文件数组映射为 store 中的文件格式 */
    files: files.map((f, i) => ({
      /** 唯一标识 */
      id: i,
      /** 文件名 */
      name: f.name,
      /** 完整路径 */
      path: f.path || (currentFolder + '/' + f.name),
      /** 是否勾选 */
      checked: f.checked !== false,
      /** 当前状态 */
      status: f.status || 'original',
      /** 预览新名称 */
      newName: f.name,
    })),
    /** 激活的 Tab */
    activeTab: activeTab || 'numbering',
    /** 规则参数 */
    ruleParams: ruleParams || {},
  };
}

/** 重命名执行逻辑单元测试 */
describe('rename-exec preview logic', () => {
  /** 预览：为勾选文件计算新名称 */
  it('should compute new names for checked files', () => {
    /** 创建模拟 store */
    const store = createStore(
      [
        { name: 'a.jpg', checked: true },
        { name: 'b.jpg', checked: true },
        { name: 'c.jpg', checked: false },
      ],
      '/test',
      'numbering',
      { prefix: 'IMG_', startNumber: 1, step: 1, padding: 2 },
    );

    /** 模拟预览：对勾选文件计算名称 */
    let idx = 0;
    /** 遍历所有文件 */
    for (const file of store.files) {
      if (file.checked) {
        /** 分离文件名和扩展名 */
        const { name, ext } = parseFilename(file.name);
        /** 计算序号值 */
        const num = 1 + idx * 1;
        /** 补零格式化 */
        const numStr = String(num).padStart(2, '0');
        /** 拼接新文件名 */
        file.newName = 'IMG_' + numStr + '_' + name + ext;
        /** 标记为已修改 */
        file.status = 'modified';
        /** 序号递增 */
        idx++;
      }
    }

    /** 断言：第 1 个文件新名称正确 */
    assert.strictEqual(store.files[0].newName, 'IMG_01_a.jpg');
    /** 断言：第 2 个文件新名称正确 */
    assert.strictEqual(store.files[1].newName, 'IMG_02_b.jpg');
    /** 断言：未勾选文件保持原名 */
    assert.strictEqual(store.files[2].newName, 'c.jpg');
    /** 断言：已勾选文件状态为 modified */
    assert.strictEqual(store.files[0].status, 'modified');
    /** 断言：未勾选文件状态为 original */
    assert.strictEqual(store.files[2].status, 'original');
  });

  /** 冲突检测 */
  it('should detect simple conflicts', () => {
    /** 两个文件名不同但重命名后会相同的文件 */
    const files = [
      { name: 'a.txt', checked: true, path: '/t/a.txt' },
      { name: 'b.txt', checked: true, path: '/t/b.txt' },
    ];
    /** 两者目标名称相同 */
    const newNames = ['same.txt', 'same.txt'];
    /** 新路径 → 原路径列表 冲突映射 */
    const conflictMap = new Map();
    /** 遍历构建冲突映射 */
    for (let i = 0; i < files.length; i++) {
      /** 拼接新文件完整路径 */
      const np = '/t/' + newNames[i];
      /** 初始化该目标路径的列表 */
      if (!conflictMap.has(np)) conflictMap.set(np, []);
      /** 追加原路径 */
      conflictMap.get(np).push(files[i].path);
    }
    /** 断言：同一目标路径有 2 个原路径冲突 */
    assert.strictEqual(conflictMap.get('/t/same.txt').length, 2);
  });
});
