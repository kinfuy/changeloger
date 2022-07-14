import { resolve } from 'path';
import { getCurrentGitRef, getLastGitTag } from './utils/git';
import { deepMerge } from './utils/deepMerge';

export interface MarkdownTheme {
  name: 'default' | 'colorful' | 'custom';
}
export interface ChangelogConfig extends Record<string, any> {
  types?: Record<string, { title: string }>;
  scopeMap?: Record<string, string>;
  from?: string;
  to?: string;
  theme?: MarkdownTheme;
  include?: string[];
  exclude?: string[];
}

export const ConfigDefaults: ChangelogConfig = {
  types: {
    feat: { title: '✨ Features | 新功能' },
    perf: { title: '⚡ Performance Improvements | 性能优化' },
    fix: { title: '🐛 Bug Fixes | Bug 修复' },
    refactor: { title: '♻ Code Refactoring | 代码重构' },
    examples: { title: '🏀 Examples' },
    docs: { title: '📝 Documentation | 文档' },
    chore: { title: '🎫 Chores | 其他更新' },
    build: { title: '👷‍ Build System | 构建' },
    test: { title: '✅ Tests | 测试' },
    types: { title: '🌊 Types | 类型' },
    style: { title: '💄 Styles | 风格' },
    ci: { title: '🔧 Continuous Integration | CI 配置' },
    reverts: { title: '⏪ Reverts | 回退' },
  },
  from: '',
  to: '',
  scopeMap: {},
};

export async function loadChangelogConfig(): Promise<ChangelogConfig> {
  const test = await import(
    resolve(process.cwd(), 'changeloger.config.js')
  ).catch(() => {});
  const config = test ? deepMerge(ConfigDefaults, test) : ConfigDefaults;

  if (!config.from) {
    config.from = await getLastGitTag();
  }

  if (!config.to) {
    config.to = await getCurrentGitRef();
  }
  return config;
}
