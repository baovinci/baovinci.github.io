/*
 * ============================================================================
 * 文件名称：main.js
 * 文件用途：入口脚本 — 全局初始化 / DOM Ready 协调
 * 管理内容：
 *   - 全局错误处理
 *   - 图片加载失败优雅降级
 *   - 全局事件绑定
 * 修改入口：
 *   - 添加新的全局初始化逻辑在 DOMContentLoaded 中追加
 * 注意事项：
 *   - 此文件应在所有其他 JS 文件之前 / 同时加载
 *   - 不做具体的业务逻辑（交给对应的模块 JS）
 * ============================================================================
 */

/*
 * ====================================================================
 * 全局图片加载失败降级
 * 所有 <img onerror="..."> 未覆盖的图片统一处理
 * ====================================================================
 */
document.addEventListener('DOMContentLoaded', () => {
  /* 全局错误图片隐藏 */
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
      /* 如果图片已有 onerror 内联处理，不重复 */
      if (this.hasAttribute('data-error-handled')) return;
      this.setAttribute('data-error-handled', '1');
      this.style.display = 'none';

      /* 如果父级是 .project-card__img-wrap，设置背景色 */
      const parent = this.parentElement;
      if (parent && parent.classList.contains('project-card__img-wrap')) {
        parent.style.background = 'var(--bg-tertiary)';
      }
    });
  });

  /* 技术栈横向滚动行箭头绑定 */
  document.querySelectorAll('.tools-row-wrap').forEach(wrap => {
    const row = wrap.querySelector('.tools-row');
    const prevBtn = wrap.querySelector('.tools-row__btn--prev');
    const nextBtn = wrap.querySelector('.tools-row__btn--next');
    if (!row) return;
    const step = 120 * 3; /* 每次滚动约 3 个卡片宽度 */
    prevBtn?.addEventListener('click', () => row.scrollBy({ left: -step, behavior: 'smooth' }));
    nextBtn?.addEventListener('click', () => row.scrollBy({ left: step, behavior: 'smooth' }));
  });

  /* 项目详情页滚动进度点高亮 */
  initSectionProgress();

  /* 打印加载状态 */
  console.log('[Bao Vinci] V3 portfolio initialized.');
});

/*
 * ====================================================================
 * 项目详情页 section-progress 滚动联动
 * - 根据当前可见的 .project-section 高亮对应圆点
 * - 点击圆点平滑滚动到对应章节
 * ====================================================================
 */
function initSectionProgress() {
  const progress = document.querySelector('.section-progress');
  const sections = document.querySelectorAll('.project-section');
  if (!progress || sections.length === 0) return;

  const dots = progress.querySelectorAll('.section-progress__dot');
  if (dots.length !== sections.length) {
    console.warn('[section-progress] dot count (%d) does not match section count (%d)', dots.length, sections.length);
  }

  /* 点击圆点滚动到对应章节 */
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      const target = sections[idx];
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* 使用 IntersectionObserver 检测当前章节 */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = Array.from(sections).indexOf(entry.target);
        dots.forEach(d => d.classList.remove('active'));
        if (dots[idx]) dots[idx].classList.add('active');
      }
    });
  }, {
    rootMargin: '-40% 0px -40% 0px',
    threshold: 0
  });

  sections.forEach(section => observer.observe(section));
}

/*
 * ====================================================================
 * 全局未捕获错误处理（仅控制台记录，不向用户暴露）
 * ====================================================================
 */
window.addEventListener('error', (e) => {
  /* 仅记录资源加载错误，不影响页面使用 */
  if (e.target && e.target.tagName === 'IMG') {
    console.warn('[asset] Image failed to load:', e.target.src);
  }
});
