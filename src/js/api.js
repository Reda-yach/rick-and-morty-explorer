'use strict';

// ============================================
// api.js - Data fetching from Rick & Morty API
// Demonstrates: fetch, async/await, Promises,
//   try/catch, arrow functions, template literals
// ============================================

const BASE_URL = 'https://rickandmortyapi.com/api';

/**
 * Generic fetch wrapper with error handling
 * Demonstrates: async/await, try/catch, template literals
 */
const fetchFromAPI = async (endpoint) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Fetch error for ${endpoint}:`, error.message);
    throw error;
  }
};

// ---- Characters ----

/**
 * Fetch characters with filters
 * Demonstrates: template literals building query strings, Promises
 */
/**
 * Haalt een lijst van characters op van de Rick & Morty API
 * Ondersteunt filtering op naam, status, species en gender
 * Geeft een object terug met { info: {pages, count}, results: [...] }
 */
export const fetchCharacters = async ({ page = 1, name = '', status = '', species = '', gender = '' } = {}) => {
  const params = new URLSearchParams();
  params.set('page', page);
  if (name)    params.set('name', name);
  if (status)  params.set('status', status);
  if (species) params.set('species', species);
  if (gender)  params.set('gender', gender);

  return fetchFromAPI(`/character?${params.toString()}`);
};

/**
 * Fetch a single character by ID
 */
export const fetchCharacterById = async (id) => fetchFromAPI(`/character/${id}`);

/**
 * Fetch multiple characters by array of IDs (for episode detail)
 * Demonstrates: array methods, template literals
 */
export const fetchCharactersByIds = async (ids) => {
  if (!ids || ids.length === 0) return [];
  const idList = ids.map(url => url.split('/').pop()).join(',');
  const result = await fetchFromAPI(`/character/${idList}`);
  // API returns single object when only 1 id, array otherwise
  return Array.isArray(result) ? result : [result];
};

// ---- Episodes ----
/**
 * Haalt episodes op van de API
 * Filterbaar op naam en seizoenscode (bv. S01, S02)
 * Geeft paginatie info terug via data.info.pages
 */

export const fetchEpisodes = async ({ page = 1, name = '', episode = '' } = {}) => {
  const params = new URLSearchParams();
  params.set('page', page);
  if (name)    params.set('name', name);
  if (episode) params.set('episode', episode);

  return fetchFromAPI(`/episode?${params.toString()}`);
};

// ---- Locations ----

export const fetchLocations = async ({ page = 1, name = '', type = '' } = {}) => {
  const params = new URLSearchParams();
  params.set('page', page);
  if (name) params.set('name', name);
  if (type) params.set('type', type);

  return fetchFromAPI(`/location?${params.toString()}`);
};
