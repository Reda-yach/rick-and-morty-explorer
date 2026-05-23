'use strict';

// api.js - hier haal ik alle data op van de Rick and Morty API
// bron: https://rickandmortyapi.com/documentation

const BASE_URL = 'https://rickandmortyapi.com/api';

// deze functie gebruik ik voor alle fetch calls
// zo moet ik de error handling maar op 1 plek schrijven
const fetchFromAPI = async (endpoint) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);

    // als de server een fout teruggeeft (bv 404) gooien we een error
    if (!response.ok) {
      throw new Error(`Er ging iets mis: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('fetch mislukt:', error.message);
    throw error;
  }
};

// characters ophalen, je kan filteren op naam/status/species/gender
// page is standaard 1 als je niets meegeeft
export const fetchCharacters = async ({ page = 1, name = '', status = '', species = '', gender = '' } = {}) => {
  const params = new URLSearchParams();
  params.set('page', page);

  // alleen toevoegen als er echt iets ingevuld is
  if (name)    params.set('name', name);
  if (status)  params.set('status', status);
  if (species) params.set('species', species);
  if (gender)  params.set('gender', gender);

  return fetchFromAPI(`/character?${params.toString()}`);
};

// 1 character ophalen op basis van id
export const fetchCharacterById = async (id) => fetchFromAPI(`/character/${id}`);

// meerdere characters tegelijk ophalen via een array van ids
// de API accepteert ids gescheiden door komma's bv /character/1,2,3
export const fetchCharactersByIds = async (ids) => {
  if (!ids || ids.length === 0) return [];

  // uit elke url het id-nummer halen (staat altijd op het einde)
  const idList = ids.map(url => url.split('/').pop()).join(',');
  const resultaat = await fetchFromAPI(`/character/${idList}`);

  // als er maar 1 id is geeft de api een object terug ipv array
  return Array.isArray(resultaat) ? resultaat : [resultaat];
};

// episodes ophalen, filterbaar op naam en seizoen (bv S01)
// geeft paginatie info terug via data.info.pages
export const fetchEpisodes = async ({ page = 1, name = '', episode = '' } = {}) => {
  const params = new URLSearchParams();
  params.set('page', page);
  if (name)    params.set('name', name);
  if (episode) params.set('episode', episode);

  return fetchFromAPI(`/episode?${params.toString()}`);
};

// locaties ophalen, filterbaar op naam en type (bv planet, space station)
// elke locatie bevat een lijst van bewoners als url-array
export const fetchLocations = async ({ page = 1, name = '', type = '' } = {}) => {
  const params = new URLSearchParams();
  params.set('page', page);
  if (name) params.set('name', name);
  if (type) params.set('type', type);

  return fetchFromAPI(`/location?${params.toString()}`);
};
