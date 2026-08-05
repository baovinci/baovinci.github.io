# Bao Vinci — Simulation-Driven Mechanical Engineering Portfolio

> 仿真驱动机械工程 | 计算力学 · 机械设计 · 工程自动化

---

## 项目概述

Bao Vinci 个人工程作品集，面向国内外工程师招聘与学术申请。

- **定位**：Simulation-Driven Mechanical Engineering
- **核心方向**：Computational Mechanics + Mechanical Design + Engineering Automation
- **目标用户**：国内仿真/机械工程师招聘方、国外岗位制博士申请导师
- **技术栈**：纯静态 HTML/CSS/JS（零框架依赖，CSS 变量驱动主题）

---

## 文件结构

```
D:/ONE/
├── index.html                           # 主页
├── domain-computational-mechanics.html   # 领域页：计算力学
├── domain-mechanical-design.html         # 领域页：机械设计
├── domain-intelligent-engineering.html   # 领域页：工程自动化
├── project-template.html                # 项目详情页模板（新增项目时复制）
├── project-001-fea.html                 # 项目：弹塑性非线性 FEA
├── project-002-gripper.html             # 项目：自适应机器人抓爪
├── project-003-topology.html            # 项目：结构件拓扑优化
│
├── css/
│   ├── variables.css                    # CSS 变量（颜色/字号/间距/阴影）
│   ├── global.css                       # 全局样式（导航/布局/Footer）
│   ├── animation.css                    # 动画系统（fade/slide/缩放）
│   ├── components.css                   # 组件样式（卡片/标签/横向滚动行）
│   ├── homepage.css                     # 主页专属样式（Hero/领域/精选/能力/CTA）
│   ├── domain-page.css                  # 领域页专属样式
│   └── project-page.css                 # 项目详情页专属样式
│
├── js/
│   ├── main.js                          # 入口（初始化/事件绑定/导航滚动）
│   ├── navigation.js                    # 导航系统（toggle/滚动态/面包屑）
│   ├── animation.js                     # 滚动驱动动画（IntersectionObserver）
│   ├── project-loader.js                # 项目卡片渲染（从 projects.json 加载）
│   ├── viewer-manager.js                # 图片灯箱/媒体查看器
│   ├── three-model.js                   # Three.js 3D 模型展示（可选）
│   └── i18n.js                          # 中英文双语切换系统
│
├── data/
│   ├── projects.json                    # 项目数据（双语标题/简介/标签/路径）
│   └── i18n.json                        # 中英文翻译对照表
│
├── assets/
│   └── projects/
│       ├── 001-fea/                     # 项目资源（弹塑性 FEA）
│       │   ├── cover.jpg
│       │   ├── gallery/
│       │   └── documents/
│       ├── 002-gripper/                 # 项目资源（抓爪）
│       │   ├── cover.jpg
│       │   ├── gallery/
│       │   └── documents/
│       └── 003-topology/                # 项目资源（拓扑优化）
│           ├── cover.jpg
│           ├── gallery/
│           └── documents/
│
└── README.md                            # 本文件
```

---

## 主页结构

| 区块 | 说明 | 修改入口 |
|---|---|---|
| Hero | 标题 + 副标题 + CTA | `index.html` 第 63-77 行 |
| Domains | 三大专业支柱 | `index.html` 第 81-140 行，颜色在 `homepage.css` |
| Projects | 精选工程作品轮播 | `data/projects.json` 中 `"featured": true` 的项目 |
| Capabilities | 六大工程方法论卡片 | `index.html` 第 184-247 行 |
| Software & Languages | 横向滚动技术栈 | `index.html` 第 258-322 行 |
| CTA | 合作邀请 | `index.html` 第 327-332 行 |
| Footer | 版权 + 学术主页链接 | `index.html` 第 335-342 行 |

---

## 中英文切换系统

### 数据格式（v2 — 中英文紧邻）

从 v2 版本开始，翻译数据采用**中英文紧邻**格式：

```json
{
  "hero": {
    "subtitle": {
      "en": "Combining physics-based simulation...",
      "zh": "结合计算力学、机械设计与工程自动化..."
    }
  }
}
```

不再使用旧的分离式格式（前半部分全英文 + 后半部分全中文）。这样修改某一板块时，中英文就在同一处，一目了然。

### 修改翻译的标准流程

当你需要修改某个文本（例如 Hero 副标题）时，需要同时修改 **两个文件、三个位置**：

| 步骤 | 文件 | 操作 |
|------|------|------|
| 1 | `xxx.html` | 修改元素内的**英文默认文本**（作为降级后备） |
| 2 | `data/i18n.json` | 修改对应 key 下的 `"en"` 字段 |
| 3 | `data/i18n.json` | 修改同一 key 下的 `"zh"` 字段 |

