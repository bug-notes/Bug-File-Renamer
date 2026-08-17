/** Node.js 测试框架 */
import { describe, it } from 'node:test';
/** Node.js 断言库 */
import assert from 'node:assert';

/** 从源码导入删除规则函数 */
import { deleteRule } from '../src/utils/rules.mjs';

/** 删除规则单元测试 */
describe('delete apply', () => {
  /** 删除指定文字 */
  it('should delete specified text', () => {
    /** 应用规则 */
    const r = deleteRule({ name: 'file_old_v1.txt' }, { deleteText: '_old' });
    /** 断言：_old 被删除 */
    assert.strictEqual(r, 'file_v1.txt');
  });

  /** 定位删除一定范围 */
  it('should delete range', () => {
    /** 应用规则 */
    const r = deleteRule({ name: 'abcdef.txt' }, { deleteStart: 2, deleteCount: 3 });
    /** 断言：bcd 被删除 */
    assert.strictEqual(r, 'aef.txt');
  });

  /** 从末尾删除 */
  it('should delete from end', () => {
    /** 应用规则 */
    const r = deleteRule({ name: 'abcdef.txt' }, { deleteFromEnd: 3 });
    /** 断言：末尾 3 字符被删除 */
    assert.strictEqual(r, 'abc.txt');
  });
});
