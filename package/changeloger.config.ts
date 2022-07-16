import { resolve } from 'path';
import { getDefaultGitRepo } from './utils/git';

export interface MarkdownTheme {
  name: 'default' | 'simple' | 'custom';
  types: Record<string, { title: string }>;
}
export interface ChangelogConfig extends Record<string, any> {
  theme: MarkdownTheme;
  output: string;
  shouAuthor: boolean;
  showNotMatchComiit: boolean;
  scopeMap: Record<string, string>;
  repository?: string;
  include?: string[];
  exclude?: string[];
}

const theme: Record<string, MarkdownTheme> = {
  default: {
    name: 'default',
    types: {
      feat: { title: '✨ Features | 新功能' },
      perf: { title: '⚡ Performance Improvements | 性能优化' },
      fix: { title: '🐛 Bug Fixes | Bug 修复' },
      refactor: { title: '♻ Code Refactoring | 代码重构' },
      docs: { title: '📝 Documentation | 文档' },
      chore: { title: '🎫 Chores | 变更构建流程或辅助工具' },
      build: { title: '👷‍ Build System | 构建' },
      test: { title: '✅ Tests | 测试' },
      types: { title: '🌊 Types | 类型' },
      style: { title: '💄 Styles | 风格' },
      reverts: { title: '⏪ Reverts | 回退' },
      deps: { title: '🥦 Dependencies | 升级依赖' },
      ci: { title: '🔧 Continuous Integration | CI 配置' },
      other: { title: '👏 Other | 其他更新' },
    },
  },
};

export const ConfigDefaults: ChangelogConfig = {
  theme: {
    name: 'default',
    types: theme.default.types,
  },
  shouAuthor: true,
  showNotMatchComiit: true,
  output: 'CHANGELOG.md',
  scopeMap: {},
};

export async function loadChangelogConfig(): Promise<ChangelogConfig> {
  const test = await import(
    resolve(process.cwd(), 'changeloger.config.js')
  ).catch(() => {});
  const config = Object.assign(ConfigDefaults, test);
  if (!config.repository) config.repository = await getDefaultGitRepo();
  return config;
}
