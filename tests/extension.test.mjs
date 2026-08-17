/** Node.js 测试框架 */
import { describe, it } from 'node:test';
/** Node.js 断言库 */
import assert from 'node:assert';

/** 从源码导入扩展名规则函数 */
import { extension } from '../src/utils/rules.mjs';

/** 扩展名规则单元测试 */
describe('extension apply', () => {
  /** 更改为指定扩展名 */
  it('should change extension', () => {
    /** 应用规则 */
    const r = extension({ name: 'photo.jpg' }, { mode: 'change', newExtension: 'png' });
    /** 断言：扩展名已更改 */
    assert.strictEqual(r, 'photo.png');
  });

  /** 新扩展名带点号处理 */
  it('should handle extension with dot', () => {
    /** 应用规则 */
    const r = extension({ name: 'photo.jpg' }, { mode: 'change', newExtension: '.png' });
    /** 断言：不重复点号 */
    assert.strictEqual(r, 'photo.png');
  });

  /** 扩展名转大写 */
  it('should uppercase extension', () => {
    /** 应用规则 */
    const r = extension({ name: 'photo.jpg' }, { mode: 'upper' });
    /** 断言：扩展名大写 */
    assert.strictEqual(r, 'photo.JPG');
  });

  /** 扩展名转小写 */
  it('should lowercase extension', () => {
    /** 应用规则 */
    const r = extension({ name: 'photo.JPG' }, { mode: 'lower' });
    /** 断言：扩展名小写 */
    assert.strictEqual(r, 'photo.jpg');
  });

  /** 删除扩展名 */
  it('should remove extension', () => {
    /** 应用规则 */
    const r = extension({ name: 'photo.jpg' }, { mode: 'remove' });
    /** 断言：无扩展名 */
    assert.strictEqual(r, 'photo');
  });
});
