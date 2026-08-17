/** Node.js 测试框架 */
import { describe, it } from 'node:test';
/** Node.js 断言库 */
import assert from 'node:assert';

/** 从源码导入日期规则函数 */
import { dateRule } from '../src/utils/rules.mjs';

/** 日期规则单元测试 */
describe('date apply', () => {
  /** 测试文件对象 */
  const file = {
    name: 'report.pdf',
    createdAt: new Date('2026-05-22T14:30:00').getTime(),
    modifiedAt: new Date('2026-05-22T14:30:00').getTime(),
  };

  /** 替换模式：日期作为文件名 */
  it('should format date as filename (replace mode)', () => {
    /** 应用日期规则 */
    const r = dateRule(file, { dateFormat: 'yyyy-MM-dd_HHmm', naming: 'replace' });
    /** 断言：文件名被替换为日期格式 */
    assert.strictEqual(r, '2026-05-22_1430.pdf');
  });

  /** 前缀模式：日期加在原文件名前 */
  it('should format as prefix', () => {
    /** 应用日期规则 */
    const r = dateRule(file, { dateFormat: 'yMMdd', naming: 'prefix' });
    /** 断言：日期作为前缀 */
    assert.strictEqual(r, '20260522_report.pdf');
  });

  /** 后缀模式：日期加在原文件名后 */
  it('should format as suffix', () => {
    /** 应用日期规则 */
    const r = dateRule(file, { dateFormat: 'yyyy-MM-dd_HHmm', naming: 'suffix' });
    /** 断言：日期作为后缀 */
    assert.strictEqual(r, 'report_2026-05-22_1430.pdf');
  });

  /** 包含时间秒的格式 */
  it('should use custom format with time', () => {
    /** 应用日期规则 */
    const r = dateRule(file, { dateFormat: 'yMMdd_HHmmss', naming: 'replace' });
    /** 断言：日期含时分秒 */
    assert.strictEqual(r, '20260522_143000.pdf');
  });

  /** 使用创建日期作为来源 */
  it('should use created date source', () => {
    /** 仅设置创建日期的文件对象 */
    const f = { name: 'doc.txt', createdAt: new Date('2025-01-15').getTime(), modifiedAt: 0 };
    /** 应用日期规则 */
    const r = dateRule(f, { dateSource: 'created', dateFormat: 'y-MM-dd', naming: 'replace' });
    /** 断言：使用创建日期 */
    assert.strictEqual(r, '2025-01-15.txt');
  });
});
