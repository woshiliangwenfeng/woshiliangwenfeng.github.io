# 中英文语言切换功能实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 G Hub 添加中英文语言切换功能，允许用户在页面右上角独立切换语言，并记住语言偏好

**Architecture:** 使用 JSON 翻译文件集中管理翻译内容，JavaScript 动态替换页面文本，支持 URL 参数和 localStorage

**Tech Stack:** 原生 JavaScript、JSON、localStorage、URLSearchParams

---

### Task 1: 创建目录结构

**Files:**
- Create: `translations/`
- Create: `js/i18n/`

- [ ] **Step 1: 创建 translations 目录**

```bash
mkdir -p /Users/liangwf/PycharmProjects/woshiliangwenfeng.github.io/translations
```

- [ ] **Step 2: 创建 js/i18n 目录**

```bash
mkdir -p /Users/liangwf/PycharmProjects/woshiliangwenfeng.github.io/js/i18n
```

- [ ] **Step 3: 验证目录创建成功**

```bash
ls -la /Users/liangwf/PycharmProjects/woshiliangwenfeng.github.io/translations
ls -la /Users/liangwf/PycharmProjects/woshiliangwenfeng.github.io/js/i18n
```

---

### Task 2: 创建英文翻译文件

**Files:**
- Create: `translations/en.json`

- [ ] **Step 1: 写入英文翻译文件**

```json
{
  "common": {
    "nav.home": "Home",
    "nav.guides": "Game Guides",
    "nav.tools": "Tools",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.privacy": "Privacy",
    "footer.copyright": "© 2026 G Hub. All rights reserved.",
    "footer.privacy": "Privacy Policy"
  },
  "index": {
    "hero.title": "Level Up Your Gaming Experience",
    "hero.subtitle": "Your ultimate destination for comprehensive game walkthroughs, expert tips, and unbeatable strategies. From indie gems to AAA blockbusters.",
    "hero.search.placeholder": "Search game guides, tips, and walkthroughs...",
    "section.featuredGames": "Featured Games",
    "section.latestGuides": "Latest Game Guides",
    "section.essentialTools": "Essential Gaming Tools"
  },
  "guides": {
    "title": "Game Guides Library",
    "subtitle": "Explore our comprehensive collection of walkthroughs, tips, and strategies",
    "search.placeholder": "Search game guides by name, genre, or platform...",
    "section.featuredGames": "Featured Games",
    "section.popularGuides": "Popular Guides This Week"
  },
  "tools": {
    "title": "Essential Gaming Tools",
    "subtitle": "Discover best software to enhance your gaming experience"
  },
  "about": {
    "title": "About G Hub",
    "subtitle": "Your trusted source for expert gaming knowledge",
    "section.ourStory.title": "Our Story",
    "section.mission.title": "🎯 Our Mission",
    "section.mission.subtitle": "To provide gamers worldwide with accessible, accurate, and comprehensive guides that enhance their gaming experience and help them discover every hidden gem in their favorite games.",
    "mission.accuracy.title": "✅ Accuracy First",
    "mission.accuracy.desc": "Every guide is thoroughly tested and verified for accuracy",
    "mission.accessibility.title": "🎓 Accessibility",
    "mission.accessibility.desc": "Complex strategies explained in simple, easy-to-follow terms",
    "mission.updates.title": "🔄 Regular Updates",
    "mission.updates.desc": "Content stays current with game patches and new releases",
    "mission.community.title": "🌍 Community Focus",
    "mission.community.desc": "Built by gamers, for gamers with community input",
    "section.whatWeCover.title": "What We Cover",
    "section.whatWeCover.subtitle": "Our guides span across multiple gaming platforms and genres, including:",
    "section.whyChooseUs.title": "Why Choose Us",
    "section.whyChooseUs.subtitle": "Unlike other gaming websites, we focus on quality over quantity. Every guide is crafted with care, featuring:",
    "btn.exploreGuides": "Explore Our Guides"
  },
  "contact": {
    "title": "Contact Us",
    "subtitle": "Have questions or suggestions? We'd love to hear from you",
    "card.title": "Get in Touch",
    "card.desc": "Whether you have questions about our guides, want to suggest a new game, or are interested in collaboration, feel free to reach out.",
    "email.label": "📧 Email Address",
    "btn.sendEmail": "Send Email",
    "reason.guideQuestions.title": "❓ Guide Questions",
    "reason.guideQuestions.desc": "Need help with a specific guide or have suggestions?",
    "reason.gameRequests.title": "🎮 Game Requests",
    "reason.gameRequests.desc": "Want us to cover a particular game?",
    "reason.collaboration.title": "🤝 Collaboration",
    "reason.collaboration.desc": "Interested in partnerships or content collaborations?",
    "responseTime.title": "⏰ Response Time",
    "responseTime.desc": "We typically respond to emails within 24-48 hours"
  },
  "privacy": {
    "title": "Privacy Policy",
    "lastUpdated": "Last Updated: April 1, 2026",
    "toc.title": "📋 Table of Contents",
    "section1.title": "1. Introduction",
    "section1.desc": "Welcome to G Hub. This privacy policy is intended to inform you about how we collect, use, disclose, and protect your personal information. By using this website, you agree to terms and conditions of this privacy policy.",
    "section2.title": "2. Information We Collect",
    "section2.desc": "We may collect following types of information:",
    "section2.item1": "Browsing Data: Including your IP address, browser type, access time, and pages visited",
    "section2.item2": "Device Information: Including your device model, operating system, and screen resolution",
    "section2.item3": "Cookies: We use cookies to improve user experience and conduct website analytics",
    "section2.item4": "Email Information: If you contact us via email, we may collect your email address",
    "section3.title": "3. How We Use Your Information",
    "section3.desc": "The information we collect is used for following purposes:",
    "section4.title": "4. Third-Party Services",
    "section4.desc": "This website may use third-party services, including but not limited to:",
    "section11.title": "11. Contact Us",
    "section11.desc": "If you have any questions or concerns about this privacy policy, please contact us through following methods:",
    "btn.contactUs": "Contact Us"
  }
}
```

