/*
 * ============================================================================
 * 文件名称：project-loader.js
 * 文件用途：项目数据加载和渲染 — 精选项目 / 领域项目列表 / Tag 分类系统
 * 管理内容：
 *   - loadProjects() 异步加载 data/projects.json
 *   - buildTagFromCategory() 统一标签分类（method / software / domain）
 *   - renderFeaturedProjects() 首页精选项目卡片
 *   - renderDomainProjects() 领域页项目列表 + 过滤
 *   - renderDomainCount() 填充领域页项目计数器
 *   - showEmptyState() 优雅空状态（替代错误提示）
 *   注意：已移除原始 showError()，不再向访客暴露调试错误
 * ============================================================================
 */

/*
 * ====================================================================
 * Tag 分类映射表
 * 统一管理所有标签的类型归属。
 * 新增标签只需在此对象中添加映射即可。
 * 注意：tag 文本需与 projects.json 中的 tags/tagsZh 保持一致（英文标签）
 * ====================================================================
 */
const TAG_CATEGORY_MAP = {
  /* ——— 方法类标签 ——— */
  'FEA':           'method',
  'Nonlinear':     'method',
  'Topology Opt':  'method',
  'Optimization':  'method',
  'Design':        'method',

  /* ——— 软件类标签 ——— */
  'ANSYS Mechanical': 'software',
  'MATLAB':        'software',
  'Abaqus':        'software',
  'SolidWorks':    'software',
  'ParaView':      'software',
  'Python':        'software',
  'C / C++':       'software',

  /* ——— 领域类标签（其他未分类标签默认为 domain） ——— */
  'Structural':    'domain',
  'Prototyping':   'domain',
};

/*
 * ====================================================================
 * 根据标签文本推断其 CSS 类别
 * 返回对应的 CSS class: 'tag--method' / 'tag--software' / 'tag--domain' / 'tag--default'
 * ====================================================================
 */
function getTagClass(tagText) {
  const category = TAG_CATEGORY_MAP[tagText.trim()] || 'domain';
  return `tag--${category}`;
}

/*
 * ====================================================================
 * 生成完整 Tag HTML
 * ====================================================================
 */
function buildTagHTML(tagText) {
  const cls = getTagClass(tagText);
  return `<span class="tag ${cls}">${escapeHTML(tagText)}</span>`;
}

/*
 * ====================================================================
 * 生成标签组 HTML
 * ====================================================================
 */
function buildTagsGroupHTML(tags) {
  if (!tags || tags.length === 0) return '';
  return `<div class="tags-group">${tags.map(t => buildTagHTML(t)).join('')}</div>`;
}

/*
 * ====================================================================
 * HTML 转义
 * ====================================================================
 */
