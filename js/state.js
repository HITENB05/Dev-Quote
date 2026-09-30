/**
 * Global state manager
 */

const STORAGE_KEY_BOOKMARKS = 'devquote_bookmarks_v1';

export const state = {
  snippets: [],
  filteredSnippets: [],
  categories: ['All'],
  activeCategory: 'All',
  searchQuery: '',
  selectedTags: new Set(),
  availableTags: [],
  sortBy: 'featured', // 'featured', 'title', 'category'
  bookmarksOnly: false,
  bookmarkedIds: new Set(loadBookmarks()),
  flippedCardIds: new Set()
};

function loadBookmarks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BOOKMARKS) || localStorage.getItem('devbites_bookmarks_v1');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveBookmarks() {
  try {
    localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify([...state.bookmarkedIds]));
  } catch (e) {
    console.error('Failed to save bookmarks to localStorage', e);
  }
}

export function toggleBookmark(id) {
  if (state.bookmarkedIds.has(id)) {
    state.bookmarkedIds.delete(id);
  } else {
    state.bookmarkedIds.add(id);
  }
  saveBookmarks();
}

export function toggleFlip(id) {
  if (state.flippedCardIds.has(id)) {
    state.flippedCardIds.delete(id);
  } else {
    state.flippedCardIds.add(id);
  }
}
