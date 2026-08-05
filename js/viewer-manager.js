/*
 * ============================================================================
 * 文件名称：viewer-manager.js
 * 文件用途：媒体查看器管理 — 灯箱 / 画廊切换 / 视频播放器
 * 管理内容：
 *   - Lightbox 灯箱（键盘导航 / 触摸滑动 / 组导航）
 *   - Gallery 画廊（缩略图点击切换主图）
 *   - Video 播放器（自定义播放覆盖层）
 *   - 自动绑定：data-lightbox 属性标记的图片 / .gallery 画廊
 * 修改入口：
 *   - 调整灯箱动画：修改 CSS .lightbox 过渡属性
 *   - 新增触发方式：在 HTML 中给图片容器添加 data-lightbox
 * 注意事项：
 *   - 需要 project-page.css 中的 .lightbox 样式
 *   - 需要 components.css 中的 .gallery / .video-player 样式
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initLightbox();
  initGalleries();
  initVideoPlayers();
});

/*
 * ====================================================================
 * Lightbox 灯箱
 * ====================================================================
 */
function initLightbox() {
  /* 创建灯箱 DOM */
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <button class="lightbox__close" aria-label="Close lightbox">&times;</button>
    <button class="lightbox__nav lightbox__nav--prev" aria-label="Previous image">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
    <button class="lightbox__nav lightbox__nav--next" aria-label="Next image">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
    </button>
    <img class="lightbox__img" src="" alt="">
    <div class="lightbox__caption"></div>
  `;
  document.body.appendChild(lightbox);

  const img   = lightbox.querySelector('.lightbox__img');
  const cap   = lightbox.querySelector('.lightbox__caption');
  const close = lightbox.querySelector('.lightbox__close');
  const prev  = lightbox.querySelector('.lightbox__nav--prev');
  const next  = lightbox.querySelector('.lightbox__nav--next');

  let currentGroup = [];
  let currentIndex = 0;

  function open(src, alt, group) {
    currentGroup = group || [src];
    currentIndex = currentGroup.indexOf(src);
    if (currentIndex === -1) currentIndex = 0;

    img.src = currentGroup[currentIndex] || src;
    img.alt = alt || '';
    cap.textContent = alt || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';

    /* 多条导航才显示 */
    if (currentGroup.length <= 1) {
      prev.style.display = 'none';
      next.style.display = 'none';
    } else {
      prev.style.display = '';
      next.style.display = '';
    }
  }

  function closeLB() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    /* 延迟清除图片，避免过渡闪烁 */
    setTimeout(() => { img.src = ''; }, 300);
  }

  function navigate(direction) {
    currentIndex += direction;
    if (currentIndex < 0) currentIndex = currentGroup.length - 1;
    if (currentIndex >= currentGroup.length) currentIndex = 0;
    img.src = currentGroup[currentIndex];
  }

  /* 事件绑定 */
  close.addEventListener('click', closeLB);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLB();
  });
  prev.addEventListener('click', () => navigate(-1));
  next.addEventListener('click', () => navigate(1));

  /* 键盘导航 */
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')   { e.preventDefault(); closeLB(); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); navigate(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); navigate(1); }
  });

  /* 绑定所有 data-lightbox 元素 */
  document.querySelectorAll('[data-lightbox]').forEach(container => {
    /* 如果是图片容器，收集内部图片 */
    const imgs = container.querySelectorAll('img');
    if (imgs.length === 0) return;

    const group = [];
    imgs.forEach(i => group.push(i.src));

    container.addEventListener('click', (e) => {
      const targetImg = e.target.closest('img');
      if (!targetImg || !targetImg.src) return;
      open(targetImg.src, targetImg.alt || '', group);
    });

    /* 设置可点击光标 */
    container.style.cursor = 'zoom-in';
  });
}

/*
 * ====================================================================
 * Gallery 画廊（缩略图切换主图）
 * ====================================================================
 */
function initGalleries() {
  document.querySelectorAll('.gallery').forEach(gallery => {
    const main   = gallery.querySelector('.gallery__main img');
    const thumbs = gallery.querySelectorAll('.gallery__thumb');
    if (!main || thumbs.length === 0) return;

    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        /* 切换主图 */
        main.src = thumb.src;
        main.alt = thumb.alt || '';

        /* 更新 active 缩略图 */
        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      });
    });

    /* 默认第一个缩略图高亮 */
    if (thumbs.length > 0) {
      thumbs[0].classList.add('active');
    }
  });
}

/*
 * ====================================================================
 * 视频播放器
 * ====================================================================
 */
function initVideoPlayers() {
  document.querySelectorAll('.video-player').forEach(player => {
    const video   = player.querySelector('video');
    const overlay = player.querySelector('.video-player__play-overlay');
    if (!video || !overlay) return;

    overlay.addEventListener('click', () => {
      overlay.classList.add('hidden');
      video.play().catch(() => {
        /* 自动播放被阻止时恢复覆盖层 */
        overlay.classList.remove('hidden');
      });
    });

    /* 播放结束后恢复覆盖层 */
    video.addEventListener('ended', () => {
      overlay.classList.remove('hidden');
    });

    /* 点击视频本身暂停/播放 */
    video.addEventListener('click', () => {
      if (video.paused) {
        video.play();
        overlay.classList.add('hidden');
      } else {
        video.pause();
        overlay.classList.remove('hidden');
      }
    });
  });
}
