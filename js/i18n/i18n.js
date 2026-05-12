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

function createLanguageSwitcher() {
    // 移除旧的切换器（如果存在）
    const existingSwitcher = document.querySelector('.language-switcher');
    if (existingSwitcher) {
        existingSwitcher.remove();
    }

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
    const displayLang = getLanguage();
    button.textContent = displayLang === 'en' ? '中文' : 'English';

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
        const actualCurrentLang = getLanguage();
        const newLang = actualCurrentLang === 'en' ? 'zh' : 'en';
        switchLanguage(newLang);
    });

    switcher.appendChild(button);
    document.body.appendChild(switcher);
}

async function initI18n(pageName) {
    const lang = getLanguage();
    currentLanguage = lang;

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
}
