'use strict';

// main.js - het hoofdbestand van de applicatie
// beheert: navigatie, state, filters, zoekfunctie,
// paginatie en de connectie tussen API, opslag en UI

import {
  fetchCharacters, fetchEpisodes, fetchLocations
} from './api.js';

import {
  getFavorites, clearFavorites, getTheme, saveTheme, saveLastPage, getLastPage
} from './storage.js';

import {
  showToast, showLoader, hideLoader,
  renderCharacterCard, renderEpisodeCard, renderLocationCard,
  renderPagination, renderNoResults, renderCharacterModal, initCardObserver
} from './ui.js';

// centrale state van de applicatie
// houdt huidige pagina, filters en paginanummer bij per sectie
// wordt bijgewerkt door filter- en zoekevenementen
const staat = {
  characters: { pagina: 1, totaal: 1, filters: { naam: '', status: '', species: '', gender: '', sortering: 'id-asc' } },
  episodes:   { pagina: 1, totaal: 1, filters: { naam: '', seizoen: '' } },
  locations:  { pagina: 1, totaal: 1, filters: { naam: '', type: '' } },
  huidigePagina: getLastPage(),
};

// observer voor de kaart animaties
const kaartObserver = initCardObserver();

// -----------------------------------------------
// THEMA
// past het thema toe op de body en slaat de keuze op in localStorage
// wordt aangeroepen bij laden en bij klikken op de toggle knop
// -----------------------------------------------

const pasThemaToe = (thema) => {
  document.body.dataset.theme = thema;
  // zon = light mode, maan = dark mode
  document.querySelector('#theme-toggle').textContent = thema === 'dark' ? '☀️' : '🌙';
  saveTheme(thema);
};

pasThemaToe(getTheme());

document.querySelector('#theme-toggle').addEventListener('click', () => {
  const nieuwThema = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
  pasThemaToe(nieuwThema);
});

// -----------------------------------------------
// NAVIGATIE
// pagina wisselen en de juiste data laden
// laatste pagina wordt opgeslagen zodat je na herladen terugkomt
// -----------------------------------------------

const paginaNamen = ['characters', 'episodes', 'locations', 'favorites'];

const gaNaar = (paginaNaam) => {
  staat.huidigePagina = paginaNaam;
  saveLastPage(paginaNaam);

  // alle paginas verbergen en alleen de juiste tonen
  paginaNamen.forEach(p => {
    document.querySelector(`#page-${p}`).classList.toggle('hidden', p !== paginaNaam);
    document.querySelector(`#page-${p}`).classList.toggle('active', p === paginaNaam);
  });

  // nav knop actief zetten
  document.querySelectorAll('.nav-btn').forEach(knop => {
    knop.classList.toggle('active', knop.dataset.page === paginaNaam);
  });

  if (paginaNaam === 'characters') laadCharacters();
  if (paginaNaam === 'episodes')   laadEpisodes();
  if (paginaNaam === 'locations')  laadLocaties();
  if (paginaNaam === 'favorites')  toonFavorieten();
};

document.querySelectorAll('.nav-btn').forEach(knop => {
  knop.addEventListener('click', () => gaNaar(knop.dataset.page));
});

// -----------------------------------------------
// CHARACTERS
// -----------------------------------------------

// sortering toepassen op de characters
// field is 'name' of 'id', dir is 'asc' of 'desc'
const sorteerCharacters = (lijst, sortering) => {
  const gesorteerd = [...lijst];
  const [veld, richting] = sortering.split('-');

  gesorteerd.sort((a, b) => {
    const waardeA = veld === 'name' ? a.name : a.id;
    const waardeB = veld === 'name' ? b.name : b.id;
    return richting === 'asc'
      ? (waardeA > waardeB ? 1 : -1)
      : (waardeA < waardeB ? 1 : -1);
  });

  return gesorteerd;
};

