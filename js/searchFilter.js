import { state } from './state.js';

export function filterSnippets() {
  const query = state.searchQuery.trim().toLowerCase();
  const category = state.activeCategory;
  const bookmarksOnly = state.bookmarksOnly;
  const selectedTags = state.selectedTags;

  let results = state.snippets.filter(snippet => {
    // Category check
    if (category !== 'All' && snippet.category !== category) {
      return false;
    }

    // Bookmarks check
    if (bookmarksOnly && !state.bookmarkedIds.has(snippet.id)) {
      return false;
    }

    // Selected Tags check (AND logic for tags)
    if (selectedTags.size > 0) {
      const snippetTags = (snippet.tags || []).map(t => t.toLowerCase());
      for (const tag of selectedTags) {
        if (!snippetTags.includes(tag.toLowerCase())) {
          return false;
        }
      }
    }

    // Search query check
    if (query) {
      const matchTitle = snippet.title.toLowerCase().includes(query);
      const matchCode = snippet.code.toLowerCase().includes(query);
      const matchDesc = (snippet.explanation || '').toLowerCase().includes(query);
      const matchCategory = snippet.category.toLowerCase().includes(query);
      const matchTags = (snippet.tags || []).some(t => t.toLowerCase().includes(query));

      if (!matchTitle && !matchCode && !matchDesc && !matchCategory && !matchTags) {
        return false;
      }
    }

    return true;
  });

  // Sort
  if (state.sortBy === 'title') {
    results.sort((a, b) => a.title.localeCompare(b.title));
  } else if (state.sortBy === 'category') {
    results.sort((a, b) => {
      const catComp = a.category.localeCompare(b.category);
      if (catComp !== 0) return catComp;
      return a.title.localeCompare(b.title);
    });
  }

  state.filteredSnippets = results;
  return results;
}

export function computeCategoryCounts() {
  const counts = { All: state.snippets.length };
  
  for (const snippet of state.snippets) {
    const cat = snippet.category;
    counts[cat] = (counts[cat] || 0) + 1;
  }
  
  return counts;
}

export function computeTopTags(limit = 12) {
  const frequency = {};
  for (const snippet of state.snippets) {
    for (const tag of snippet.tags || []) {
      const t = tag.toLowerCase();
      frequency[t] = (frequency[t] || 0) + 1;
    }
  }

  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(entry => entry[0]);
}