---

### Task 3: 创建中文翻译文件

**Files:**
- Create: `translations/zh.json`

- [ ] **Step 1: 写入中文翻译文件**

```json
{
  "common": {
    "nav.home": "首页",
    "nav.guides": "游戏攻略",
    "nav.tools": "工具",
    "nav.about": "关于",
    "nav.contact": "联系我们",
    "nav.privacy": "隐私政策",
    "footer.copyright": "© 2026 G Hub. 保留所有权利。",
    "footer.privacy": "隐私政策"
  },
  "index": {
    "hero.title": "提升您的游戏体验",
    "hero.subtitle": "您的终极游戏指南、专家技巧和无敌策略目的地。从独立游戏到AAA大作。",
    "hero.search.placeholder": "搜索游戏攻略、技巧和通关指南...",
    "section.featuredGames": "精选游戏",
    "section.latestGuides": "最新游戏攻略",
    "section.essentialTools": "必备游戏工具"
  },
  "guides": {
    "title": "游戏攻略库",
    "subtitle": "探索我们全面的通关指南、技巧和策略集合",
    "search.placeholder": "按游戏名称、类型或平台搜索攻略...",
    "section.featuredGames": "精选游戏",
    "section.popularGuides": "本周热门攻略"
  },
  "tools": {
    "title": "必备游戏工具",
    "subtitle": "发现提升游戏体验的最佳软件"
  },
  "about": {
    "title": "关于 G Hub",
    "subtitle": "您值得信赖的专业游戏知识来源",
    "section.ourStory.title": "我们的故事",
    "section.mission.title": "🎯 我们的使命",
    "section.mission.subtitle": "为全球玩家提供易于理解、准确全面的攻略，提升游戏体验，帮助发现喜爱的游戏中的每一个隐藏宝藏。",
    "mission.accuracy.title": "✅ 准确性优先",
    "mission.accuracy.desc": "每篇攻略都经过彻底测试和验证",
    "mission.accessibility.title": "🎓 易于理解",
    "mission.accessibility.desc": "用简单易懂的方式解释复杂策略",
    "mission.updates.title": "🔄 定期更新",
    "mission.updates.desc": "内容随游戏补丁和新发布保持最新",
    "mission.community.title": "🌍 社区导向",
    "mission.community.desc": "由玩家为玩家打造，融入社区反馈",
    "section.whatWeCover.title": "涵盖内容",
    "section.whatWeCover.subtitle": "我们的攻略涵盖多个游戏平台和类型，包括：",
    "section.whyChooseUs.title": "选择我们的理由",
    "section.whyChooseUs.subtitle": "与其他游戏网站不同，我们注重质量而非数量。每篇攻略都精心制作，具有以下特点：",
    "btn.exploreGuides": "探索我们的攻略"
  },
  "contact": {
    "title": "联系我们",
    "subtitle": "有问题或建议？我们很乐意听到您的声音",
    "card.title": "联系我们",
    "card.desc": "无论您对攻略有疑问、想推荐新游戏，还是对合作感兴趣，请随时联系我们。",
    "email.label": "📧 电子邮件地址",
    "btn.sendEmail": "发送邮件",
    "reason.guideQuestions.title": "❓ 攻略问题",
    "reason.guideQuestions.desc": "对特定攻略需要帮助或有建议？",
    "reason.gameRequests.title": "🎮 游戏推荐",
    "reason.gameRequests.desc": "希望我们覆盖特定游戏？",
    "reason.collaboration.title": "🤝 合作",
    "reason.collaboration.desc": "对合作或内容合作感兴趣？",
    "responseTime.title": "⏰ 回复时间",
    "responseTime.desc": "我们通常在24-48小时内回复邮件"
  },
  "privacy": {
    "title": "隐私政策",
    "lastUpdated": "最后更新：2026年4月1日",
    "toc.title": "📋 目录",
    "section1.title": "1. 简介",
    "section1.desc": "欢迎来到 G Hub。本隐私政策旨在告知您我们如何收集、使用、披露和保护您的个人信息。使用本网站即表示您同意本隐私政策的条款和条件。",
    "section2.title": "2. 我们收集的信息",
    "section2.desc": "我们可能收集以下类型的信息：",
    "section2.item1": "浏览数据：包括您的IP地址、浏览器类型、访问时间和访问的页面",
    "section2.item2": "设备信息：包括您的设备型号、操作系统和屏幕分辨率",
    "section2.item3": "Cookie：我们使用cookie来改善用户体验并进行网站分析",
    "section2.item4": "电子邮件信息：如果您通过电子邮件联系我们，我们可能会收集您的电子邮件地址",
    "section3.title": "3. 我们如何使用您的信息",
    "section3.desc": "我们收集的信息用于以下目的：",
    "section4.title": "4. 第三方服务",
    "section4.desc": "本网站可能使用第三方服务，包括但不限于：",
    "section11.title": "11. 联系我们",
    "section11.desc": "如果您对本隐私政策有任何疑问或担忧，请通过以下方式联系我们：",
    "btn.contactUs": "联系我们"
  }
}
```

