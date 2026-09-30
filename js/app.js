import { state, toggleBookmark, toggleFlip } from './state.js';
import { renderCard } from './cardRenderer.js';
import { filterSnippets, computeCategoryCounts, computeTopTags } from './searchFilter.js';
import { getIcon } from './icons.js';
import bundledSnippets from '../data/snippets.json';

// DOM Elements
const searchInput = document.getElementById('search-input');
const btnClearSearch = document.getElementById('btn-clear-search');
const categoryTabs = document.getElementById('category-tabs');
const tagsBar = document.getElementById('tags-bar');
const cardGrid = document.getElementById('card-grid');
const resultsCount = document.getElementById('results-count');
const sortSelect = document.getElementById('sort-select');
const btnBookmarksToggle = document.getElementById('btn-bookmarks-toggle');
const totalSnippetsCount = document.getElementById('total-snippets-count');

async function init() {
  if (Array.isArray(bundledSnippets) && bundledSnippets.length > 0) {
    state.snippets = bundledSnippets;
  } else {
    try {
      const res = await fetch('./data/snippets.json');
      if (res.ok) {
        state.snippets = await res.json();
      }
    } catch (err) {
      console.warn('Fallback fetch failed:', err);
      state.snippets = [];
    }
  }

  // Extract unique categories
  const catSet = new Set(['All']);
  state.snippets.forEach(s => catSet.add(s.category));
  state.categories = Array.from(catSet);

  if (totalSnippetsCount) {
    totalSnippetsCount.textContent = `${state.snippets.length} Verified Snippets`;
  }

  renderCategoryTabs();
  renderTagsBar();
  bindEvents();
  applyFiltersAndRender();
}

function renderCategoryTabs() {
  if (!categoryTabs) return;

  const counts = computeCategoryCounts();
  categoryTabs.innerHTML = '';

  state.categories.forEach(category => {
    const count = counts[category] || 0;
    const btn = document.createElement('button');
    btn.className = `category-btn ${state.activeCategory === category ? 'active' : ''}`;
    btn.id = `cat-${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    
    // Category indicator color dot
    const indicator = document.createElement('span');
    indicator.className = 'cat-indicator';
    if (category !== 'All') {
      indicator.setAttribute('data-cat', category);
    }

    const label = document.createElement('span');
    label.textContent = category;

    const countBadge = document.createElement('span');
    countBadge.className = 'cat-count';
    countBadge.textContent = count;

    btn.appendChild(indicator);
    btn.appendChild(label);
    btn.appendChild(countBadge);

    btn.addEventListener('click', () => {
      state.activeCategory = category;
      updateActiveCategoryTab();
      applyFiltersAndRender();
    });

    categoryTabs.appendChild(btn);
  });
}

function updateActiveCategoryTab() {
  const buttons = categoryTabs.querySelectorAll('.category-btn');
  buttons.forEach(btn => {
    const categoryName = btn.querySelector('span:nth-child(2)')?.textContent;
    if (categoryName === state.activeCategory) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function renderTagsBar() {
  if (!tagsBar) return;

  const topTags = computeTopTags(14);
  tagsBar.innerHTML = `<span class="tag-label">Tags:</span>`;

  topTags.forEach(tag => {
    const isSelected = state.selectedTags.has(tag);
    const pill = document.createElement('button');
    pill.className = `tag-pill ${isSelected ? 'active' : ''}`;
    pill.textContent = `#${tag}`;

    pill.addEventListener('click', () => {
      if (state.selectedTags.has(tag)) {
        state.selectedTags.delete(tag);
        pill.classList.remove('active');
      } else {
        state.selectedTags.add(tag);
        pill.classList.add('active');
      }
      applyFiltersAndRender();
    });

    tagsBar.appendChild(pill);
  });
}

function applyFiltersAndRender() {
  const filtered = filterSnippets();

  if (resultsCount) {
    const total = state.snippets.length;
    const current = filtered.length;
    resultsCount.textContent = `Showing ${current} of ${total} snippets`;
  }

  cardGrid.innerHTML = '';

  if (filtered.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.innerHTML = `
      <div class="empty-state-icon">${getIcon('search')}</div>
      <h4 class="empty-state-title">No Matching Snippets Found</h4>
      <p class="empty-state-desc">Try clearing your filters or search for another keyword like "git", "docker", "ports", or "css".</p>
      <button class="btn-header" id="btn-reset-filters" style="margin-top: 0.5rem;">
        Clear All Filters
      </button>
    `;

    cardGrid.appendChild(emptyState);

    emptyState.querySelector('#btn-reset-filters')?.addEventListener('click', () => {
      resetAllFilters();
    });
    return;
  }

  filtered.forEach(snippet => {
    const cardEl = renderCard(snippet, 
      () => {
        // onBookmarkToggle
        if (state.bookmarksOnly) {
          applyFiltersAndRender();
        } else {
          // Update bookmark button appearance
          const btn = document.getElementById(`bm-${snippet.id}`);
          if (btn) {
            const isBm = state.bookmarkedIds.has(snippet.id);
            btn.classList.toggle('bookmarked', isBm);
            btn.innerHTML = isBm ? getIcon('bookmarkFilled') : getIcon('bookmark');
          }
        }
      },
      () => {
        // onFlipToggle
      }
    );
    cardGrid.appendChild(cardEl);
  });
}

function resetAllFilters() {
  state.searchQuery = '';
  state.activeCategory = 'All';
  state.selectedTags.clear();
  state.bookmarksOnly = false;
  
  if (searchInput) searchInput.value = '';
  if (btnClearSearch) btnClearSearch.style.display = 'none';
  if (btnBookmarksToggle) btnBookmarksToggle.classList.remove('active');

  updateActiveCategoryTab();
  renderTagsBar();
  applyFiltersAndRender();
}

function bindEvents() {
  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      if (btnClearSearch) {
        btnClearSearch.style.display = state.searchQuery ? 'flex' : 'none';
      }
      applyFiltersAndRender();
    });
  }

  if (btnClearSearch) {
    btnClearSearch.addEventListener('click', () => {
      state.searchQuery = '';
      searchInput.value = '';
      btnClearSearch.style.display = 'none';
      searchInput.focus();
      applyFiltersAndRender();
    });
  }

  // Sort dropdown
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      applyFiltersAndRender();
    });
  }

  // Bookmarks Only toggle
  if (btnBookmarksToggle) {
    btnBookmarksToggle.addEventListener('click', () => {
      state.bookmarksOnly = !state.bookmarksOnly;
      btnBookmarksToggle.classList.toggle('active', state.bookmarksOnly);
      applyFiltersAndRender();
    });
  }

  // Keyboard shortcuts
  window.addEventListener('keydown', (e) => {
    // Cmd+K or Ctrl+K or '/' to focus search
    if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && document.activeElement !== searchInput && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA')) {
      e.preventDefault();
      searchInput?.focus();
      searchInput?.select();
    }

    // Escape clears search
    if (e.key === 'Escape') {
      if (state.searchQuery) {
        state.searchQuery = '';
        if (searchInput) searchInput.value = '';
        if (btnClearSearch) btnClearSearch.style.display = 'none';
        applyFiltersAndRender();
      }
    }
  });
}

// Start application
document.addEventListener('DOMContentLoaded', init);
