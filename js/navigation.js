/*
 * ============================================================================
 * 文件名称：navigation.js
 * 文件用途：全局导航交互 — 滚动阴影 / 移动端汉堡菜单 / 导航链接滚动高亮
 * 管理内容：
 *   - nav 滚动渐显背景/阴影
 *   - 移动端汉堡菜单 toggle（< 768px）
 *   - 返回顶部按钮（< 1024px 或滚动过半屏时显示）
 *   - 桌面端 nav__link 滚动高亮
 * 修改入口：
 *   - 调整滚动触发阈值：修改 SCROLL_THRESHOLD
 *   - 修改移动端断点：在 CSS .nav__toggle 的媒体查询中调整
 * 注意事项：
 *   - 必须配合 global.css 中的 nav 样式使用
 *   - 移动端菜单需要 HTML 中已定义 #navToggle, #navLinks, #navOverlay
 * ============================================================================
 */

const SCROLL_THRESHOLD = 80;

document.addEventListener('DOMContentLoaded', () => {
  initNavScroll();
  initMobileNav();
  initBackToTop();
});

/*
 * ====================================================================
 * 导航栏滚动效果 — 背景渐入 + 阴影
 * ====================================================================
 */
function initNavScroll() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > SCROLL_THRESHOLD) {
          nav.classList.add('nav--scrolled');
        } else {
          nav.classList.remove('nav--scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  });

  /* 初始状态检查 */
  if (window.scrollY > SCROLL_THRESHOLD) {
    nav.classList.add('nav--scrolled');
  }
}

/*
 * ====================================================================
 * 移动端汉堡菜单
 * ====================================================================
 */
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  const overlay = document.getElementById('navOverlay');

  if (!toggle || !links) return;

  /* 展开/收起菜单 */
  function openMenu() {
    toggle.classList.add('active');
    links.classList.add('active');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    toggle.classList.remove('active');
    links.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.contains('active');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  /* 点击遮罩关闭 */
  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  /* 点击菜单项后自动关闭 */
  links.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      if (links.classList.contains('active')) {
        closeMenu();
      }
    });
  });

  /* ESC 关闭 */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && links.classList.contains('active')) {
      closeMenu();
    }
  });

  /* 窗口 resize 时自动关闭移动端菜单 */
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && links.classList.contains('active')) {
      closeMenu();
    }
  });
}

/*
 * ====================================================================
 * 返回顶部按钮
 * ====================================================================
 */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  /* 不显示在首页 Hero（顶部区域） */
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > window.innerHeight * 0.6) {
          btn.classList.add('visible');
        } else {
          btn.classList.remove('visible');
        }
        ticking = false;
      });
      ticking = true;
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
