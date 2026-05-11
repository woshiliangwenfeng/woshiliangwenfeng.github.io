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
