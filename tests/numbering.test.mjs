/** Node.js 测试框架 */
import { describe, it } from 'node:test';
/** Node.js 断言库 */
import assert from 'node:assert';

/** 从源码导入序号规则函数 */
import { numbering } from '../src/utils/rules.mjs';

/** 序号规则单元测试 */
describe('numbering apply', () => {
  /** 测试文件对象 */
  const file = { name: 'photo.jpg' };

  /** 基础序号前缀 */
  it('should add numbered prefix', () => {
    /** 应用规则 */
    const result = numbering(file, { prefix: 'IMG_', startNumber: 1, step: 1, padding: 0 }, 0);
    /** 断言：序号前缀正确 */
    assert.strictEqual(result, 'IMG_1photo.jpg');
  });

  /** 带后缀的序号 */
  it('should include suffix', () => {
    /** 应用规则 */
    const result = numbering(file, { prefix: 'IMG_', suffix: '_v2', startNumber: 1, step: 1, padding: 0 }, 0);
    /** 断言：含前后缀 */
    assert.strictEqual(result, 'IMG_1_v2photo.jpg');
  });

  /** 补零 */
  it('should pad with zeros', () => {
    /** 应用规则 */
    const result = numbering(file, { prefix: 'IMG_', startNumber: 1, step: 1, padding: 3 }, 0);
    /** 断言：3 位补零 */
    assert.strictEqual(result, 'IMG_001photo.jpg');
  });

  /** 自定义步长 */
  it('should increment by step', () => {
    /** 应用规则 */
    const r1 = numbering(file, { prefix: '', startNumber: 10, step: 5, padding: 0 }, 1);
    /** 断言：10 + 1*5 = 15 */
    assert.strictEqual(r1, '15photo.jpg');
  });

  /** 序号放在文件名后 */
  it('should support suffix position', () => {
    /** 应用规则 */
    const result = numbering(file, { prefix: '', startNumber: 1, step: 1, padding: 0, position: 'suffix' }, 0);
    /** 断言：序号在文件名后 */
    assert.strictEqual(result, 'photo1.jpg');
  });

  /** 倒序模式 */
  it('should reverse order', () => {
    /** 3 个文件，index 0 → 序号 3 */
    const r = numbering(file, { prefix: '', startNumber: 1, step: 1, padding: 0, reverse: true, _totalCount: 3 }, 0);
    /** 断言：倒序第 0 个文件序号为 3 */
    assert.strictEqual(r, '3photo.jpg');
  });
});
