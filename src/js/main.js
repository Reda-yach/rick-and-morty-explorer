'use strict';

// ============================================
// main.js - Application entry point
// Demonstrates: ALL required JS concepts:
//   const, let, arrow functions, template literals,
//   array methods, async/await, Promises, callbacks,
//   DOM manipulation, events, Observer API,
//   localStorage, ternary operator, for...of, fetch
// ============================================

// main.js - Hoofdbestand van de applicatie
// Beheert: navigatie, state, filters, zoekfunctie,
// paginatie en de connectie tussen API, opslag en UI

import {
  fetchCharacters, fetchEpisodes, fetchLocations, fetchCharacterById
} from './api.js';

import {
  getFavorites, clearFavorites, getTheme, saveTheme, saveLastPage, getLastPage, isFavorite
} from './storage.js';

import {
  showToast, showLoader, hideLoader,
  renderCharacterCard, renderEpisodeCard, renderLocationCard,
  renderPagination, renderNoResults, renderCharacterModal, initCardObserver
} from './ui.js';

// ============================================================
// STATE - Application state object
// ============================================================
const state = {
  characters: { page: 1, total: 1, filters: { name: '', status: '', species: '', gender: '', sort: 'id-asc' } },
  episodes:   { page: 1, total: 1, filters: { name: '', episode: '' } },
  locations:  { page: 1, total: 1, filters: { name: '', type: '' } },
  currentPage: getLastPage(),
};

// IntersectionObserver for card entrance animation (Observer API)
const cardObserver = initCardObserver();

// ============================================================
// THEME
// ============================================================

const applyTheme = (theme) => {
  document.body.dataset.theme = theme;
  document.querySelector('#theme-toggle').textContent = theme === 'dark' ? '☀️' : '🌙';
  saveTheme(theme);
};

// Init theme from localStorage (user preference persisted)
applyTheme(getTheme());

document.querySelector('#theme-toggle').addEventListener('click', () => {
  const newTheme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
});

// ============================================================
// NAVIGATION
// ============================================================

const pages = ['characters', 'episodes', 'locations', 'favorites'];

const navigateTo = (pageName) => {
  state.currentPage = pageName;
  saveLastPage(pageName);

  // Hide all pages, show active
  pages.forEach(p => {
    document.querySelector(`#page-${p}`).classList.toggle('hidden', p !== pageName);
    document.querySelector(`#page-${p}`).classList.toggle('active', p === pageName);
  });

  // Update nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === pageName);
  });

  // Load data for page
  if (pageName === 'characters') loadCharacters();
  if (pageName === 'episodes')   loadEpisodes();
  if (pageName === 'locations')  loadLocations();
  if (pageName === 'favorites')  renderFavorites();
};

// Attach nav events
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => navigateTo(btn.dataset.page));
});

// ============================================================
// CHARACTERS
// ============================================================

const sortCharacters = (chars, sort) => {
  // Demonstrates: array sort, arrow functions, ternary operator
  const sorted = [...chars];
  const [field, dir] = sort.split('-');
  sorted.sort((a, b) => {
    const valA = field === 'name' ? a.name : a.id;
    const valB = field === 'name' ? b.name : b.id;
    return dir === 'asc'
      ? (valA > valB ? 1 : -1)
      : (valA < valB ? 1 : -1);
  });
  return sorted;
};

const loadCharacters = async () => {
  const { page, filters } = state.characters;
  const grid   = document.querySelector('#characters-grid');
  const pagNav = document.querySelector('#pagination-characters');

  grid.innerHTML = '';
  showLoader('characters');

  try {
    const data = await fetchCharacters({
      page,
      name:    filters.name,
      status:  filters.status,
      species: filters.species,
      gender:  filters.gender,
    });

    state.characters.total = data.info.pages;

    const sorted = sortCharacters(data.results, filters.sort);

    // Update result count - demonstrates template literals
    document.querySelector('#result-count').textContent =
      `${data.info.count} characters found (page ${page} of ${data.info.pages})`;

    // Render cards - demonstrates forEach, arrow functions, DOM manipulation
    sorted.forEach(character => {
      const card = renderCharacterCard(character, openModal, updateFavBadge);

      // IntersectionObserver: animate cards as they enter viewport
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      cardObserver.observe(card);

      grid.appendChild(card);
    });

    renderPagination(pagNav, { current: page, total: data.info.pages }, (p) => {
      state.characters.page = p;
      loadCharacters();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

  } catch (error) {
    // No results (API returns 404 for empty filter results)
    renderNoResults(grid, `Geen characters gevonden. Probeer een andere zoekterm of filter. 🔭`);
    pagNav.innerHTML = '';
    document.querySelector('#result-count').textContent = '0 characters found';
  } finally {
    hideLoader('characters');
  }
};

// ---- Character filters & search ----

let searchDebounce = null;

// Demonstrates: callback, setTimeout (debounce pattern)
document.querySelector('#search-characters').addEventListener('input', (e) => {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    state.characters.filters.name = e.target.value.trim();
    state.characters.page = 1;
    loadCharacters();
  }, 400);
});

document.querySelector('#filter-status').addEventListener('change', (e) => {
  state.characters.filters.status = e.target.value;
  state.characters.page = 1;
  loadCharacters();
});

