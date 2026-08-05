/*
 * ============================================================================
 * 文件名称：animation.js
 * 文件用途：滚动触发入场动画 — Intersection Observer
 * 管理内容：
 *   - .animate-in 元素滚动入场监听
 *   - 各区块淡入延迟管理
 *   - 单次触发（once: true）
 * 修改入口：
 *   - 调整触发阈值：修改 observer 的 threshold 参数
 *   - 新增动画元素：在 HTML 中添加 .animate-in 类
 * 注意事项：
 *   - 需要 animation.css 配合提供 .animate-in / .visible 样式
 *   - 使用 Intersection Observer API，低版本浏览器需 polyfill
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll('.animate-in');

  if (animatedElements.length === 0) return;

  /* Intersection Observer：元素进入视口 15% 时触发 */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        /* 单次触发 */
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  animatedElements.forEach(el => observer.observe(el));
});