---

### Task 4: 创建国际化 JavaScript 脚本

**Files:**
- Create: `js/i18n/i18n.js`

- [ ] **Step 1: 创建 i18n.js 文件**

```javascript
const SUPPORTED_LANGUAGES = ['en', 'zh'];
const DEFAULT_LANGUAGE = 'en';
const STORAGE_KEY = 'preferredLang';

function getLanguage() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    if (urlLang && SUPPORTED_LANGUAGES.includes(urlLang)) {
        return urlLang;
    }
    
    const storedLang = localStorage.getItem(STORAGE_KEY);
    if (storedLang && SUPPORTED_LANGUAGES.includes(storedLang)) {
        return storedLang;
    }
    
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('zh')) {
        return 'zh';
    }
    
    return DEFAULT_LANGUAGE;
}

async function loadTranslations(lang) {
    try {
        const response = await fetch(`translations/${lang}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load translations for ${lang}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading translations:', error);
        if (lang !== DEFAULT_LANGUAGE) {
            return loadTranslations(DEFAULT_LANGUAGE);
        }
        return {};
 {};
    }
}

function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
        return current && current[key] !== undefined ? current[key] : null;
    }, obj);
}

function applyTranslations(translations, pageName) {
    const pageTranslations = {
        ...translations.common,
        ...(translations[pageName] || {})
    };
    
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getNestedValue(pageTranslations, key);
        if (translation) {
            element.textContent = translation;
        }
    });
    
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const translation = getNestedValue(pageTranslations, key);
        if (translation) {
            element.placeholder = translation;
        }
    });
    
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
        const key = element.getAttribute('data-i18n-title');
        const translation = getNestedValue(pageTranslations, key);
        if (translation) {
            element.title = translation;
        }
    });
}