> **为什么 HTML 默认文本也要改？**
> 页面初次加载时，`i18n.js` 尚未执行，此时显示的是 HTML 中的硬编码文本（英文）。
> 如果只改 JSON 不改 HTML，首次渲染会出现短暂的旧文本闪烁。
> 中文用户加载页面后 i18n.js 会立即替换为中文，所以中文默认文本影响较小，但保持三者一致是最佳实践。

### 修改示例

假设要修改 Hero 副标题：

**1. HTML（`index.html`）：**
```html
<p class="hero__subtitle" data-i18n="hero.subtitle">
  Combining physics-based simulation, mechanical design, and engineering
  automation to develop reliable solutions through numerical analysis,
  optimization, and digital workflows.
</p>
```

**2. i18n.json（同一个 key 下的 en 和 zh）：**
```json
"hero": {
  "subtitle": {
    "en": "Combining physics-based simulation...",
    "zh": "结合计算力学、机械设计与工程自动化..."
  }
}
```

### 翻译 key 命名规则

- `data-i18n` 属性值使用 `.` 分隔层级，如 `hero.subtitle` 对应 JSON 中 `hero.subtitle.en/zh`
- 项目详情页的 key 在 `data/project-pages-i18n.json` 中，格式为 `projectPages.fea.s01Title` 等
- 领域页的 key 在 `data/i18n.json` 中，路径为 `domainPages.computationalMechanics.title` 等

---

## 新增项目指南

### 步骤 1：准备资源

```
assets/projects/004-xxx/
├── cover.jpg          # 1920×1080 封面
├── hero.jpg           # 项目页主图
├── gallery/           # 正文配图
└── documents/         # 论文/报告
```

推荐格式：WebP（图片）、MP4/H.264（视频，<50MB）、GLB（3D 模型）

### 步骤 2：添加数据

在 `data/projects.json` 的 `projects` 数组中追加：

```json
{
  "id": "project-004",
  "title": "Your Project Title",
  "titleZh": "你的项目标题",
  "desc": "Brief description in English.",
  "descZh": "中文简介。",
  "image": "assets/projects/004-xxx/cover.jpg",
  "domain": "computational-mechanics",
  "tags": ["FEA", "Structural"],
  "tagsZh": ["有限元", "结构力学"],
  "tagsType": ["method", "domain"],
  "featured": true,
  "detailPage": "project-004-xxx.html"
}
```

### 步骤 3：创建详情页

1. 复制 `project-template.html` → `project-004-xxx.html`
2. 修改页面内容（标题、描述、各节文字、底部导航）
3. 在 `index.html` 的 nav 中不需要额外操作（导航固定为三大领域）

---

## 常见维护操作

| 操作 | 方法 |
|---|---|
| 修改 Hero 标题 | 编辑 `data/i18n.json` → `hero.title` (en/zh) |
| 增删软件工具 | 编辑 `index.html` 中 `.tools-row` 内的 `.tool-card` 块 |
| 替换软件图标 | 将 `.tool-card__icon` 中文字替换为 `<svg>...</svg>` |
| 调整卡片列数 | 编辑 `homepage.css`（Domains grid）或 `components.css`（Tools row）|
| 修改主题色 | 编辑 `css/variables.css` 中的 CSS 变量 |
| 添加新领域 | 需创建领域页 HTML + 更新导航 + 更新 i18n.json |
| 修改 CTA 文案 | 编辑 `data/i18n.json` → `cta.*` |
| 更换 Footer 链接 | 编辑各 HTML 文件 Footer 中的 `<a>` 标签 href |

---

## 页面关系

```
index.html （主页）
  ├── domain-computational-mechanics.html
  │     └── project-001-fea.html
  ├── domain-mechanical-design.html
  │     └── project-002-gripper.html
  └── domain-intelligent-engineering.html
        └── project-003-topology.html
```

---

## 安全与发布注意事项

1. **切勿上传**：身份证明、未发表研究数据、公司资料、`.env` 文件
2. **发布前检查**：所有图片路径、个人信息残留、隐私文档
3. **推荐部署**：[GitHub Pages](https://pages.github.com/) / [Cloudflare Pages](https://pages.cloudflare.com/)
4. **配置文件**：本项目不使用任何配置文件（`.env`/`config.json`），数据均在 `data/` 目录

---

## 技术特点

- **零框架依赖**：纯 HTML/CSS/JavaScript，无 npm/node_modules
- **CSS 变量体系**：颜色、字号、间距、阴影全部通过 CSS 变量集中控制
- **数据驱动**：项目卡片由 `projects.json` 渲染，新增项目无需修改 HTML
- **双语系统**：`data-i18n.json` + `data-i18n` 属性标记，手动翻译确保质量
- **响应式**：大屏 Grid 三列，中屏横向滚动两列，小屏滚动单列
- **Apple 极简风格**：大量留白、清晰排版、低饱和度配色
