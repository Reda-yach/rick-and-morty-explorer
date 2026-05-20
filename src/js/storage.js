'use strict';

// storage.js - Beheert alle localStorage interacties
// Slaat op: favorieten, thema voorkeur, laatste bezochte pagina
// Data blijft bewaard tussen sessies via JSON serialisatie

// ============================================
// storage.js - LocalStorage helpers
// Demonstrates: localStorage, JSON.parse/stringify,
//   arrow functions, const, try/catch
// ============================================

const KEYS = {
  FAVORITES: 'rm_favorites',
  THEME: 'rm_theme',
  LAST_PAGE: 'rm_last_page',
};

// ---- Favorites ----

/**
 * Get all saved favorites from localStorage
 * Demonstrates: JSON.parse, try/catch, const
 */
export const getFavorites = () => {
  try {
    const raw = localStorage.getItem(KEYS.FAVORITES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/**
 * Save an array of favorites to localStorage
 */
export const saveFavorites = (favorites) => {
  localStorage.setItem(KEYS.FAVORITES, JSON.stringify(favorites));
};

/**
 * Toggle a character in/out of favorites
 * Demonstrates: array methods (findIndex, filter, push), const
 * @returns {boolean} true if added, false if removed
 */
/**
 * Voegt een character toe aan favorieten of verwijdert hem
 * Gebruikt findIndex om te checken of character al bestaat
 * Slaat bijgewerkte array op via JSON.stringify in localStorage
 */
export const toggleFavorite = (character) => {
  const favorites = getFavorites();
  const existingIndex = favorites.findIndex(f => f.id === character.id);

  if (existingIndex !== -1) {
    // Remove it
    favorites.splice(existingIndex, 1);
    saveFavorites(favorites);
    return false;
  } else {
    // Add it
    favorites.push(character);
    saveFavorites(favorites);
    return true;
  }
};

/**
 * Check if a character is favorited
 */
export const isFavorite = (id) => {
  const favorites = getFavorites();
  return favorites.some(f => f.id === id);
};

/**
 * Clear all favorites
 */
export const clearFavorites = () => {
  localStorage.removeItem(KEYS.FAVORITES);
};

// ---- Theme Preference ----

export const getTheme = () => localStorage.getItem(KEYS.THEME) || 'dark';
export const saveTheme = (theme) => localStorage.setItem(KEYS.THEME, theme);

// ---- Last visited page ----

export const getLastPage = () => localStorage.getItem(KEYS.LAST_PAGE) || 'characters';
export const saveLastPage = (page) => localStorage.setItem(KEYS.LAST_PAGE, page);
