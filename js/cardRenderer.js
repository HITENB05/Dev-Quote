import { getIcon } from './icons.js';
import { copyToClipboard } from './clipboard.js';
import { state, toggleBookmark, toggleFlip } from './state.js';

function getLanguagePrefix(lang) {
  switch (lang) {
    case 'bash':
    case 'docker':
      return '$';
    case 'javascript':
    case 'typescript':
      return '>';
    case 'sql':
      return '--';
    case 'css':
      return '/*';
    case 'regex':
      return 'r/';
    default:
      return '>';
  }
}

export function renderCard(snippet, onBookmarkToggle, onFlipToggle) {
  const isFlipped = state.flippedCardIds.has(snippet.id);
  const isBookmarked = state.bookmarkedIds.has(snippet.id);

  const wrapper = document.createElement('div');
  wrapper.className = `snippet-card-wrapper ${isFlipped ? 'flipped' : ''}`;
  wrapper.id = `card-${snippet.id}`;
  wrapper.setAttribute('data-id', snippet.id);

  const card = document.createElement('div');
  card.className = 'snippet-card';

  // Front Face
  const frontFace = document.createElement('div');
  frontFace.className = 'card-face card-face-front';

  const tagsHtml = (snippet.tags || [])
    .slice(0, 4)
    .map(tag => `<span class="card-tag-badge">#${escapeHtml(tag)}</span>`)
    .join('');

  frontFace.innerHTML = `
    <div>
      <div class="card-header">
        <span class="category-tag" data-cat="${escapeHtml(snippet.category)}">
          <span class="cat-indicator"></span>
          ${escapeHtml(snippet.category)}
        </span>
        <div class="card-top-actions">
          <button class="btn-icon ${isBookmarked ? 'bookmarked' : ''}" 
                  id="bm-${snippet.id}" 
                  title="${isBookmarked ? 'Remove bookmark' : 'Bookmark snippet'}" 
                  aria-label="Bookmark snippet">
            ${isBookmarked ? getIcon('bookmarkFilled') : getIcon('bookmark')}
          </button>
        </div>
      </div>

      <h3 class="card-title">${escapeHtml(snippet.title)}</h3>
    </div>

    <div class="code-container" title="Click Copy button below to copy snippet">
      <span class="code-prefix">${getLanguagePrefix(snippet.language)}</span>
      <code class="code-content">${escapeHtml(snippet.code)}</code>
    </div>

    <div class="card-footer">
      <div class="card-tags">
        ${tagsHtml}
      </div>
      <div class="card-action-bar">
        <button class="btn-copy-code" id="copy-${snippet.id}" aria-label="Copy code to clipboard">
          <span class="btn-copy-icon">${getIcon('copy')}</span>
          <span class="btn-copy-text">Copy</span>
        </button>
        <button class="btn-flip-card" id="flip-${snippet.id}" aria-label="Flip card for technical details">
          <span>Details</span>
          ${getIcon('flip')}
        </button>
      </div>
    </div>
  `;

  // Back Face
  const backFace = document.createElement('div');
  backFace.className = 'card-face card-face-back';

  let variationsHtml = '';
  if (snippet.variations && snippet.variations.length > 0) {
    const list = snippet.variations.map(v => `
      <div class="variation-item">
        <span class="variation-label">${escapeHtml(v.label)}</span>
        <code class="variation-code">${escapeHtml(v.code)}</code>
      </div>
    `).join('');

    variationsHtml = `
      <div class="variations-list">
        <div class="back-title">Alternative Flags</div>
        ${list}
      </div>
    `;
  }

  let caveatHtml = '';
  if (snippet.caveat || snippet.tip) {
    const caveatText = snippet.caveat || snippet.tip;
    caveatHtml = `
      <div class="caveat-box">
        <strong>Caution:</strong> ${escapeHtml(caveatText)}
      </div>
    `;
  }

  const authorName = snippet.author?.name || 'Dev Community';
  const authorGithub = snippet.author?.github ? `https://github.com/${snippet.author.github}` : '#';

  backFace.innerHTML = `
    <div>
      <div class="back-header">
        <span class="back-title">Technical Breakdown</span>
        <button class="btn-flip-card" id="flip-back-${snippet.id}" aria-label="Flip back to front">
          <span>Back to Code</span>
          ${getIcon('flip')}
        </button>
      </div>

      <div class="back-body">
        <p class="explanation-text">${escapeHtml(snippet.explanation)}</p>
        ${caveatHtml}
        ${variationsHtml}
      </div>
    </div>

    <div class="back-footer">
      <span class="card-tag-badge">${escapeHtml(snippet.category)}</span>
      <a href="${authorGithub}" target="_blank" rel="noopener noreferrer" class="author-link" title="Author profile">
        <span>${escapeHtml(authorName)}</span>
        ${getIcon('externalLink')}
      </a>
    </div>
  `;

  card.appendChild(frontFace);
  card.appendChild(backFace);
  wrapper.appendChild(card);

  // Event Listeners
  const copyBtn = frontFace.querySelector(`#copy-${snippet.id}`);
  copyBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    const success = await copyToClipboard(snippet.code);
    if (success) {
      copyBtn.classList.add('copied');
      copyBtn.querySelector('.btn-copy-icon').innerHTML = getIcon('check');
      copyBtn.querySelector('.btn-copy-text').textContent = 'Copied';
      setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyBtn.querySelector('.btn-copy-icon').innerHTML = getIcon('copy');
        copyBtn.querySelector('.btn-copy-text').textContent = 'Copy';
      }, 2000);
    }
  });

  const bmBtn = frontFace.querySelector(`#bm-${snippet.id}`);
  bmBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleBookmark(snippet.id);
    if (onBookmarkToggle) onBookmarkToggle(snippet.id);
  });

  const flipBtn = frontFace.querySelector(`#flip-${snippet.id}`);
  flipBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFlip(snippet.id);
    wrapper.classList.toggle('flipped');
    if (onFlipToggle) onFlipToggle(snippet.id);
  });

  const flipBackBtn = backFace.querySelector(`#flip-back-${snippet.id}`);
  flipBackBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFlip(snippet.id);
    wrapper.classList.toggle('flipped');
    if (onFlipToggle) onFlipToggle(snippet.id);
  });

  return wrapper;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