function switchLanguage(lang) {
    if (!SUPPORTED_LANGUAGES.includes(lang)) {
        console.error(`Unsupported language: ${lang}`);
        return;
    }
    
    localStorage.setItem(STORAGE_KEY, lang);
    
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    
    window.location.href = url.toString();
}

function createLanguageSwitcher(currentLang) {
    const switcher = document.createElement('div');
    switcher.className = 'language-switcher';
    switcher.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1001;
    `;
    
    const button = document.createElement('button');
    button.className = 'lang-switch-btn';
    button.textContent = currentLang === 'en' ? '中文' : 'English';
    button.style.cssText = `
        background: rgba(102, 126, 234, 0.8);
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 20px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.3s;
    `;
    
    button.addEventListener('mouseenter', () => {
        button.style.background = 'rgba(118, 75, 162, 0.9)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.background = 'rgba(102, 126, 234, 0.8)';
    });
    
    button.addEventListener('click', () => {
        const newLang = currentLang === 'en' ? 'zh' : 'en';
        switchLanguage(newLang);
    });
    
    switcher.appendChild(button);
    document.body.appendChild(switcher);
}

async function initI18n(pageName) {
    const lang = getLanguage();
    const translations = await loadTranslations(lang);
    applyTranslations(translations, pageName);
    createLanguageSwitcher(lang);
}
```

---

### Task 5: 修改 index.html 添加 i18n 支持

**Files:**
- Modify: `index.html`

- [ ] **Step 1: 在 head 中添加 i18n.js 脚本引用**

在 `</head>` 标签前添加：
```html
<script src="js/i18n/i18n.js"></script>
```

- [ ] **Step 2: 修改导航栏添加 data-i18n 属性**

将导航栏链接修改为：
```html
<div class="nav-links">
    <a href="index.html" class="active" data-i18n="nav.home">Home</a>
    <a href="pages/guides.html" data-i18n="nav.guides">Game Guides</a>
    <a href="pages/tools.html" data-i18n="nav.tools">Tools</a>
    <a href="pages/about.html" data-i18n="nav.about">About</a>
    <a href="pages/contact.html" data-i18n="nav.contact">Contact</a>
</div>
```

- [ ] **Step 3: 修改 Hero 区域添加 data-i18n 属性**

将 Hero 区域的标题和副标题修改为：
```html
<h1 data-i18n="hero.title">Level Up Your Gaming Experience</h1>
<p class="subtitle" data-i18n="hero.subtitle">Your ultimate destination for comprehensive game walkthroughs, expert tips, and unbeatable strategies. From indie gems to AAA blockbusters.</p>
```

- [ ] **Step 4: 修改搜索框添加 data-i18n-placeholder 属性**

将搜索框修改为：
```html
<input type="text" data-i18n-placeholder="hero.search.placeholder" placeholder="Search game guides, tips, and walkthroughs...">
```

- [ ] **Step 5: 修改 Section 标题添加 data-i18n 属性**

将三个 section 标题修改为：
```html
<h2 class="section-title" data-i18n="section.featuredGames">Featured Games</h2>
<h2 class="section-title" data-i18n="section.latestGuides">Latest Game Guides</h2>
<h2 class="section-title" data-i18n="section.essentialTools">Essential Gaming Tools</h2>
```

- [ ] **Step 6: 在 body 底部添加 i18n 初始化脚本**

在 `</body>` 标签前添加：
```html
<script>
    document.addEventListener('DOMContentLoaded', () => {
        initI18n('index');
    });
</script>
```

---

### Task 6: 修改 pages/guides.html 添加 i18n 支持

**Files:**
- Modify: `pages/guides.html`

- [ ] **Step 1: 在 head 中添加 i18n.js 脚本引用**

在 `</head>` 标签前添加：
```html
<script src="../js/i18n/i18n.js"></script>
```

- [ ] **Step 2: 修改导航栏添加 data-i18n 属性**

将导航栏链接修改为：
```html
<div class="nav-links">
    <a href="../index.html" data-i18n="nav.home">Home</a>
    <a href="guides.html" class="active" data-i18n="nav.guides">Game Guides</a>
    <a href="tools.html" data-i18n="nav.tools">Tools</a>
    <a href="about.html" data-i18n="nav.about">About</a>
    <a href="contact.html" data-i18n="nav.contact">Contact</a>
</div>
```

- [ ] **Step 3: 修改页面标题和副标题添加 data-i18n 属性**

```html
<h1 data-i18n="title">Game Guides Library</h1>
<p data-i18n="subtitle">Explore our comprehensive collection of walkthroughs, tips, and strategies</p>
```

- [ ] **Step 4: 修改搜索框添加 data-i18n-placeholder 属性**

```html
<input type="text" data-i18n-placeholder="search.placeholder" placeholder="Search game guides by name, genre, or platform...">
```

- [ ] **Step 5: 修改 Section 标题添加 data-i18n 属性**

```html
<h2 class="section-title" data-i18n="section.featuredGames">Featured Games</h2>
<h2 class="section-title" data-i18n="section.popularGuides">Popular Guides This Week</h2>
```

- [ ] **Step 6: 在 body 底部添加 i18n 初始化脚本**

在 `</body>` 标签前添加：
```html
<script>
    document.addEventListener('DOMContentLoaded', () => {
        initI18n('guides');
    });
</script>
```

---

### Task 7: 修改 pages/tools.html 添加 i18n 支持

**Files:**
- Modify: `pages/tools.html`

- [ ] **Step 1: 在 head 中添加 i18n.js 脚本引用**

在 `</head>` 标签前添加：
```html
<script src="../js/i18n/i18n.js"></script>
```

- [ ] **Step 2: 修改导航栏添加 data-i18n 属性**

```html
<div class="nav-links">
    <a href="../index.html" data-i18n="nav.home">Home</a>
    <a href="guides.html" data-i18n="nav.guides">Game Guides</a>
    <a href="tools.html" class="active" data-i18n="nav.tools">Tools</a>
    <a href="about.html" data-i18n="nav.about">About</a>
    <a href="contact.html" data-i18n="nav.contact">Contact</a>
</div>
```

- [ ] **Step 3: 修改页面标题和副标题添加 data-i18n 属性**

```html
<h1 data-i18n="title">Essential Gaming Tools</h1>
<p data-i18n="subtitle">Discover best software to enhance your gaming experience</p>
```

- [ ] **Step 4: 在 body 底部添加 i18n 初始化脚本**

在 `</body>` 标签前添加：
```html
<script>
    document.addEventListener('DOMContentLoaded', () => {
        initI18n('tools');
    });
</script>
```

---

### Task 8: 修改 pages/about.html 添加 i18n 支持

**Files:**
- Modify: `pages/about.html`

- [ ] **Step 1: 在 head 中添加 i18n.js 脚本引用**

在 `</head>` 标签前添加：
```html
<script src="../js/i18n/i18n.js"></script>
```

- [ ] **Step 2: 修改导航栏添加 data-i18n 属性**

```html
<div class="nav-links">
    <a href="../index.html" data-i18n="nav.home">Home</a>
    <a href="guides.html" data-i18n="nav.guides">Game Guides</a>
    <a href="tools.html" data-i18n="nav.tools">Tools</a>
    <a href="about.html" class="active" data-i18n="nav.about">About</a>
    <a href="contact.html" data-i18n="nav.contact">Contact</a>
</div>
```

- [ ] **Step 3: 修改页面标题和副标题添加 data-i18n 属性**

```html
<h1 data-i18n="title">About G Hub</h1>
<p data-i18n="subtitle">Your trusted source for expert gaming knowledge</p>
```

- [ ] **Step 4: 修改 Our Story 标题添加 data-i18n 属性**

```html
<h2 data-i18n="section.ourStory.title">Our Story</h2>
```

- [ ] **Step 5: 修改 Mission 标题和副标题添加 data-i18n 属性**

```html
<h2 data-i18n="section.mission.title">🎯 Our Mission</h2>
<p data-i18n="section.mission.subtitle">To provide gamers worldwide with accessible, accurate, and comprehensive guides...</p>
```

- [ ] **Step 6: 修改四个 Mission Point 标题和描述添加 data-i18n 属性**

```html
<div class="mission-point">
    <h3 data-i18n="mission.accuracy.title">✅ Accuracy First</h3>
    <p data-i18n="mission.accuracy.desc">Every guide is thoroughly tested and verified for accuracy</p>
</div>
<div class="mission-point">
    <h3 data-i18n="mission.accessibility.title">🎓 Accessibility</h3>
    <p data-i18n="mission.accessibility.desc">Complex strategies explained in simple, easy-to-follow terms</p>
</div>
<div class="mission-point">
    <h3 data-i18n="mission.updates.title">🔄 Regular Updates</h3>
    <p data-i18n="mission.updates.desc">Content stays current with game patches and new releases</p>
</div>
<div class="mission-point">
    <h3 data-i18n="mission.community.title">🌍 Community Focus</h3>
    <p data-i18n="mission.community.desc">Built by gamers, for gamers with community input</p>
</div>
```

- [ ] **Step 7: 修改 What We Cover 标题和副标题添加 data-i18n 属性**

```html
<h2 data-i18n="section.whatWeCover.title">What We Cover</h2>
<p data-i18n="section.whatWeCover.subtitle">Our guides span across multiple gaming platforms and genres, including:</p>
```

- [ ] **Step 8: 修改 Why Choose Us 标题和副标题添加 data-i18n 属性**

```html
<h2 data-i18n="section.whyChooseUs.title">Why Choose Us</h2>
<p data-i18n="section.whyChooseUs.subtitle">Unlike other gaming websites, we focus on quality over quantity...</p>
```

- [ ] **Step 9: 修改 Explore Guides 按钮添加 data-i18n 属性**

```html
<a href="guides.html" class="btn" data-i18n="btn.exploreGuides">Explore Our Guides</a>
```

- [ ] **Step 10: 在 body 底部添加 i18n 初始化脚本**

在 `</body>` 标签前添加：
```html
<script>
    document.addEventListener('DOMContentLoaded', () => {
        initI18n('about');
    });
</script>
```

---

### Task 9: 修改 pages/contact.html 添加 i18n 支持

**Files:**
- Modify: `pages/contact.html`

- [ ] **Step 1: 在 head 中添加 i18n.js 脚本引用**

在 `</head>` 标签前添加：
```html
<script src="../js/i18n/i18n.js"></script>
```

- [ ] **Step 2: 修改导航栏添加 data-i18n 属性**

```html
<div class="nav-links">
    <a href="../index.html" data-i18n="nav.home">Home</a>
    <a href="guides.html" data-i18n="nav.guides">Game Guides</a>
    <a href="tools.html" data-i18n="nav.tools">Tools</a>
    <a href="about.html" data-i18n="nav.about">About</a>
    <a href="contact.html" class="active" data-i18n="="nav.contact">Contact</a>
</div>
```

- [ ] **Step 3: 修改页面标题和副标题添加 data-i18n 属性**

```html
<h1 data-i18n="title">Contact Us</h1>
<p data-i18n="subtitle">Have questions or suggestions? We'd love to hear from you</p>
```

- [ ] **Step 4: 修改 Contact Card 标题和描述添加 data-i18n 属性**

```html
<h2 data-i18n="card.title">Get in Touch</h2>
<p data-i18n="card.desc">Whether you have questions about our guides, want to suggest a new game, or are interested in collaboration, feel free to reach out.</p>
```

- [ ] **Step 5: 修改 Email 标签添加 data-i18n 属性**

```html
<span class="label" data-i18n="email.label">📧 Email Address</span>
```

- [ ] **Step 6: 修改 Send Email 按钮添加 data-i18n 属性**

```html
<a href="mailto:liangwenfeng730@gmail.com" class="btn" data-i18n="btn.sendEmail">Send Email</a>
```

- [ ] **Step 7: 修改三个 Contact Reason 卡片添加 data-i18n 属性**

```html
<div class="reason-card">
    <h3 data-i18n="reason.guideQuestions.title">❓ Guide Questions</h3>
    <p data-i18n="reason.guideQuestions.desc">Need help with a specific guide or have suggestions?</p>
</div>
<div class="reason-card">
    <h3 data-i18n="reason.gameRequests.title">🎮 Game Requests</h3>
    <p data-i18n="reason.gameRequests.desc">Want us to cover a particular game?</p>
</div>
<div class="reason-card">
    <h3 data-i18n="reason.collaboration.title">🤝 Collaboration</h3>
    <p data-i18n="reason.collaboration.desc">Interested in partnerships or content collaborations?</p>
</div>
```

- [ ] **Step 8: 修改 Response Time 标题和描述添加 data-i18n 属性**

```html
<h3 data-i18n="responseTime.title">⏰ Response Time</h3>
<p data-i18n="responseTime.desc">We typically respond to emails within 24-48 hours</p>
```

- [ ] **Step 9: 在 body 底部添加 i18n 初始化脚本**

在 `</body>` 标签前添加：
```html
<script>
    document.addEventListener('DOMContentLoaded', () => {
        initI18n('contact');
    });
</script>
```

---

### Task 10: 修改 pages/privacy.html 添加 i18n 支持

**Files:**
- Modify: `pages/privacy.html`

- [ ] **Step 1: 在 head 中添加 i18n.js 脚本引用**

在 `</head>` 标签前添加：
```html
<script src="../js/i18n/i18n.js"></script>
```

- [ ] **Step 2: 修改导航栏添加 data-i18n 属性**

```html
<div class="nav-links">
    <a href="../index.html" data-i18n="nav.home">Home</a>
    <a href="guides.html" data-i18n="nav.guides">Game Guides</a>
    <a href="tools.html" data-i18n="nav.tools">Tools</a>
    <a href="about.html" data-i18n="nav.about">About</a>
    <a href="contact.html" data-i18n="nav.contact">Contact</a>
    <a href="privacy.html" class="active" data-i18n="nav.privacy">Privacy</a>
</div>
```

- [ ] **Step 3: 修改页面标题和最后更新时间添加 data-i18n 属性**

```html
<h1 data-i18n="title">Privacy Policy</h1>
<p class="last-updated" data-i18n="lastUpdated">Last Updated: April 1, 2026</p>
```

- [ ] **Step 4: 修改 Table of Contents 标题添加 data-i18n 属性**

```html
<h3 data-i18n="toc.title">📋 Table of Contents</h3>
```

- [ ] **Step 5: 修改主要 section 标题和描述添加 data-i18n 属性**

```html
<h2 id="section1" data-i18n="section1.title">1. Introduction</h2>
<p data-i18n="section1.desc">Welcome to G Hub. This privacy policy is intended to inform you about how we collect, use, disclose, and protect your personal information...</p>

<h2 id="section2" data-i18n="section2.title">2. Information We Collect</h2>
<p data-i18n="section2.desc">We may collect following types of information:</p>

<h2 id="section3" data-i18n="section3.title">3. How We Use Your Information</h2>
<p data-i18n="section3.desc">The information we collect is used for following purposes:</p>

<h2 id="section4" data-i="18n="section4.title">4. Third-Party Services</h2>
<p data-i18n="section4.desc">This website may use third-party services, including but not limited to:</p>

<h2 id="section11" data-i18n="section11.title">11. Contact Us</h2>
<p data-i18n="section11.desc">If you have any questions or concerns about this privacy policy, please contact us through following methods:</p>
```

- [ ] **Step 6: 修改 Contact Us 按钮添加 data-i18n 属性**

```html
<a href="contact.html" class="btn" data-i18n="btn.contactUs">Contact Us</a>
```

- [ ] **Step 7: 在 body 底部添加 i18n 初始化脚本**

在 `</body>` 标签前的现有脚本之前添加：
```html
<script>
    document.addEventListener('DOMContentLoaded', () => {
        initI18n('privacy');
    });
</script>
```

---

### Task 11: 测试功能

**Files:**
- Test: 所有修改的 HTML 文件

- [ ] **Step 1: 在浏览器中打开 index.html**

```bash
open /Users/liangwf/PycharmProjects/woshiliangwenfeng.github.io/index.html
```

- [ ] **Step 2: 验证语言切换按钮显示在右上角**

Expected: 页面右上角显示语言切换按钮（显示"中文"）

- [ ] **Step 3: 点击语言切换按钮**

Expected: 页面刷新，URL 变为 `index.html?lang=zh`，内容变为中文，按钮显示 "English"

- [ ] **Step 4: 测试 URL 参数**

访问 `index.html?lang=en`，Expected: 页面显示英文
访问 `index.html?lang=zh`，Expected: 页面显示中文

- [ ] **Step 5: 测试 localStorage 持久化**

切换到中文后，关闭页面重新打开，Expected: 页面保持中文显示

- [ ] **Step 6: 测试其他页面**

在浏览器中访问 `pages/guides.html`, `pages/tools.html`, `pages/about.html`, `pages/contact.html`, `pages/privacy.html`

Expected: 所有页面右上角都显示语言切换按钮，且语言状态保持一致

- [ ] **Step 7: 测试移动端响应式**

调整浏览器窗口大小到移动端尺寸（<768px）

Expected: 语言切换按钮在移动端正常显示，不与其他元素重叠

- [ ] **Step 8: 测试浏览器语言设置**

将浏览器语言设置为中文，清除 localStorage 和 URL 参数后刷新页面

Expected: 页面自动显示中文

---

### Task 12: 提交代码

**Files:**
- Git commit

- [ ] **Step 1: 添加所有新文件到 git**

```bash
git add translations/ js/i18n/
```

- [ ] **Step 2: 添加所有修改的 HTML 文件**

```bash
git add index.html pages/guides.html pages/tools.html pages/about.html pages/contact.html pages/privacy.html
```

- [ ] **Step 3: 提交更改**

```bash
git commit -m "feat: add Chinese/English language switching feature

- Add i18n.js for language detection and switching
- Create en.json and zh.json translation files
- Add data-i18n attributes to all pages
- Support URL parameter (?lang=zh) and localStorage persistence
- Language switch button in top-right corner
- Covers: index, guides, tools, about, contact, privacy pages"
```

- [ ] **Step 4: 推送到远程仓库**

```bash
git push origin main
```

---

**实施完成！**

验证清单：
- [ ] 语言切换按钮显示在右上角
- [ ] 点击切换按钮正确切换语言
- [ ] URL 参数 `?lang=zh` 正确加载中文
- [ ] URL 参数 `?lang=en` 正确加载英文
- [ ] localStorage 正确保存和恢复语言偏好
- [ ] 浏览器语言设置正确影响默认语言
- [ ] 所有页面翻译正确显示
- [ ] placeholder 和 title 属性正确翻译
- [ ] 移动端显示正常
- [ ] 不存在翻译内容时回退到英文