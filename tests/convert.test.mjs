/** Node.js 测试框架 */
import { describe, it } from 'node:test';
/** Node.js 断言库 */
import assert from 'node:assert';

/** 从源码导入转换规则函数 */
import { convert } from '../src/utils/rules.mjs';

/** 转换规则单元测试 */
describe('convert apply', () => {
  /** 转大写 */
  it('should convert to upper case', () => {
    /** 应用规则 */
    const r = convert({ name: 'My File.txt' }, { mode: 'upper' });
    /** 断言：全部大写 */
    assert.strictEqual(r, 'MY FILE.txt');
  });

  /** 转小写 */
  it('should convert to lower case', () => {
    /** 应用规则 */
    const r = convert({ name: 'My File.txt' }, { mode: 'lower' });
    /** 断言：全部小写 */
    assert.strictEqual(r, 'my file.txt');
  });

  /** 首字母大写 */
  it('should convert to title case', () => {
    /** 应用规则 */
    const r = convert({ name: 'my file.txt' }, { mode: 'title' });
    /** 断言：首字母大写 */
    assert.strictEqual(r, 'My File.txt');
  });
});
