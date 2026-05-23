'use strict';

// storage.js - beheert alle localStorage interacties
// slaat op: favorieten, thema voorkeur, laatste bezochte pagina
// data blijft bewaard tussen sessies via JSON serialisatie

// sleutelnamen voor localStorage, zo vermijd ik typefouten
const SLEUTELS = {
  FAVORIETEN: 'rm_favorites',
  THEMA: 'rm_theme',
  LAATSTE_PAGINA: 'rm_last_page',
};

// alle favorieten ophalen uit localStorage
// als er niks is of als JSON.parse faalt geef ik gewoon een lege array terug
export const getFavorieten = () => {
  try {
    const opgeslagen = localStorage.getItem(SLEUTELS.FAVORIETEN);
    return opgeslagen ? JSON.parse(opgeslagen) : [];
  } catch {
    return [];
  }
};

// favorieten opslaan
// moet eerst omgezet worden naar string want localStorage werkt alleen met strings
export const slaFavorietenOp = (favorieten) => {
  localStorage.setItem(SLEUTELS.FAVORIETEN, JSON.stringify(favorieten));
};

// kijkt eerst of de character al in de lijst staat
// zo ja verwijderen, zo nee toevoegen
export const toggleFavoriet = (character) => {
  const favorieten = getFavorieten();

  const bestaatAl = favorieten.findIndex(f => f.id === character.id);

  if (bestaatAl !== -1) {
    // staat er al in dus verwijderen
    favorieten.splice(bestaatAl, 1);
    slaFavorietenOp(favorieten);
    return false;
  } else {
    // nog niet in de lijst dus toevoegen
    favorieten.push(character);
    slaFavorietenOp(favorieten);
    return true;
  }
};

// checken of een character al een favoriet is
export const isFavoriet = (id) => {
  const favorieten = getFavorieten();
  return favorieten.some(f => f.id === id);
};

// alle favorieten wissen
export const verwijderAlleFavorieten = () => {
  localStorage.removeItem(SLEUTELS.FAVORIETEN);
};

// thema ophalen, standaard dark als er nog niks opgeslagen is
export const getThema = () => localStorage.getItem(SLEUTELS.THEMA) || 'dark';
export const slaThemaOp = (thema) => localStorage.setItem(SLEUTELS.THEMA, thema);

// laatste bezochte pagina onthouden zodat je na herladen op dezelfde pagina uitkomt
export const getLaatstePagina = () => localStorage.getItem(SLEUTELS.LAATSTE_PAGINA) || 'characters';
export const slaLaatstePaginaOp = (pagina) => localStorage.setItem(SLEUTELS.LAATSTE_PAGINA, pagina);

// aliases zodat de imports in ui.js en main.js blijven werken
export const getFavorites = getFavorieten;
export const clearFavorites = verwijderAlleFavorieten;
export const isFavorite = isFavoriet;
export const toggleFavorite = toggleFavoriet;
export const getTheme = getThema;
export const saveTheme = slaThemaOp;
export const getLastPage = getLaatstePagina;
export const saveLastPage = slaLaatstePaginaOp;
