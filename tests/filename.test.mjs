/** Node.js 测试框架 */
import { describe, it } from 'node:test';
/** Node.js 断言库 */
import assert from 'node:assert';

/** 从源码导入文件名工具函数 */
import { parseFilename, joinFilename } from '../src/utils/filename.mjs';

/** parseFilename 单元测试 */
describe('parseFilename', () => {
  /** 普通文件名拆分 */
  it('should split normal filename', () => {
    /** 断言：file.txt → name=file, ext=.txt */
    assert.deepStrictEqual(parseFilename('file.txt'), { name: 'file', ext: '.txt' });
  });

  /** 多扩展名取最后一个 */
  it('should handle multiple dots', () => {
    /** 断言：archive.tar.gz → name=archive.tar, ext=.gz */
    assert.deepStrictEqual(parseFilename('archive.tar.gz'), { name: 'archive.tar', ext: '.gz' });
  });

  /** 无扩展名文件 */
  it('should handle no extension', () => {
    /** 断言：Makefile → name=Makefile, ext='' */
    assert.deepStrictEqual(parseFilename('Makefile'), { name: 'Makefile', ext: '' });
  });

  /** 隐藏文件视为无扩展名 */
  it('should handle hidden files (starting with dot)', () => {
    /** 断言：.gitignore → name=.gitignore, ext='' */
    assert.deepStrictEqual(parseFilename('.gitignore'), { name: '.gitignore', ext: '' });
  });

  /** 仅扩展名的隐藏文件 */
  it('should handle file with only extension', () => {
    /** 断言：.env → name=.env, ext='' */
    assert.deepStrictEqual(parseFilename('.env'), { name: '.env', ext: '' });
  });
});

/** joinFilename 单元测试 */
describe('joinFilename', () => {
  /** 标准拼接 */
  it('should join name and extension', () => {
    /** 断言：file + .txt → file.txt */
    assert.strictEqual(joinFilename('file', '.txt'), 'file.txt');
  });

  /** 扩展名自动补点 */
  it('should add dot if extension missing it', () => {
    /** 断言：file + txt → file.txt */
    assert.strictEqual(joinFilename('file', 'txt'), 'file.txt');
  });

  /** 空扩展名返回原名 */
  it('should handle empty extension', () => {
    /** 断言：file + '' → file */
    assert.strictEqual(joinFilename('file', ''), 'file');
  });
});
