<div align="center">
  <img alt="logo" width="120" height="120" src="./public/favicon.png">
  <h1>SpeakFlow - 实时语音识别</h1>
</div>

[![github release](https://img.shields.io/github/v/release/un-pany/mobvue?style=flat)](https://github.com/un-pany/mobvue/releases)
[![github stars](https://img.shields.io/github/stars/un-pany/mobvue?style=flat)](https://github.com/un-pany/mobvue/stargazers)
[![gitee stars](https://gitee.com/un-pany/mobvue/badge/star.svg)](https://gitee.com/un-pany/mobvue/stargazers)

<b><a href="./README.md">English</a> | 中文</b>

## 简介

SpeakFlow 是一款功能强大的实时语音识别应用，基于 Vue 3、TypeScript 和 Vant 构建。它能够准确地将语音转换为文字，并支持多种语言和离线模式。

## 核心功能

- **实时语音识别** - 即时将语音转换为文本
- **多语言支持** - 支持中文、英文等多种语言的转写
- **多种识别服务** - 支持科大讯飞实时语音转写和语音听写服务
- **复制与清除功能** - 轻松管理和分享您的转写内容
- **精美界面** - 现代玻璃态设计与流畅动画
- **响应式设计** - 在移动设备和桌面设备上均可无缝运行

## 技术亮点

- 使用 Vue 3 组合式 API 进行状态管理
- 集成 WebSocket 实现实时数据流
- 使用 Web Audio API 处理音频
- 语音活动检测提高识别精度
- 多服务支持，轻松切换不同提供商

## 使用

<details>
<summary>推荐环境</summary>

<br>

- 新版 `Visual Studio Code`
- 安装 `.vscode/extensions.json` 文件中推荐的插件
- `node` 20.x 或 22+
- `pnpm` 9.x 或 10+

</details>

<details>
<summary>本地开发</summary>

<br>

```bash
# 安装依赖
pnpm i

# 启动服务
pnpm dev
```

</details>

<details>
<summary>打包构建</summary>

<br>

```bash
# 打包构建预发布环境
pnpm build:staging

# 打包构建生产环境
pnpm build
```

</details>

<details>
<summary>本地预览</summary>

<br>

```bash
# 先执行打包构建命令生成 dist 目录后再执行以下预览命令
pnpm preview
```

</details>

<details>
<summary>代码检查</summary>

<br>

```bash
# 代码校验与格式化
pnpm lint

# 单元测试
pnpm test
```

</details>

<details>
<summary>代码提交规范</summary>

<br>

`feat` 新功能

`fix` 修复错误

`perf` 性能优化

`refactor` 重构代码

`docs` 文档和注释

`types` 类型相关

`test` 单测相关

`ci` 持续集成、工作流

`revert` 撤销更改

`chore` 琐事（更新依赖、修改配置等）

</details>

## 链接

**在线预览**：[github-pages](https://un-pany.github.io/mobvue)

**文档教程**：[链接](https://juejin.cn/column/7472609448201666599)

**国内仓库**：[gitee](https://gitee.com/un-pany/mobvue)

**交流群**：[查看进群方式](https://github.com/un-pany/mobvue/issues/3)

**捐赠**：[请作者喝咖啡](https://github.com/un-pany/mobvue/issues/1)

**发行版 & 更新日志**：[releases](https://github.com/un-pany/mobvue/releases)

## 技术栈

**Vue3**：采用 Vue3 + script setup 最新的 Vue3 组合式 API

**Vant**：轻量、可定制的移动端 Vue 组件库

**Pinia**: 传说中的 Vuex5

**Vite**：真的很快

**Vue Router**：路由路由

**TypeScript**：JavaScript 语言的超集

**Socket.io**：用于与语音识别服务器进行实时通信

**Web Audio API**：用于捕获和处理音频输入

**pnpm**：更快速的，节省磁盘空间的包管理工具

**UnoCSS**：具有高性能且极具灵活性的即时原子化 CSS 引擎

## 项目预览图

![preview](./src/common/assets/images/preview.png)

## License

[MIT](./LICENSE) License © 2025-PRESENT [pany](https://github.com/pany-ang)
