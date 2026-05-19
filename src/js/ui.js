'use strict';

// ============================================
// ui.js - DOM manipulation & rendering helpers
// Demonstrates: DOM manipulation (createElement, appendChild,
//   querySelector), template literals, arrow functions,
//   events, Observer API (IntersectionObserver)
// ============================================
// ui.js - Verantwoordelijk voor alle DOM rendering
// Bevat: kaart rendering, paginatie, modal, toast meldingen
// en Observer API implementatie voor animaties

import { isFavorite, toggleFavorite } from './storage.js';

// ---- Toast notification ----

let toastTimer = null;

/**
 * Show a brief toast message
 * Demonstrates: DOM manipulation, template literals, setTimeout callback
 */
export const showToast = (message, duration = 2500) => {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.classList.remove('hidden');

  // Clear previous timer if any (callback pattern)
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('hidden'), duration);
};

// ---- Loader helpers ----

export const showLoader = (id) => document.querySelector(`#loader-${id}`)?.classList.remove('hidden');
export const hideLoader = (id) => document.querySelector(`#loader-${id}`)?.classList.add('hidden');

// ---- Status dot helper ----

const statusDot = (status) => {
  const normalized = status.toLowerCase();
  return `<span class="status-dot ${normalized}"></span>`;
};

// ---- Character Cards ----

/**
 * Render a single character card
 * Demonstrates: template literals, DOM createElement, events, ternary operator
 */
export const renderCharacterCard = (character, onCardClick, onFavChange) => {
  const card = document.createElement('div');
  card.className = 'char-card';
  card.dataset.id = character.id;

  const favorited = isFavorite(character.id);

  // Template literal for inner HTML - demonstrates template literals
  card.innerHTML = `
    <span class="card-id">#${character.id}</span>
    <img src="${character.image}" alt="${character.name}" loading="lazy" />
    <button class="fav-btn ${favorited ? 'active' : ''}" title="${favorited ? 'Remove from favourites' : 'Add to favourites'}">
      ${favorited ? '⭐' : '☆'}
    </button>
    <div class="card-body">
      <p class="card-name">${character.name}</p>
      <div class="card-meta">
        <span>${statusDot(character.status)} ${character.status} – ${character.species}</span>
        <span>🌍 ${character.location.name}</span>
        <span>🎬 ${character.episode.length} episode${character.episode.length !== 1 ? 's' : ''}</span>
        <span>⚧ ${character.gender}</span>
        <span>🔬 Origin: ${character.origin.name}</span>
        <span>📅 Created: ${new Date(character.created).toLocaleDateString('nl-BE')}</span>
      </div>
    </div>
  `;

  // Event: click card to open detail modal
  card.addEventListener('click', (e) => {
    if (!e.target.closest('.fav-btn')) onCardClick(character);
  });

  // Event: click fav button
  const favBtn = card.querySelector('.fav-btn');
  favBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const added = toggleFavorite(character);
    favBtn.textContent = added ? '⭐' : '☆';
    favBtn.classList.toggle('active', added);
    showToast(added ? `⭐ ${character.name} added to favourites!` : `Removed ${character.name} from favourites`);
    if (onFavChange) onFavChange();
  });

  return card;
};

// ---- Episode Cards ----

export const renderEpisodeCard = (episode) => {
  const card = document.createElement('div');
  card.className = 'ep-card';

  // Extract season from episode code e.g. "S01E01"
  const season = episode.episode.slice(0, 3);
  const epNum  = episode.episode.slice(3);

  card.innerHTML = `
    <span class="ep-code">${season} ${epNum}</span>
    <p class="ep-name">${episode.name}</p>
    <p class="ep-date">📅 ${episode.air_date}</p>
    <p class="ep-chars">👥 ${episode.characters.length} character${episode.characters.length !== 1 ? 's' : ''} in this episode</p>
  `;

  return card;
};

// ---- Location Cards ----

export const renderLocationCard = (location) => {
  const card = document.createElement('div');
  card.className = 'loc-card';

  card.innerHTML = `
    <p class="loc-name">${location.name}</p>
    <span class="loc-type">${location.type}</span>
    <p class="loc-dimension">🌀 ${location.dimension}</p>
    <p class="loc-residents">👥 ${location.residents.length} known resident${location.residents.length !== 1 ? 's' : ''}</p>
  `;

  return card;
};

// ---- "No results" placeholder ----

export const renderNoResults = (container, message = 'No results found') => {
  container.innerHTML = `
    <div class="no-results">
      <span>🔭</span>
      <p>${message}</p>
    </div>
  `;
};

// ---- Pagination ----

/**
 * Render pagination buttons
 * Demonstrates: array iteration, arrow functions, events, DOM manipulation
 */
export const renderPagination = (container, { current, total }, onPageChange) => {
  container.innerHTML = '';
  if (total <= 1) return;

  const createBtn = (label, page, disabled = false, active = false) => {
    const btn = document.createElement('button');
    btn.className = `page-btn${active ? ' active' : ''}`;
    btn.textContent = label;
    btn.disabled = disabled;
    btn.addEventListener('click', () => onPageChange(page));
    return btn;
  };

  container.appendChild(createBtn('← Prev', current - 1, current === 1));

  // Show limited page numbers with ellipsis
  const pages = buildPageRange(current, total);
  pages.forEach(p => {
    if (p === '...') {
      const ellipsis = document.createElement('span');
      ellipsis.textContent = '…';
      ellipsis.style.cssText = 'padding: 0.5rem; color: var(--text-muted);';
      container.appendChild(ellipsis);
    } else {
      container.appendChild(createBtn(p, p, false, p === current));
    }
  });

  container.appendChild(createBtn('Next →', current + 1, current === total));
};

// Helper: generate page range with ellipsis
const buildPageRange = (current, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = [1];
  if (current > 3) pages.push('...');

  const start = Math.max(2, current - 1);
  const end   = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push('...');
  pages.push(total);

  return pages;
};

// ---- Character detail modal content ----

export const renderCharacterModal = (character) => `
  <div class="modal-char">
    <img src="${character.image}" alt="${character.name}" />
    <div class="modal-info">
      <h2>${character.name}</h2>
      <table>
        <tr><td>Status</td><td>${statusDot(character.status)} ${character.status}</td></tr>
        <tr><td>Species</td><td>${character.species}</td></tr>
        <tr><td>Type</td><td>${character.type || '–'}</td></tr>
        <tr><td>Gender</td><td>${character.gender}</td></tr>
        <tr><td>Origin</td><td>${character.origin.name}</td></tr>
        <tr><td>Location</td><td>${character.location.name}</td></tr>
        <tr><td>Created</td><td>${new Date(character.created).toLocaleDateString('nl-BE')}</td></tr>
        <tr><td>Episodes</td><td>${character.episode.length} appearances</td></tr>
      </table>
    </div>
  </div>
  <div class="modal-episodes">
    <h3>Appears in episodes:</h3>
    <div class="ep-tags">
      ${character.episode.map(url => {
        const num = url.split('/').pop();
        return `<span class="ep-tag">EP ${num}</span>`;
      }).join('')}
    </div>
  </div>
`;

// ---- IntersectionObserver for lazy image animation ----
// Demonstrates: Observer API

export const initCardObserver = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '50px' });

  return observer;
};
