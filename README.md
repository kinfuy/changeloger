<p align="center">
  <img width="100px" src="./assets/logo.svg">
</p>

<p align="center">
  <a href="https://www.npmjs.org/package/changeloger">
  <img src="https://img.shields.io/npm/v/changeloger.svg">
  </a>
  <a href="https://npmcharts.com/compare/changeloger?minimal=true">
  <img src="https://img.shields.io/npm/dm/changeloger.svg?color=357C3C">
  </a>
  <a href="https://npmcharts.com/compare/changeloger?minimal=true">
  <img src="https://img.shields.io/npm/l/changeloger.svg?color=blue">
  </a>
   <a href="https://github.com/alqmc/changeloger" target="__blank"><img alt="GitHub stars" src="https://img.shields.io/github/stars/alqmc/changeloger?style=social">
  
  </a>

  <br>
</p>

<p align="center"> changeloger</p>

> 自由、简单，漂亮、高度个性化的版本变更日志

### Features

- 一键生成 CHANGELOG.md

- 基于 Commits log 生成

- 自定义过滤规则，过滤无效 log

- 丰富的日志模板，支持自定义

- monorepo 支持

### Getting Started

```
pnpm add changeloger -g
```

### Usage

- 在项目中只需要按照依赖，添加 script 命令即可

```json
{
  "log": "changeloger"
}
```

- 全局使用,git 项目中 在 shell 工具中执行 changeloger 即可

- 支持配置文件,详细参考[changeloger.config.js](./changeloger.config.js)

```js
module.exports = {
  theme: 'default',
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
  showContributors: false,
  showNotMatchComiit: true,
};
```

## 支持主题

### defalut 主题

![defalut 主题](/assets/defalut.png)

### simple 主题

![defalut 主题](/assets/simple.png)

### Thanks [changelogen](https://github.com/unjs/changelogen) !!!

### License

MIT License © 2021 [阿乐去买菜（alqmc）](https://github.com/alqmc)
