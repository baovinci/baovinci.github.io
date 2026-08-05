/*
 * ============================================================================
 * 文件名称：three-model.js
 * 文件用途：Three.js 3D 模型展示（按需加载）
 * 管理内容：
 *   - 轻量级初始化入口
 *   - 预留 Three.js CDN 动态加载
 *   - 占位容器检测
 * 修改入口：
 *   - 添加 3D 模型展示：在 HTML 中添加 <div id="model-viewer" data-model-src="...">
 *     并在 projects.json 中配置 model 字段
 * 注意事项：
 *   - Three.js 库体积较大，仅在需要时动态加载
 *   - 当前版本不默认加载 Three.js，仅保留架构入口
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const viewer = document.getElementById('model-viewer');

  if (!viewer) return;

  /*
   * 如果页面有 3D 模型容器，此文件可接入 Three.js
   * 示例接入方式：
   *
   *   const modelSrc = viewer.dataset.modelSrc;
   *   // 动态加载 Three.js CDN
   *   const script = document.createElement('script');
   *   script.src = 'https://unpkg.com/three@0.160.0/build/three.min.js';
   *   script.onload = () => { ...初始化场景... };
   *   document.head.appendChild(script);
   *
   * 当前版本不默认启用 Three.js，以保持页面加载速度。
   */

  console.log('[three-model] 3D model viewer detected but not initialized. Add Three.js CDN and init code to enable.');
});
