# 中英文语言切换功能设计文档

**日期:** 2026-05-11
**项目:** G Hub
**功能:** 页面中英文语言切换

---

## 1. 需求概述

为 G Hub 添加中英文语言切换功能，允许用户在页面右上角独立切换语言，并记住用户的语言偏好。

### 功能需求

- 在页面右上角独立显示语言切换按钮
- 支持中文和英文两种语言
- 语言切换需要刷新页面
- 支持通过 URL 参数 (`?lang=zh`) 分享特定语言版本
- URL 参数优先于 localStorage
- localStorage 用于记住用户语言偏好
- 游戏名称保持英文，不翻译

### 技术约束

- 静态 HTML 网站，无后端
- SEO 友好，搜索引擎能够索引不同语言版本
- 维护成本低，易于扩展更多语言

---

## 2. 技术方案选择

**选择方案:** JSON 翻译文件 + JavaScript 动态替换

### 方案优势

1. **维护成本低**: 翻译内容集中管理，易于维护
2. **改动量适中**: 只需添加 `data-i18n` 属性
3. **SEO 友好**: 支持 URL 参数，搜索引擎可索引
4. **用户体验好**: 可以记住用户选择
5. **扩展性强**: 轻松添加更多语言支持

---

## 3. 架构设计

### 3.1 组件结构

1. **翻译文件** (`translations/en.json`, `translations/zh.json`) - 存储所有页面的翻译内容
2. **语言切换脚本** (`js/i18n/i18n.js`) - 处理语言检测、加载和切换逻辑
3. **HTML 修改** - 为需要翻译的元素添加 `data-i18n` 属性

### 3.2 文件结构

```
/
├── translations/
│   ├── en.json          # 英文翻译
│   └── zh.json          # 中文翻译
├── js/
│   └── i18n/
│       └── i18n.js      # 国际化脚本
├── index.html           # 主页（添加 data-i18n 属性）
├── pages/
│   ├── guides.html      # 游戏指南页
│   ├── tools.html       # 工具页
│   ├── about.html       # 关于页
│   ├── contact.html     # 联系页
│   └── privacy.html     # 隐私政策页
└── guides/
    └── *.html           # 游戏指南页面
```

---

## 4. 翻译文件设计

### 4.1 翻译文件结构

采用键值对结构，支持层级组织：

```json
{
  "common": {
    "nav.home": "Home",
    "nav.guides": "Game Guides",
    "nav.tools": "Tools",
    "nav.about": "About",
    "nav.contact": "Contact",
    "lang.switch": "中文",
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
  }
}
```

### 4.2 键命名规则

- `common.*` - 所有页面共享的通用翻译
- `{pageName}.*` - 特定页面的翻译（如 `index`, `guides`, `about`）
- 使用点层级结构便于管理

---

## 5. JavaScript 实现

### 5.1 核心功能函数

**文件:** `js/i18n/i18n.js`

```javascript
// 支持的语言
const SUPPORTED_LANGUAGES = ['en', 'zh'];
const DEFAULT_LANGUAGE = 'en';
const STORAGE_KEY = 'preferredLang';

/**
 * 获取当前语言
 * 优先级: URL 参数 > localStorage > 浏览器语言 > 默认英文
 */
function getLanguage() {
    // 检查 URL 参数
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    if (urlLang && SUPPORTED_LANGUAGES.includes(urlLang)) {
        return urlLang;
    }
    
    // 检查 localStorage
    const storedLang = localStorage.getItem(STORAGE_KEY);
    if (storedLang && SUPPORTED_LANGUAGES.includes(storedLang)) {
        return storedLang;
    }
    
    // 检查浏览器语言
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('zh')) {
        return 'zh';
'    }
    
    return DEFAULT_LANGUAGE;
}

/**
 * 加载翻译文件
 */
async function loadTranslations(lang) {
    try {
        const response = await fetch(`translations/${lang}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load translations for ${lang}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading translations:', error);
        // 回退到英文
        if (lang !== DEFAULT_LANGUAGE) {
            return loadTranslations(DEFAULT_LANGUAGE);
        }
        return {};
    }
}

/**
 * 获取嵌套对象的值
 */
function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
        return current && current[key] !== undefined ? current[key] : null;
    }, obj);
}

/**
 * 应用翻译到页面
 */
function applyTranslations(translations, pageName) {
    // 合并 common 和当前页面的翻译
    const pageTranslations = {
        ...translations.common,
        ...(translations[pageName] || {})
    };
    
    // 处理 data-i18n 属性（文本内容）
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getNestedValue(pageTranslations, key);
        if (translation) {
            element.textContent = translation;
        }
    });
    
    // 处理 data-i18n-placeholder 属性（placeholder）
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const translation = getNestedValue(pageTranslations, key);
        if (translation) {
            element.placeholder = translation;
        }
    });
    
    // 处理 data-i18n-title 属性（title）
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
        const key = element.getAttribute('data-i18n-title');
        const translation = getNestedValue(pageTranslations, key);
        if (translation) {
            element.title = translation;
        }