const laadCharacters = async () => {
  const { pagina, filters } = staat.characters;
  const grid = document.querySelector('#characters-grid');
  const paginatie = document.querySelector('#pagination-characters');

  grid.innerHTML = '';
  showLoader('characters');

  try {
    const data = await fetchCharacters({
      page: pagina,
      name: filters.naam,
      status: filters.status,
      species: filters.species,
      gender: filters.gender,
    });

    staat.characters.totaal = data.info.pages;
    const gesorteerd = sorteerCharacters(data.results, filters.sortering);

    document.querySelector('#result-count').textContent =
      `${data.info.count} characters gevonden (pagina ${pagina} van ${data.info.pages})`;

    // kaart begint onzichtbaar en komt in beeld via de IntersectionObserver
    gesorteerd.forEach(character => {
      const kaart = renderCharacterCard(character, openModal, updateFavTeller);
      kaart.style.opacity = '0';
      kaart.style.transform = 'translateY(20px)';
      kaart.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      kaartObserver.observe(kaart);
      grid.appendChild(kaart);
    });

    renderPagination(paginatie, { current: pagina, total: data.info.pages }, (p) => {
      staat.characters.pagina = p;
      laadCharacters();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

  } catch (fout) {
    renderNoResults(grid, `Geen characters gevonden. Probeer een andere zoekterm of filter. 🔭`);
    paginatie.innerHTML = '';
    document.querySelector('#result-count').textContent = '0 characters gevonden';
  } finally {
    hideLoader('characters');
  }
};

// zoekbalk met kleine vertraging zodat we niet elke toetsaanslag een request sturen
let zoekTimer = null;

document.querySelector('#search-characters').addEventListener('input', (e) => {
  clearTimeout(zoekTimer);
  zoekTimer = setTimeout(() => {
    staat.characters.filters.naam = e.target.value.trim();
    staat.characters.pagina = 1;
    laadCharacters();
  }, 400);
});

document.querySelector('#filter-status').addEventListener('change', (e) => {
  staat.characters.filters.status = e.target.value;
  staat.characters.pagina = 1;
  laadCharacters();
});

document.querySelector('#filter-species').addEventListener('change', (e) => {
  staat.characters.filters.species = e.target.value;
  staat.characters.pagina = 1;
  laadCharacters();
});

document.querySelector('#filter-gender').addEventListener('change', (e) => {
  staat.characters.filters.gender = e.target.value;
  staat.characters.pagina = 1;
  laadCharacters();
});

document.querySelector('#sort-characters').addEventListener('change', (e) => {
  staat.characters.filters.sortering = e.target.value;
  laadCharacters();
});

// -----------------------------------------------
// EPISODES
// -----------------------------------------------

const laadEpisodes = async () => {
  const { pagina, filters } = staat.episodes;
  const grid = document.querySelector('#episodes-grid');
  const paginatie = document.querySelector('#pagination-episodes');

  grid.innerHTML = '';
  showLoader('episodes');

  try {
    const data = await fetchEpisodes({ page: pagina, name: filters.naam, episode: filters.seizoen });
    staat.episodes.totaal = data.info.pages;

    for (const episode of data.results) {
      grid.appendChild(renderEpisodeCard(episode));
    }

    renderPagination(paginatie, { current: pagina, total: data.info.pages }, (p) => {
      staat.episodes.pagina = p;
      laadEpisodes();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

  } catch {
    renderNoResults(grid, 'Geen episodes gevonden.');
    paginatie.innerHTML = '';
  } finally {
    hideLoader('episodes');
  }
};

let epZoekTimer = null;

document.querySelector('#search-episodes').addEventListener('input', (e) => {
  clearTimeout(epZoekTimer);
  epZoekTimer = setTimeout(() => {
    staat.episodes.filters.naam = e.target.value.trim();
    staat.episodes.pagina = 1;
    laadEpisodes();
  }, 400);
});

document.querySelector('#filter-season').addEventListener('change', (e) => {
  staat.episodes.filters.seizoen = e.target.value;
  staat.episodes.pagina = 1;
  laadEpisodes();
});

// -----------------------------------------------
// LOCATIES
// -----------------------------------------------

const laadLocaties = async () => {
  const { pagina, filters } = staat.locations;
  const grid = document.querySelector('#locations-grid');
  const paginatie = document.querySelector('#pagination-locations');

  grid.innerHTML = '';
  showLoader('locations');

  try {
    const data = await fetchLocations({ page: pagina, name: filters.naam, type: filters.type });
    staat.locations.totaal = data.info.pages;

    data.results.map(loc => renderLocationCard(loc)).forEach(kaart => grid.appendChild(kaart));

    renderPagination(paginatie, { current: pagina, total: data.info.pages }, (p) => {
      staat.locations.pagina = p;
      laadLocaties();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

  } catch {
    renderNoResults(grid, 'Geen locaties gevonden.');
    paginatie.innerHTML = '';
  } finally {
    hideLoader('locations');
  }
};

let locZoekTimer = null;

document.querySelector('#search-locations').addEventListener('input', (e) => {
  clearTimeout(locZoekTimer);
  locZoekTimer = setTimeout(() => {
    staat.locations.filters.naam = e.target.value.trim();
    staat.locations.pagina = 1;
    laadLocaties();
  }, 400);
});

document.querySelector('#filter-loc-type').addEventListener('change', (e) => {
  staat.locations.filters.type = e.target.value;
  staat.locations.pagina = 1;
  laadLocaties();
});

// -----------------------------------------------
// FAVORIETEN
// -----------------------------------------------

// het getal op de favorieten knop bijwerken
const updateFavTeller = () => {
  const aantal = getFavorites().length;
  document.querySelector('#fav-count').textContent = aantal;
};

const toonFavorieten = () => {
  const favorieten = getFavorites();
  const grid = document.querySelector('#favorites-grid');
  const leegBericht = document.querySelector('#no-favorites');

  grid.innerHTML = '';

  // lege staat tonen of verbergen afhankelijk van of er favorieten zijn
  leegBericht.classList.toggle('hidden', favorieten.length > 0);

  favorieten.forEach(character => {
    const kaart = renderCharacterCard(character, openModal, () => {
      updateFavTeller();
      toonFavorieten();
    });
    grid.appendChild(kaart);
  });
};

document.querySelector('#clear-favorites').addEventListener('click', () => {
  if (confirm('Wil je alle favorieten verwijderen?')) {
    clearFavorites();
    updateFavTeller();
    toonFavorieten();
    showToast('🗑️ Alle favorieten verwijderd');
  }
});

// -----------------------------------------------
// MODAL
// -----------------------------------------------

const modal = document.querySelector('#modal');
const modalInhoud = document.querySelector('#modal-content');

const openModal = (character) => {
  modalInhoud.innerHTML = renderCharacterModal(character);
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
};

const sluitModal = () => {
  modal.classList.add('hidden');
  document.body.style.overflow = '';
};

document.querySelector('.modal-close').addEventListener('click', sluitModal);
document.querySelector('.modal-backdrop').addEventListener('click', sluitModal);

// ook sluiten met escape toets
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') sluitModal();
});

// -----------------------------------------------
// MUTATION OBSERVER
// houdt bij wanneer nieuwe kaarten aan het grid toegevoegd worden
// -----------------------------------------------

const karakterGrid = document.querySelector('#characters-grid');
const domObserver = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      console.log(`${mutation.addedNodes.length} kaart(en) toegevoegd aan het grid`);
    }
  }
});

domObserver.observe(karakterGrid, { childList: true });

// -----------------------------------------------
// APP STARTEN
// -----------------------------------------------

window.addEventListener('load', async () => {
  updateFavTeller();
  gaNaar(staat.huidigePagina);
});
