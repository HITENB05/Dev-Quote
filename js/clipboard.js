import { getIcon } from './icons.js';

let toastTimeout = null;

export function showToast(message, codeSnippet = '') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  // Clear previous toast if present
  container.innerHTML = '';
  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  
  let snippetHtml = '';
  if (codeSnippet) {
    const truncated = codeSnippet.length > 28 ? codeSnippet.substring(0, 25) + '...' : codeSnippet;
    snippetHtml = `<span class="toast-code-snippet">${escapeHtml(truncated)}</span>`;
  }

  toast.innerHTML = `
    <span class="toast-icon">${getIcon('check')}</span>
    <span class="toast-message">${escapeHtml(message)}${snippetHtml}</span>
  `;

  container.appendChild(toast);

  // Trigger animation frame
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 250);
  }, 2600);
}

export async function copyToClipboard(text, customMessage = 'Copied to clipboard') {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '-9999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }
    showToast(customMessage, text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    showToast('Failed to copy to clipboard');
    return false;
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