document.querySelector('#filter-species').addEventListener('change', (e) => {
  state.characters.filters.species = e.target.value;
  state.characters.page = 1;
  loadCharacters();
});

document.querySelector('#filter-gender').addEventListener('change', (e) => {
  state.characters.filters.gender = e.target.value;
  state.characters.page = 1;
  loadCharacters();
});

document.querySelector('#sort-characters').addEventListener('change', (e) => {
  state.characters.filters.sort = e.target.value;
  loadCharacters();
});

// ============================================================
// EPISODES
// ============================================================

const loadEpisodes = async () => {
  const { page, filters } = state.episodes;
  const grid   = document.querySelector('#episodes-grid');
  const pagNav = document.querySelector('#pagination-episodes');

  grid.innerHTML = '';
  showLoader('episodes');

  try {
    const data = await fetchEpisodes({ page, name: filters.name, episode: filters.episode });
    state.episodes.total = data.info.pages;

    // Demonstrates: for...of loop
    for (const episode of data.results) {
      grid.appendChild(renderEpisodeCard(episode));
    }

    renderPagination(pagNav, { current: page, total: data.info.pages }, (p) => {
      state.episodes.page = p;
      loadEpisodes();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

  } catch {
    renderNoResults(grid, 'No episodes found.');
    pagNav.innerHTML = '';
  } finally {
    hideLoader('episodes');
  }
};

let epSearchDebounce = null;

document.querySelector('#search-episodes').addEventListener('input', (e) => {
  clearTimeout(epSearchDebounce);
  epSearchDebounce = setTimeout(() => {
    state.episodes.filters.name = e.target.value.trim();
    state.episodes.page = 1;
    loadEpisodes();
  }, 400);
});

document.querySelector('#filter-season').addEventListener('change', (e) => {
  state.episodes.filters.episode = e.target.value;
  state.episodes.page = 1;
  loadEpisodes();
});

// ============================================================
// LOCATIONS
// ============================================================

const loadLocations = async () => {
  const { page, filters } = state.locations;
  const grid   = document.querySelector('#locations-grid');
  const pagNav = document.querySelector('#pagination-locations');

  grid.innerHTML = '';
  showLoader('locations');

  try {
    const data = await fetchLocations({ page, name: filters.name, type: filters.type });
    state.locations.total = data.info.pages;

    // Demonstrates: array .map() + forEach
    data.results.map(loc => renderLocationCard(loc)).forEach(card => grid.appendChild(card));

    renderPagination(pagNav, { current: page, total: data.info.pages }, (p) => {
      state.locations.page = p;
      loadLocations();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

  } catch {
    renderNoResults(grid, 'No locations found.');
    pagNav.innerHTML = '';
  } finally {
    hideLoader('locations');
  }
};

let locSearchDebounce = null;

document.querySelector('#search-locations').addEventListener('input', (e) => {
  clearTimeout(locSearchDebounce);
  locSearchDebounce = setTimeout(() => {
    state.locations.filters.name = e.target.value.trim();
    state.locations.page = 1;
    loadLocations();
  }, 400);
});

document.querySelector('#filter-loc-type').addEventListener('change', (e) => {
  state.locations.filters.type = e.target.value;
  state.locations.page = 1;
  loadLocations();
});

// ============================================================
// FAVORITES
// ============================================================

const updateFavBadge = () => {
  const count = getFavorites().length;
  document.querySelector('#fav-count').textContent = count;
};

const renderFavorites = () => {
  const favorites = getFavorites();
  const grid = document.querySelector('#favorites-grid');
  const noFavMsg = document.querySelector('#no-favorites');

  grid.innerHTML = '';

  // Ternary operator: show/hide empty message
  noFavMsg.classList.toggle('hidden', favorites.length > 0);

  // Demonstrates: forEach, arrow functions
  favorites.forEach(character => {
    const card = renderCharacterCard(character, openModal, () => {
      updateFavBadge();
      renderFavorites();
    });
    grid.appendChild(card);
  });
};

document.querySelector('#clear-favorites').addEventListener('click', () => {
  if (confirm('Clear all favourites?')) {
    clearFavorites();
    updateFavBadge();
    renderFavorites();
    showToast('🗑️ All favourites cleared');
  }
});

// ============================================================
// MODAL
// ============================================================

const modal    = document.querySelector('#modal');
const modalContent = document.querySelector('#modal-content');

const openModal = (character) => {
  modalContent.innerHTML = renderCharacterModal(character);
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  modal.classList.add('hidden');
  document.body.style.overflow = '';
};

document.querySelector('.modal-close').addEventListener('click', closeModal);
document.querySelector('.modal-backdrop').addEventListener('click', closeModal);

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// ============================================================
// MUTATION OBSERVER - watch for new cards added to DOM
// Demonstrates: Observer API (MutationObserver)
// ============================================================

const gridContainer = document.querySelector('#characters-grid');
const mutationObserver = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      // Could add logging or analytics here
      console.log(`DOM updated: ${mutation.addedNodes.length} card(s) added to grid`);
    }
  }
});

mutationObserver.observe(gridContainer, { childList: true });

// ============================================================
// INIT - Run on page load
// Demonstrates: window load event, async/await
// ============================================================

window.addEventListener('load', async () => {
  // Restore user preference: last visited page
  updateFavBadge();
  navigateTo(state.currentPage);
});
