/** Node.js 测试框架 */
import { describe, it } from 'node:test';
/** Node.js 断言库 */
import assert from 'node:assert';

/** 从源码导入修改规则函数 */
import { modify } from '../src/utils/rules.mjs';

/** 修改规则单元测试 */
describe('modify apply', () => {
  /** 测试文件对象 */
  const file = { name: 'report.pdf' };

  /** 文件名前添加文字 */
  it('should prepend text', () => {
    /** 应用规则 */
    const r = modify(file, { prependText: 'v2_' });
    /** 断言：前缀已添加 */
    assert.strictEqual(r, 'v2_report.pdf');
  });

  /** 文件名后添加文字 */
  it('should append text', () => {
    /** 应用规则 */
    const r = modify(file, { appendText: '_final' });
    /** 断言：后缀已添加 */
    assert.strictEqual(r, 'report_final.pdf');
  });

  /** 同时添加前后缀 */
  it('should do both prepend and append', () => {
    /** 应用规则 */
    const r = modify(file, { prependText: '[', appendText: ']' });
    /** 断言：前后均添加 */
    assert.strictEqual(r, '[report].pdf');
  });

  /** 指定位置插入 */
  it('should insert at position', () => {
    /** 应用规则 */
    const r = modify(file, { insertText: '_v2', insertPosition: 3 });
    /** 断言：在第 3 个字符后插入（值为 1-index） */
    assert.strictEqual(r, 'rep_v2ort.pdf');
  });
});
