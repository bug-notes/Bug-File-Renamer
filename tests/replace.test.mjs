/** Node.js 测试框架 */
import { describe, it } from 'node:test';
/** Node.js 断言库 */
import assert from 'node:assert';

/** 从源码导入替换规则函数 */
import { replace } from '../src/utils/rules.mjs';

/** 替换规则单元测试 */
describe('replace apply', () => {
  /** 测试文件对象 */
  const file = { name: 'Report_old_Final.pdf' };

  /** 普通文本替换 */
  it('should replace text', () => {
    /** 应用规则 */
    const r = replace(file, { search: 'old', replacement: 'new' });
    /** 断言：old 被替换为 new */
    assert.strictEqual(r, 'Report_new_Final.pdf');
  });

  /** 显式设置 caseSensitive=false 时不区分大小写 */
  it('should be case-insensitive when explicitly set', () => {
    /** 应用规则 */
    const r = replace(file, { search: 'REPORT', replacement: 'Summary', caseSensitive: false });
    /** 断言：大小写不敏感匹配成功 */
    assert.strictEqual(r, 'Summary_old_Final.pdf');
  });

  /** 区分大小写模式 */
  it('should respect caseSensitive', () => {
    /** 应用规则 */
    const r = replace(file, { search: 'Report', replacement: 'Summary', caseSensitive: true });
    /** 断言：大小写敏感匹配成功 */
    assert.strictEqual(r, 'Summary_old_Final.pdf');
  });

  /** 仅替换第一个匹配 */
  it('should replace only first match when replaceAll is false', () => {
    /** 含多个下划线的文件名 */
    const f = { name: 'a_a_a.txt' };
    /** 应用规则 */
    const r = replace(f, { search: '_', replacement: '-', replaceAll: false });
    /** 断言：仅第一个下划线被替换 */
    assert.strictEqual(r, 'a-a_a.txt');
  });

  /** 正则表达式替换 */
  it('should support regex', () => {
    /** 含数字的文件名 */
    const f = { name: 'img_001.jpg' };
    /** 应用规则 */
    const r = replace(f, { search: '\\d+', replacement: 'XXX', useRegex: true });
    /** 断言：数字被正则匹配替换 */
    assert.strictEqual(r, 'img_XXX.jpg');
  });
});