'    });
}

/**
 * 切换语言并刷新页面
 */
function switchLanguage(lang) {
    if (!SUPPORTED_LANGUAGES.includes(lang)) {
        console.error(`Unsupported language: ${lang}`);
        return;
    }
    
    // 保存到 localStorage
    localStorage.setItem(STORAGE_KEY, lang);
    
    // 更新 URL 参数
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    
    // 刷新页面
    window.location.href = url.toString();
}

/**
 * 创建语言切换按钮
 */
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

/**
 * 初始化国际化
 */
async function initI18n(pageName) {
    const lang = getLanguage();
    const translations = await loadTranslations(lang);
    applyTranslations(translations, pageName);
    createLanguageSwitcher(lang);
}
```

### 5.2 HTML 使用方式

在每个 HTML 文件中：

```html
<!-- 导入国际化脚本 -->
<script src="js/i18n/i18n.js"></script>

<!-- 使用 data-i18n 属性 -->
<a href="index.html" data-i18n="nav.home">Home</a>
<h1 data-i18n="hero.title">Level Up Your Gaming Experience</h1>
<input type="text" data-i18n-placeholder="hero.search.placeholder" placeholder="Search...">
<button data-i18n-title="button.tooltip" title="Click me">Button</button>

<!-- 页面底部初始化 -->
<script>
    document.addEventListener('DOMContentLoaded', () => {
        initI18n('index');  // 传入页面名称
    });
</script>
```

---

## 6. HTML 修改示例

### 6.1 导航栏修改

```html
<div class="nav-links">
    <a href="index.html" class="active" data-i18n="nav.home">Home</a>
    <a href="pages/guides.html" data-i18n="nav.guides">Game Guides</a>
    <a href="pages/tools.html" data-i18n="nav.tools">Tools</a>
    <a href="pages/about.html" data-i18n="nav.about">About</a>
    <a href="pages/contact.html" data-i18n="nav.contact">Contact</a>
</div>
```

### 6.2 Hero 区域修改

```html
<div class="hero">
    <h1 data-i18n="hero.title">Level Up Your Gaming Experience</h1>
    <p class="subtitle" data-i18n="hero.subtitle">Your ultimate destination for comprehensive game walkthroughs, expert tips, and unbeatable strategies. From indie gems to AAA blockbusters.</p>
    
    <div class="search-box">
        <input type="text" data-i18n-placeholder="hero.search.placeholder" placeholder="Search game guides, tips, and walkthroughs...">
    </div>
</div>
```

### 6.3 Section 标题修改

```html
<h2 class="section-title" data-i18n="section.featuredGames">Featured Games</h2>
<h2 class="section-title" data-i18n="section.latestGuides">Latest Game Guides</h2>
<h2 class="section-title" data-i18n="section.essentialTools">Essential Gaming Tools</h2>
```

---

## 7. 实现步骤

1. **创建翻译文件**
   - 创建 `translations/en.json`
   - 创建 `translations/zh.json`
   - 添加所有页面的翻译内容

2. **创建国际化脚本**
   - 创建 `js/i18n/i18n.js`
   - 实现语言检测、加载和切换逻辑

3. **修改 HTML 文件**
   - 为需要翻译的元素添加 `data-i18n` 属性
   - 在每个页面底部添加初始化脚本

4. **测试**
   - 测试语言切换功能
   - 测试 URL 参数 (?lang=zh)
   - 测试 localStorage 持久化
   - 测试移动端响应式设计

---

## 8. SEO 考虑

### 8.1 URL 参数支持

- `https://woshiliangwenfeng.github.io/index.html?lang=en` - 英文版本
- `https://woshiliangwenfeng.github.io/index.html?lang=zh` - 中文版本

### 8.2 搜索引擎索引

- 确保翻译文件可以被正确加载
- 为不同语言版本提供不同的 URL 参数
- 考虑在 `sitemap.xml` 中添加不同语言版本的链接

---

## 9. 扩展性

### 9.1 添加新语言

1. 创建新的翻译文件（如 `translations/ja.json`）
2. 在 `SUPPORTED_LANGUAGES` 中添加语言代码
3. 翻译所有键值对

### 9.2 添加新的页面

1. 在翻译文件的对应页面部分添加翻译
2. 在 HTML 文件中添加 `data-i18n` 属性
3. 在页面底部调用 `initI18n('pageName')`

---

## 10. 已知限制

1. **页面刷新**: 切换语言时需要刷新页面，不是即时切换
2. **游戏名称**: 游戏名称保持英文，不进行翻译
3. **翻译文件大小**: 随着内容增加，翻译文件会变大，但这个项目规模可控

---

## 11. 测试清单

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