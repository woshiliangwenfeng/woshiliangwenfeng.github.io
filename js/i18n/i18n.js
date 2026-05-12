const SUPPORTED_LANGUAGES = ['en', 'zh'];
const DEFAULT_LANGUAGE = 'en';
const STORAGE_KEY = 'preferredLang';
let currentLanguage = DEFAULT_LANGUAGE;

function getLanguage() {
    // 优先从 URL 参数读取
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');

    if (urlLang && SUPPORTED_LANGUAGES.includes(urlLang)) {
        currentLanguage = urlLang;
        return urlLang;
    }

    // 然后从 localStorage 读取
    const storedLang = localStorage.getItem(STORAGE_KEY);

    if (storedLang && SUPPORTED_LANGUAGES.includes(storedLang)) {
        currentLanguage = storedLang;
        return storedLang;
    }

    // 最后检查浏览器语言
    const browserLang = navigator.language.toLowerCase();

    if (browserLang.startsWith('zh')) {
        currentLanguage = 'zh';
        return 'zh';
    }

    currentLanguage = DEFAULT_LANGUAGE;
    return DEFAULT_LANGUAGE;
}

async function loadTranslations(lang) {
    try {
        const response = await fetch(`/translations/${lang}.json`);
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
    }
}

function getNestedValue(obj, path) {
    // 翻译使用扁平键结构（如 "nav.home"），直接访问
    return obj[path] || null;
}

function applyTranslations(translations, pageName) {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        let translation = getNestedValue(translations.common, key);

        if (!translation) {
            translation = getNestedValue(translations[pageName] || {}, key);
        }

        if (translation) {
            element.textContent = translation;
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        let translation = getNestedValue(translations.common, key);
        if (!translation) {
            translation = getNestedValue(translations[pageName] || {}, key);
        }
        if (translation) {
            element.placeholder = translation;
        }
    });

    document.querySelectorAll('[data-i18n-title]').forEach(element => {
        const key = element.getAttribute('data-i18n-title');
        let translation = getNestedValue(translations.common, key);
        if (!translation) {
            translation = getNestedValue(translations[pageName] || {}, key);
        }
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

    // 保存到 localStorage
    localStorage.setItem(STORAGE_KEY, lang);
    currentLanguage = lang;

    // 设置 URL 参数并重新加载
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);

    // 使用 replace 而不是 href 来避免历史记录堆积，并强制刷新
    window.location.replace(url.toString());
}

function createLanguageSwitcher(containerSelector = '.nav-language-switcher') {
    // 移除旧的切换器（如果存在）
    const existingSwitcher = document.querySelector('.figma-language-switcher');
    if (existingSwitcher) {
        existingSwitcher.remove();
    }

    const isEnglish = currentLanguage === 'en';

    const container = document.createElement('div');
    container.className = 'figma-language-switcher';
    container.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
    `;

    // 语言标签
    const label = document.createElement('span');
    label.className = 'figma-lang-label';
    label.textContent = isEnglish ? 'EN' : 'ZH';
    label.style.cssText = `
        font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif;
        font-size: 14px;
        font-weight: 480;
        color: #000000;
    `;

    // Checkbox 开关
    const checkbox = document.createElement('input');
    checkbox.className = 'figma-lang-checkbox';
    checkbox.type = 'checkbox';
    checkbox.checked = !isEnglish;
    checkbox.style.cssText = `
        width: 40px;
        height: 22px;
        appearance: none;
        -webkit-appearance: none;
        background: #e6e6e6;
        border: none;
        border-radius: 11px;
        cursor: pointer;
        position: relative;
        transition: background 0.2s ease;
    `;

    // 添加伪元素（滑块）
    const style = document.createElement('style');
    style.textContent = `
        .figma-lang-checkbox::before {
            content: '';
            position: absolute;
            width: 18px;
            height: 18px;
            background: #ffffff;
            border-radius: 50%;
            top: 2px;
            left: 2px;
            transition: transform 0.2s ease;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }
        .figma-lang-checkbox:checked {
            background: #000000;
        }
        .figma-lang-checkbox:checked::before {
            transform: translateX(18px);
        }
        .figma-lang-checkbox:hover {
            background: ${isEnglish ? '#d1d1d1' : '#1a1a1a'};
        }
    `;
    container.appendChild(style);

    // 点击切换语言
    checkbox.addEventListener('change', () => {
        const newLang = checkbox.checked ? 'zh' : 'en';
        switchLanguage(newLang);
    });

    container.appendChild(label);
    container.appendChild(checkbox);

    // 尝试插入到指定容器
    const targetContainer = document.querySelector(containerSelector);
    if (targetContainer) {
        targetContainer.appendChild(container);
    } else {
        // 如果找不到容器，回退到固定在右下角
        container.style.position = 'fixed';
        container.style.bottom = '24px';
        container.style.right = '24px';
        container.style.zIndex = '9999';
        container.style.background = '#ffffff';
        container.style.padding = '12px 16px';
        container.style.borderRadius = '50px';
        container.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
        document.body.appendChild(container);
    }
}

function updateActiveNav(sectionId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

function initScrollSpy() {
    console.log('🚀 initScrollSpy called');

    // 等待 DOM 加载完成
    if (document.readyState === 'loading') {
        console.log('⏳ DOM still loading, waiting for DOMContentLoaded...');
        document.addEventListener('DOMContentLoaded', initScrollSpy);
        return;
    }

    const sections = document.querySelectorAll('.section');
    console.log(`👀 Found ${sections.length} sections with class 'section'`);

    if (sections.length === 0) {
        console.warn('⚠️ No sections found, scroll spy disabled');
        return;
    }

    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                console.log(`📍 Section entered: ${sectionId}`);
                updateActiveNav(sectionId);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        console.log(`🎯 Observing section: ${section.id}`);
        observer.observe(section);
    });

    // 初始化时设置第一个可见区块的导航状态
    if (sections[0] && sections[0].id) {
        console.log(`🏠 Setting initial nav to: ${sections[0].id}`);
        updateActiveNav(sections[0].id);
    }
}

async function initI18n(pageName) {
    console.log('🎬 initI18n called with page:', pageName);
    const lang = getLanguage();
    currentLanguage = lang;
    console.log(`🌐 Language: ${lang}`);

    // 移除旧的调试信息（如果存在）
    const oldDebugInfo = document.getElementById('i18n-debug');
    if (oldDebugInfo) {
        oldDebugInfo.remove();
    }

    try {
        const translations = await loadTranslations(lang);
        applyTranslations(translations, pageName);
    } catch (error) {
        console.error('Error applying translations:', error);
        if (lang !== DEFAULT_LANGUAGE) {
            const fallbackTranslations = await loadTranslations(DEFAULT_LANGUAGE);
            applyTranslations(fallbackTranslations, pageName);
        }
    }

    createLanguageSwitcher();
    initScrollSpy();
}