function escapeHTML(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

/*
 * ====================================================================
 * 异步加载项目数据
 * ====================================================================
 */
async function loadProjects() {
  try {
    const resp = await fetch('data/projects.json');
    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status}`);
    }
    const data = await resp.json();
    return data.projects || [];
  } catch (err) {
    console.warn('[project-loader] Failed to load projects.json:', err.message);
    return [];
  }
}

/*
 * ====================================================================
 * 优雅空状态 — 替代 showError()
 * 不再向访客暴露 "Unable to load projects" 等调试信息
 * ====================================================================
 */
function showEmptyState(containerId, title, desc) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const i18nGet = (window.i18n && window.i18n.get) || (() => undefined);
  const titleText = title || i18nGet('domainPages.common.projectsComingSoon') || 'Projects Coming Soon';
  const descText = desc || i18nGet('domainPages.common.emptyDescFallback') || 'Engineering projects are being prepared. Check back soon for detailed case studies and technical analyses.';

  container.innerHTML = `
    <div class="empty-state">
      <svg class="empty-state__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        <path d="M13 2v3"/>
      </svg>
      <h3 class="empty-state__title">${escapeHTML(titleText)}</h3>
      <p class="empty-state__desc">${escapeHTML(descText)}</p>
    </div>
  `;
}

/*
 * ====================================================================
 * 渲染首页精选项目卡片
 * ====================================================================
 */
async function renderFeaturedProjects(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const projects = await loadProjects();

  if (projects.length === 0) {
    const i18nGet = (window.i18n && window.i18n.get) || (() => undefined);
    showEmptyState(
      containerId,
      i18nGet('domainPages.common.projectsComingSoon') || 'Projects Being Curated',
      i18nGet('projects.emptyDesc') || 'A selection of engineering projects is currently being prepared. Each project page will include detailed methodology, results, and technical insights.'
    );
    /* 同时隐藏精选区域的 section header 无意义 */
    const section = container.closest('.projects-highlight');
    if (section) {
      const header = section.querySelector('.section-header');
      if (header) header.style.display = 'none';
    }
    return;
  }

  /* 取所有精选项目；未标记精选时显示全部 */
  const featured = projects.filter(p => p.featured);
  let displayProjects = featured.length > 0 ? featured : projects;

  /* 获取当前语言 */
  const lang = (window.i18n && window.i18n.getLang && window.i18n.getLang()) || 'en';
  const isZh = lang === 'zh';

  container.innerHTML = displayProjects.map(p => {
    const title = isZh ? (p.titleZh || p.title) : (p.title || '');
    const desc = isZh ? (p.descZh || p.desc || p.description || '') : (p.desc || p.description || '');
    const tags = isZh ? (p.tagsZh || p.tags) : (p.tags || []);
    const href = p.detailPage || p.url || '#';
    const image = p.image || p.thumbnail || '';
    return `
    <a href="${href}" class="project-card--featured" data-domain="${escapeHTML(p.domain || '')}">
      <div class="project-card__img-wrap">
        <img class="project-card__img"
             src="${image}"
             alt="${escapeHTML(title)}"
             loading="lazy"
             onerror="this.style.display='none';this.parentElement.style.background='var(--bg-tertiary)'">
      </div>
      <div class="project-card__body">
        <h3 class="project-card__title">${escapeHTML(title)}</h3>
        <p class="project-card__desc">${escapeHTML(desc)}</p>
        ${buildTagsGroupHTML(tags)}
      </div>
    </a>
  `;}).join('');

  /* 初始化横向滚动轮播（箭头 + 拖拽） */
  initProjectCarousel(container);
}

/*
 * ====================================================================
 * 渲染领域页项目列表 + 领域筛选
 * ====================================================================
 */
async function renderDomainProjects(gridId, emptyStateId, domainFilter) {
  const grid = document.getElementById(gridId);
  const emptyContainer = document.getElementById(emptyStateId);
  if (!grid) return;

  const projects = await loadProjects();

  /* 过滤对应领域的项目 */
  let filtered = projects;
  if (domainFilter) {
    filtered = projects.filter(p =>
      p.domain && p.domain.toLowerCase() === domainFilter.toLowerCase()
    );
  }

  /* 无项目：显示空状态 */
  if (filtered.length === 0) {
    grid.innerHTML = '';
    if (emptyContainer) {
      const i18nGet = (window.i18n && window.i18n.get) || (() => undefined);
      emptyContainer.style.display = 'block';
      emptyContainer.querySelector('.empty-state__title').textContent =
        i18nGet('domainPages.common.projectsComingSoon') || 'Projects Coming Soon';
      const key = `domainPages.${domainFilter ? domainFilter.replace(/-/g, '') : 'common'}.emptyDesc`;
      const fallback = `New ${domainFilter ? domainFilter.replace(/-/g, ' ') : 'engineering'} projects are being documented. Check back soon for detailed case studies.`;
      emptyContainer.querySelector('.empty-state__desc').textContent = i18nGet(key) || fallback;
    }
    return;
  }

  if (emptyContainer) emptyContainer.style.display = 'none';

  /* 获取当前语言 */
  const lang = (window.i18n && window.i18n.getLang && window.i18n.getLang()) || 'en';
  const isZh = lang === 'zh';

  grid.innerHTML = filtered.map(p => {
    const title = isZh ? (p.titleZh || p.title) : (p.title || '');
    const desc = isZh ? (p.descZh || p.desc || p.description || '') : (p.desc || p.description || '');
    const tags = isZh ? (p.tagsZh || p.tags) : (p.tags || []);
    const href = p.detailPage || p.url || '#';
    const image = p.image || p.thumbnail || '';
    return `
    <a href="${href}" class="project-card--list">
      <div class="project-card__img-wrap">
        <img class="project-card__img"
             src="${image}"
             alt="${escapeHTML(title)}"
             loading="lazy"
             onerror="this.style.display='none';this.parentElement.style.background='var(--bg-tertiary)'">
      </div>
      <div class="project-card__body">
        <h3 class="project-card__title">${escapeHTML(title)}</h3>
        <p class="project-card__desc">${escapeHTML(desc)}</p>
        ${buildTagsGroupHTML(tags)}
      </div>
    </a>
  `;}).join('');

  /* 领域页 Tab 筛选逻辑 */
  setupDomainTabs(filtered, grid);
}

/*
 * ====================================================================
 * 领域页 Tab 筛选
 * ====================================================================
 */
function setupDomainTabs(allProjects, grid) {
  const tabs = document.querySelectorAll('.domain-tab');
  if (tabs.length === 0) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      /* 切换 active 状态 */
      tabs.forEach(t => {
        t.classList.remove('btn--primary');
        t.classList.add('btn--secondary');
        t.classList.remove('active');
      });
      tab.classList.remove('btn--secondary');
      tab.classList.add('btn--primary');
      tab.classList.add('active');

      const filter = tab.dataset.filter || 'all';

      let filtered;
      if (filter === 'all') {
        filtered = allProjects;
      } else {
        const filterLower = filter.toLowerCase();
        filtered = allProjects.filter(p => {
          /* 检查 tags 中是否有匹配的 */
          if (p.tags && p.tags.some(t => t.toLowerCase().includes(filterLower))) return true;
          /* 检查 subdomain 中是否有匹配的 */
          if (p.subdomain && p.subdomain.toLowerCase().includes(filterLower)) return true;
          return false;
        });
      }

      /* 用简短动画刷新列表 */
      grid.style.opacity = '0';
      grid.style.transform = 'translateY(8px)';
      grid.style.transition = 'opacity 0.2s ease-out, transform 0.2s ease-out';

      /* 获取当前语言，确保过滤后卡片也显示正确语言 */
      const lang = (window.i18n && window.i18n.getLang && window.i18n.getLang()) || 'en';
      const isZh = lang === 'zh';

      setTimeout(() => {
        grid.innerHTML = filtered.map(p => {
          const title = isZh ? (p.titleZh || p.title || '') : (p.title || '');
          const desc = isZh ? (p.descZh || p.desc || p.description || '') : (p.desc || p.description || '');
          const tags = isZh ? (p.tagsZh || p.tags) : (p.tags || []);
          return `
          <a href="${p.url || '#'}" class="project-card--list">
            <div class="project-card__img-wrap">
              <img class="project-card__img"
                   src="${p.thumbnail || ''}"
                   alt="${escapeHTML(title)}"
                   loading="lazy"
                   onerror="this.style.display='none';this.parentElement.style.background='var(--bg-tertiary)'">
            </div>
            <div class="project-card__body">
              <h3 class="project-card__title">${escapeHTML(title)}</h3>
              <p class="project-card__desc">${escapeHTML(desc)}</p>
              ${buildTagsGroupHTML(tags)}
            </div>
          </a>
        `}).join('');

        grid.style.opacity = '1';
        grid.style.transform = 'translateY(0)';
      }, 200);
    });
  });
}

/*
 * ====================================================================
 * 填充首页领域项目计数
 * ====================================================================
 */
async function renderDomainCount(elementId, domainFilter) {
  const el = document.getElementById(elementId);
  if (!el) return;

  const projects = await loadProjects();
  const count = projects.filter(p =>
    p.domain && p.domain.toLowerCase() === domainFilter.toLowerCase()
  ).length;
  el.textContent = count;
}

/*
 * ====================================================================
 * 首页精选项目轮播交互
 * 支持：左右箭头点击、鼠标拖拽、触摸滑动
 * ====================================================================
 */
function initProjectCarousel(track) {
  if (!track) return;

  const section = track.closest('.projects-highlight');
  if (!section) return;

  const nav = section.querySelector('.projects-carousel__nav');
  const prevBtn = section.querySelector('.projects-carousel__btn--prev');
  const nextBtn = section.querySelector('.projects-carousel__btn--next');

  /* 单次滚动距离 = 一张卡片宽度 + 间距，保证每次正好翻过一屏可见卡片 */
  const getScrollStep = () => {
    const card = track.querySelector('.project-card--featured');
    if (!card) return track.clientWidth;
    const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
    return card.offsetWidth + gap;
  };

  /* 使用 onclick 避免语言切换后重复绑定点击事件 */
  if (prevBtn) prevBtn.onclick = () => track.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
  if (nextBtn) nextBtn.onclick = () => track.scrollBy({ left: getScrollStep(), behavior: 'smooth' });

  /* 拖拽 / 触摸滑动只需绑定一次 */
  if (!track.dataset.carouselBound) {
    track.dataset.carouselBound = '1';
    let isDown = false, startX = 0, scrollLeft = 0;
    track.addEventListener('mousedown', (e) => {
      isDown = true; startX = e.pageX - track.offsetLeft; scrollLeft = track.scrollLeft;
      track.style.cursor = 'grabbing';
    });
    track.addEventListener('mouseleave', () => { isDown = false; track.style.cursor = 'grab'; });
    track.addEventListener('mouseup', () => { isDown = false; track.style.cursor = 'grab'; });
    track.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      track.scrollLeft = scrollLeft - (x - startX) * 1.5;
    });
    track.style.cursor = 'grab';
  }

  /* 根据是否需要横向滚动显示/隐藏箭头：桌面三列无需滚动时自动隐藏 */
  const updateNavVisibility = () => {
    if (!nav) return;
    const needsScroll = track.scrollWidth > Math.round(track.clientWidth);
    nav.style.display = needsScroll ? 'flex' : 'none';
  };

  updateNavVisibility();
  window.addEventListener('resize', updateNavVisibility);
}

/*
 * ====================================================================
 * 自启动逻辑
 * ====================================================================
 */
document.addEventListener('DOMContentLoaded', () => {
  /* 首页：精选项目 */
  const featuredGrid = document.getElementById('featuredProjects');
  if (featuredGrid) {
    renderFeaturedProjects('featuredProjects');
  }

  /* 领域页：项目列表 + 计数器 */
  const domainProjectsGrid = document.getElementById('domainProjects');

  if (domainProjectsGrid) {
    const pageDomain = getPageDomain();

    /* 渲染项目列表 */
    renderDomainProjects('domainProjects', 'emptyState', pageDomain);

    /* 填充项目计数 */
    const countEl = document.getElementById('cmProjectCount');
    if (countEl && pageDomain) {
      renderDomainCount('cmProjectCount', pageDomain);
    }
  }
});

/*
 * ====================================================================
 * 语言切换时重新渲染项目卡片（标题、描述、标签）
 * ====================================================================
 */
document.addEventListener('i18n:changed', () => {
  /* 首页精选项目 */
  const featuredGrid = document.getElementById('featuredProjects');
  if (featuredGrid) {
    renderFeaturedProjects('featuredProjects');
  }

  /* 领域页项目列表 */
  const domainProjectsGrid = document.getElementById('domainProjects');
  if (domainProjectsGrid) {
    const pageDomain = getPageDomain();
    renderDomainProjects('domainProjects', 'emptyState', pageDomain);
  }
});

/*
 * ====================================================================
 * 根据 HTML class 推断当前页面所属领域
 * ====================================================================
 */
function getPageDomain() {
  const htmlCls = document.documentElement.className;
  if (htmlCls.includes('domain--blue'))  return 'computational-mechanics';
  if (htmlCls.includes('domain--gold'))  return 'mechanical-design';
  if (htmlCls.includes('domain--purple')) return 'intelligent-engineering';
  return null;
}
