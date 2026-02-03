# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个 CSS 到 UnoCSS 转换工具的 Web 应用，基于 Vue 3 + Vite + UnoCSS 构建。核心功能是将传统 CSS 样式代码转换为 UnoCSS 原子化类名，并支持去除 px 或 rpx 单位。

## 常用命令

```bash
# 安装依赖
pnpm install

# 启动开发服务器（端口 8088）
pnpm dev

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview
```

## 核心架构

### 技术栈
- **Vue 3.6.0-alpha.1** - 使用 Vapor 模式（`<script setup vapor>`）
- **Vite 7** - 构建工具
- **UnoCSS 66.3.3** - CSS 原子化引擎
- **TypeScript** - 类型支持

### 项目结构

```
src/
├── App.vue           # 主应用组件，包含转换器 UI
├── main.ts           # 应用入口
├── style.css         # 全局样式
└── utils/
    ├── index.js      # CSS 转 UnoCSS 核心转换逻辑（约 1800 行）
    └── index.d.ts    # TypeScript 类型定义
```

### 核心转换逻辑

`src/utils/index.js` 包含完整的 CSS 到 UnoCSS 转换引擎：

- **主函数**: `toUnocssClass(css, isRem, debug, isRemoveRpx, isRemovePx)`
  - `css`: 输入的 CSS 字符串
  - `isRem`: 是否转换为 rem 单位
  - `debug`: 是否开启调试日志
  - `isRemoveRpx`: 是否去除 rpx 单位
  - `isRemovePx`: 是否去除 px 单位
  - 返回: `[转换后的类名字符串, 未转换的样式数组]`

- **转换流程**:
  1. `transformStyleToUnocssPre()` - 预处理特殊样式组合（如 truncate、line-clamp）
  2. `toUnocss()` - 逐个 CSS 属性转换为 UnoCSS 类名
  3. 单位处理 - 根据配置去除 px 或 rpx

- **支持的 CSS 属性**: 包含 60+ 种 CSS 属性转换器，涵盖布局、颜色、动画、变换等

### 应用组件 (App.vue)

- **状态管理**:
  - `inputText`: CSS 输入
  - `outputText`: UnoCSS 输出
  - `removeUnit`: 单位选择（'px' 或 'rpx'）
  - `copied`: 复制状态提示
  - `isFirstLoad`: 首次加载标志（防止自动复制）

- **核心功能**:
  - 实时转换：输入变化时自动调用 `toUnocssClass()`
  - 自动复制：转换后自动复制到剪贴板（首次加载除外）
  - 单位配置：支持去除 px 或 rpx 单位

### UnoCSS 配置

`uno.config.ts` 定义了自定义主题色：
- slate 系列（50, 200, 300, 500, 600, 700, 900）
- blue 系列（500, 600）
- green 系列（600）

## 开发注意事项

1. **Vapor 模式**: 组件使用 `<script setup vapor>` 语法，这是 Vue 3 的实验性编译模式
2. **核心逻辑不可修改**: `src/utils/index.js` 是从 [transform-to-unocss-core](https://github.com/Simon-He95/transform-to-unocss-core) 移植的核心转换引擎，修改时需谨慎
3. **开发端口**: Vite 开发服务器配置为 8088 端口
4. **类型定义**: 如需修改 utils 函数签名，同步更新 `src/utils/index.d.ts`

## 项目来源

本项目基于 [Simon-He95/transform-to-unocss-core](https://github.com/Simon-He95/transform-to-unocss-core) 的 CSS 转换核心库。
