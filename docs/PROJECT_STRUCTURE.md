# G Hub - 项目结构说明

## 目录结构

```
woshiliangwenfeng.github.io/
├── index.html                      # 主页
├── favicon.ico                     # 网站图标
├── robots.txt                      # 搜索引擎爬虫规则
├── sitemap.xml                     # 网站地图
├── README.md                       # 项目说明
│
├── docs/                           # 📄 文档目录
│   ├── CLAUDE.md                   # Claude Code 项目指南
│   ├── ADSENSE.md                 # Google AdSense 集成指南
│   └── SEO_README.md              # SEO 优化说明
│
├── pages/                          # 📑 主要页面目录
│   ├── guides.html                # 游戏攻略列表页
│   ├── tools.html                 # 游戏工具推荐页
│   ├── about.html                 # 关于我们页面
│   ├── contact.html               # 联系我们页面
│   └── privacy.html               # 隐私政策页面
│
└── guides/                         # 🎮 游戏攻略目录
    ├── elden-ring-beginner-guide.html    # Elden Ring 新手攻略
    ├── game-guide-template.html          # 游戏攻略模板
    └── game-guide-adsense-template.html # AdSense优化模板
```

## 文件说明

### 根目录文件
- **index.html**: 网站主页，包含精选游戏和最新攻略
- **favicon.ico**: 浏览器标签页图标
- **robots.txt**: 告诉搜索引擎哪些页面可以爬取
- **sitemap.xml**: 网站地图，帮助搜索引擎发现所有页面

### docs/ 目录
存放项目文档和指南：
- **CLAUDE.md**: 给AI助手的开发指南
- **ADSENSE.md**: AdSense集成完整指南
- **SEO_README.md**: SEO优化说明和后续步骤

### pages/ 目录
存放网站的主要页面：
- **guides.html**: 游戏攻略库列表页
- **tools.html**: 游戏工具和软件推荐
- **about.html**: 关于我们的介绍页面
- **contact.html**: 联系方式页面
- **privacy.html**: 隐私政策（AdSense必需）

### guides/ 目录
存放所有游戏攻略页面：
- **elden-ring-beginner-guide.html**: Elden Ring完整新手攻略示例
- **game-guide-template.html**: 创建新游戏攻略的模板
- **game-guide-adsense-template.html**: 包含AdSense广告位的优化模板

## 开发指南

### 添加新游戏攻略
1. 复制 `guides/game-guide-template.html`
2. 重命名为新攻略文件名（如 `genshin-impact-builds.html`）
3. 填写内容并优化meta标签
4. 更新 `index.html` 和 `pages/guides.html` 中的链接
5. 更新 `sitemap.xml`

### 添加新页面
1. 在 `pages/` 目录创建新HTML文件
2. 使用与其他页面一致的导航栏
3. 包含favicon链接和SEO标签
4. 更新所有页面的导航链接
5. 更新 `sitemap.xml`

## 部署

项目通过 GitHub Pages 自动部署：
- 推送到 `main` 分支会自动部署
- 访问地址: https://woshiliangwenfeng.github.io/

## 注意事项

1. **GitHub Pages**: 需要保持 `index.html` 在根目录
2. **内部链接**: 使用相对路径确保在子目录中正常工作
3. **SEO**: 每个页面都需要完整的meta标签和结构化数据
4. **图片资源**: favicon.ico 在根目录，其他图片可放在 `assets/` 目录