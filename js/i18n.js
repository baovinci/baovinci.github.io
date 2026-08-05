/*
 * ============================================================================
 * 文件名称：i18n.js
 * 文件用途：中英文双语切换 — 数据驱动，无外部依赖
 * 管理内容：
 *   - 从 data/i18n.json 加载翻译数据
 *   - 遍历 [data-i18n] 元素替换文本
 *   - 语言偏好存入 localStorage
 *   - 导航栏语言切换按钮绑定
 * 修改入口：
 *   - 新增翻译文本：在 data/i18n.json 中追加键值对
 *   - HTML 元素标记：添加 data-i18n="key.path" 属性
 * 注意事项：
 *   - 页面默认语言由 html[lang] 决定（zh-CN / en）
 *   - 此文件应在 main.js 之后加载（或 DOMContentLoaded 触发后初始化）
 * ============================================================================
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'bao-vinci-lang';
  let translations = null;
  let currentLang = 'en';

  /* ─── 初始化 ─── */
  function init() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'zh' || saved === 'en') {
        currentLang = saved;
      } else {
        /* 默认跟随浏览器语言 */
        const navLang = navigator.language || '';
        currentLang = navLang.startsWith('zh') ? 'zh' : 'en';
      }
    } catch (e) {
      console.warn('[i18n] localStorage unavailable, using browser language');
      const navLang = navigator.language || '';
      currentLang = navLang.startsWith('zh') ? 'zh' : 'en';
    }
    applyLang();
    bindToggle();
  }

  /* ─── 加载翻译数据 ─── */
  function loadTranslations(callback) {
    if (translations) { callback(translations); return; }

    Promise.all([
      fetch('data/i18n.json').then(res => res.json()).catch(() => null),
      fetch('data/project-pages-i18n.json').then(res => res.json()).catch(() => null)
    ])
      .then(([mainData, projectData]) => {
        if (!mainData) {
          console.warn('[i18n] Failed to load main translations, using defaults.');
          callback(null);
          return;
        }

        /* v2 格式（每个叶子含 en/zh）→ 逆转为 v1 嵌套格式 { en: {...}, zh: {...} } */
        function toNested(source, target, prefix) {
          if (!source || typeof source !== 'object') return;
          if ('en' in source && 'zh' in source && typeof source.en === 'string') {
            setNestedValue(target.en, prefix, source.en);
            setNestedValue(target.zh, prefix, source.zh);
          } else {
            Object.keys(source).forEach(k => {
              if (k.startsWith('_')) return;
              toNested(source[k], target, prefix ? prefix + '.' + k : k);
            });
          }
        }

        function setNestedValue(obj, path, value) {
          const keys = path.split('.');
          let cur = obj;
          for (let i = 0; i < keys.length - 1; i++) {
            if (!cur[keys[i]]) cur[keys[i]] = {};
            cur = cur[keys[i]];
          }
          cur[keys[keys.length - 1]] = value;
        }

        translations = { en: {}, zh: {} };
        toNested(mainData, translations, '');
        if (projectData) toNested(projectData, translations, '');
        callback(translations);
      })
      .catch(() => {
        console.warn('[i18n] Failed to load translations, using defaults.');
        callback(null);
      });
  }

  /* ─── 应用语言 ─── */
  function applyLang() {
    loadTranslations(t => {
      if (!t) return;

      const dict = t[currentLang];
      if (!dict) return;

      /* 更新 html lang 属性 */
      document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';

      /* 更新 document title */
      if (dict.site && dict.site.title) {
        document.title = dict.site.title;
      }
      if (dict.site && dict.site.description) {
        const meta = document.querySelector('meta[name="description"]');
        if (meta) meta.setAttribute('content', dict.site.description);
      }

      /* 遍历所有 [data-i18n] 元素 */
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const value = getNestedValue(dict, key);
        if (value !== undefined) {
          el.textContent = value;
        }
      });

      /* 遍历所有 [data-i18n-placeholder] 元素（表单占位符） */
      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const value = getNestedValue(dict, key);
        if (value !== undefined) {
          el.setAttribute('placeholder', value);
        }
      });

      /* 遍历所有 [data-i18n-aria-label] 元素（无障碍标签） */
      document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
        const key = el.getAttribute('data-i18n-aria-label');
        const value = getNestedValue(dict, key);
        if (value !== undefined) {
          el.setAttribute('aria-label', value);
        }
      });

      /* 触发自定义事件，供其他模块（如 project-loader）监听 */
      document.dispatchEvent(new CustomEvent('i18n:changed', { detail: { lang: currentLang, dict } }));
    });
  }

  /* ─── 切换语言 ─── */
function toggleLang() {
  currentLang = currentLang === 'zh' ? 'en' : 'zh';
  try {
    localStorage.setItem(STORAGE_KEY, currentLang);
  } catch (e) {
    console.warn('[i18n] localStorage write failed');
  }
  applyLang();
}

  /* ─── 绑定切换按钮 ─── */
  function bindToggle() {
    /* 支持多个切换按钮，防止重复绑定 */
    document.querySelectorAll('[data-i18n-toggle]').forEach(btn => {
      if (btn.dataset.i18nBound) return;
      btn.dataset.i18nBound = '1';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleLang();
      });
    });

    /* 监听动态 DOM 变化（SPA 场景） */
    const observer = new MutationObserver(() => {
      document.querySelectorAll('[data-i18n-toggle]:not([data-i18n-bound])').forEach(btn => {
        btn.dataset.i18nBound = '1';
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          toggleLang();
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  /* ─── 辅助：取嵌套对象值 ─── */
  function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, part) => {
      if (acc === null || acc === undefined) return undefined;
      return acc[part];
    }, obj);
  }

  /* ─── 暴露 API ─── */
  window.i18n = {
    getLang: () => currentLang,
    toggle: toggleLang,
    apply: applyLang,
    get: (key) => {
      if (!translations || !translations[currentLang]) return undefined;
      return getNestedValue(translations[currentLang], key);
    }
  };

  /* ─── DOM 就绪后启动 ─── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
