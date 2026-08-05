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
│   ├── i18n.json                        # 主页 + 领域页 + 公共元素的中英文翻译
│   ├── projects.json                    # 项目卡片数据（双语标题/简介/标签/封面）
│   └── project-pages-i18n.json          # 项目详情页的中英文翻译
│
├── assets/
│   ├── 001-fea/                         # 项目素材（弹塑性 FEA）
│   ├── 002-gripper/                     # 项目素材（抓爪）
│   └── 003-topology/                    # 项目素材（拓扑优化）
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

所有翻译 JSON 采用固定格式：每个叶子节点的 `en` 和 `zh` 值紧邻排列，便于对照修改。

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

### 修改流程速查

| 你改什么内容 | 修改哪个 HTML | 修改哪个 JSON |
|---|---|---|
| 主页内容 | `index.html` | `data/i18n.json` |
| 领域页描述 | `domain-xxx.html` | `data/i18n.json` |
| 项目卡片标题/简介 | 不需要改 HTML | `data/projects.json` |
| 项目详情页正文 | `project-xxx.html` | `data/project-pages-i18n.json` |
| 导航栏/Footer 等公共文字 | 每个带 nav/footer 的 HTML | `data/i18n.json` |

### 为什么 HTML 和 JSON 都要改

页面初次加载时 `i18n.js` 尚未执行，显示的是 HTML 硬编码文本（英文降级）。JSON 只在 JS 执行后的中英文切换时生效。为保证首次加载无闪烁，两者必须同步。

---

## 项目素材规范

每个项目在 `assets/<项目编号>/` 下只需一个文件夹，所有素材直接丢进去即可（不允许再建子文件夹）。

### 文件命名与含义

| 文件名 | 用途 | 尺寸/格式建议 | 引用位置 |
|---|---|---|---|
| `cover.jpg` | 项目卡片缩略图（主页、领域页都用到） | 1920×1080, ≤500KB | `data/projects.json` → `image` |
| `hero.jpg` | 项目详情页顶部横幅大图 | 1920×800, ≤800KB | `project-xxx.html` → `.project-hero__banner` |
| `mesh.jpg` 等 | 详情页正文配图，按内容自由命名 | 1200×800, ≤300KB | `project-xxx.html` 各 Section |

推荐格式：WebP（优先）或 JPEG。若需视频（≤50MB、MP4/H.264）、3D 模型（GLB）也直接放在同一项目文件夹内。

### 实际示例

以 project-001（弹塑性 FEA）为例，`assets/001-fea/` 内应有：

```
assets/001-fea/
├── cover.jpg             ← 主页卡片缩略图
├── hero.jpg              ← 详情页顶部横幅
├── mesh.jpg              ← 网格划分配图
├── mach-contour.jpg      ← 塑性应变云图
└── pressure-contour.jpg  ← 应力分布云图
```

---

## data/ 下三个 JSON 文件的分工

| 文件 | 控制范围 | 作用 |
|---|---|---|
| `data/i18n.json` | **主页** + **领域页** + 公共元素 | 导航栏、Hero、三大领域卡片、核心能力、软件工具、CTA、Footer、领域页自身的领域描述，全部中英文翻译 |
| `data/projects.json` | 主页 & 领域页的**项目卡片列表** | 每个项目的标题/简介/标签/封面图路径/所属领域/详情页链接，双语字段内嵌（如 `title`/`titleZh`） |
| `data/project-pages-i18n.json` | **项目详情页** | project-001/002/003 各详情页内的所有正文段落、数据标注、图片图注、上下篇导航等中英文翻译 |

### 实际操作对照

| 你想改什么 | 改 HTML | 改哪个 JSON | 改 JSON 的哪个位置 |
|---|---|---|---|
| 主页 Hero 标题 | `index.html` | `i18n.json` | `hero.title.en` / `hero.title.zh` |
| 三大领域卡片介绍 | `index.html` | `i18n.json` | `domains.computationalMechanics.desc.en/zh` 等 |
| 项目卡片上的标题/简介 | 不需要 | `projects.json` | 对应项目的 `title`/`titleZh`、`desc`/`descZh` |
| 项目详情页正文段落 | `project-xxx.html` | `project-pages-i18n.json` | `projectPages.fea.s01Text1.en/zh` 等 |
| 导航栏条目名称 | 各 HTML 页 | `i18n.json` | `nav.computationalMechanics.en/zh` 等 |
| Footer 版权文字 | `index.html` + 各页 | `i18n.json` | `footer.copyright.en/zh` |

> **原则**：HTML 默认文本 + JSON 的 en 字段 + JSON 的 zh 字段 = 三个位置保持内容一致。

---

## 新增项目指南

### 步骤 1：准备素材

在 `assets/` 下新建文件夹（如 `assets/004-xxx/`），把所有图片直接放进去，**不要建子文件夹**。至少准备 `cover.jpg` 和 `hero.jpg`。

### 步骤 2：在 projects.json 中注册

在 `data/projects.json` 的 `projects` 数组中追加：

```json
{
  "id": "project-004",
  "title": "Your Project Title",
  "titleZh": "你的项目标题",
  "desc": "Brief description in English.",
  "descZh": "中文简介。",
  "image": "assets/004-xxx/cover.jpg",
  "domain": "computational-mechanics",
  "tags": ["FEA", "Structural"],
  "tagsZh": ["有限元", "结构力学"],
  "tagsType": ["method", "domain"],
  "featured": true,
  "detailPage": "project-004-xxx.html"
}
```

> `domain` 可选值：`computational-mechanics` / `mechanical-design` / `intelligent-engineering`
> `featured: true` 的项目会出现在主页精选区

### 步骤 3：创建详情页 HTML

1. 复制 `project-template.html` → `project-004-xxx.html`
2. 修改页面内容（标题、各节文字、图片路径、底部导航）
3. 在 `data/project-pages-i18n.json` 中新增对应项目的中英文翻译节点

### 步骤 4：领域页自动生效

项目会自动出现在对应领域页（`domain-xxx.html`）的过滤列表中，无需额外操作。

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
