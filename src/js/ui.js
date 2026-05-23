'use strict';

// ui.js - verantwoordelijk voor alle DOM rendering
// bevat: kaart rendering, paginatie, modal, toast meldingen
// en IntersectionObserver voor animaties

import { isFavorite, toggleFavorite } from './storage.js';

let toastTimer = null;

// toast melding tonen onderaan het scherm (verdwijnt vanzelf)
export const showToast = (bericht, duur = 2500) => {
  const toast = document.querySelector('#toast');
  toast.textContent = bericht;
  toast.classList.remove('hidden');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('hidden'), duur);
};

// laadspinner tonen of verbergen
export const showLoader = (id) => document.querySelector(`#loader-${id}`)?.classList.remove('hidden');
export const hideLoader = (id) => document.querySelector(`#loader-${id}`)?.classList.add('hidden');

// gekleurde stip voor de status van een character (alive/dead/unknown)
const maakStatusStip = (status) => {
  const s = status.toLowerCase();
  return `<span class="status-dot ${s}"></span>`;
};

// een character kaart aanmaken en teruggeven als DOM element
export const renderCharacterCard = (character, onKaartKlik, onFavWijziging) => {
  const kaart = document.createElement('div');
  kaart.className = 'char-card';
  kaart.dataset.id = character.id;

  const isAlFavoriet = isFavorite(character.id);

  kaart.innerHTML = `
    <span class="card-id">#${character.id}</span>
    <img src="${character.image}" alt="${character.name}" loading="lazy" />
    <button class="fav-btn ${isAlFavoriet ? 'active' : ''}" title="favoriet">
      ${isAlFavoriet ? '⭐' : '☆'}
    </button>
    <div class="card-body">
      <p class="card-name">${character.name}</p>
      <div class="card-meta">
        <span>${maakStatusStip(character.status)} ${character.status} – ${character.species}</span>
        <span>🌍 ${character.location.name}</span>
        <span>🎬 ${character.episode.length} episode${character.episode.length !== 1 ? 's' : ''}</span>
        <span>⚧ ${character.gender}</span>
        <span>🔬 Origin: ${character.origin.name}</span>
        <span>📅 ${new Date(character.created).toLocaleDateString('nl-BE')}</span>
      </div>
    </div>
  `;

  // klik op de kaart zelf opent de modal, maar niet als je op de ster klikt
  kaart.addEventListener('click', (e) => {
    if (!e.target.closest('.fav-btn')) onKaartKlik(character);
  });

  // ster knop: toevoegen of verwijderen uit favorieten
  const favKnop = kaart.querySelector('.fav-btn');
  favKnop.addEventListener('click', (e) => {
    e.stopPropagation();
    const toegevoegd = toggleFavorite(character);
    favKnop.textContent = toegevoegd ? '⭐' : '☆';
    favKnop.classList.toggle('active', toegevoegd);
    showToast(toegevoegd ? `⭐ ${character.name} toegevoegd!` : `${character.name} verwijderd uit favorieten`);
    if (onFavWijziging) onFavWijziging();
  });

  return kaart;
};

// episode kaart aanmaken
export const renderEpisodeCard = (episode) => {
  const kaart = document.createElement('div');
  kaart.className = 'ep-card';

  // seizoen en aflevering uit de code halen bv S01E04
  const seizoen = episode.episode.slice(0, 3);
  const aflevering = episode.episode.slice(3);

  kaart.innerHTML = `
    <span class="ep-code">${seizoen} ${aflevering}</span>
    <p class="ep-name">${episode.name}</p>
    <p class="ep-date">📅 ${episode.air_date}</p>
    <p class="ep-chars">👥 ${episode.characters.length} characters</p>
  `;

  return kaart;
};

// locatie kaart aanmaken
export const renderLocationCard = (locatie) => {
  const kaart = document.createElement('div');
  kaart.className = 'loc-card';

  kaart.innerHTML = `
    <p class="loc-name">${locatie.name}</p>
    <span class="loc-type">${locatie.type}</span>
    <p class="loc-dimension">🌀 ${locatie.dimension}</p>
    <p class="loc-residents">👥 ${locatie.residents.length} bewoners</p>
  `;

  return kaart;
};

// lege staat tonen als er geen resultaten zijn
export const renderNoResults = (container, bericht = 'Geen resultaten gevonden') => {
  container.innerHTML = `
    <div class="no-results">
      <span>🔭</span>
      <p>${bericht}</p>
    </div>
  `;
};

// paginatie knoppen aanmaken
export const renderPagination = (container, { current, total }, naarPagina) => {
  container.innerHTML = '';
  if (total <= 1) return;

  const maakKnop = (label, pagina, uitgeschakeld = false, actief = false) => {
    const knop = document.createElement('button');
    knop.className = `page-btn${actief ? ' active' : ''}`;
    knop.textContent = label;
    knop.disabled = uitgeschakeld;
    knop.addEventListener('click', () => naarPagina(pagina));
    return knop;
  };

  container.appendChild(maakKnop('← Vorige', current - 1, current === 1));

  const paginaNummers = bepaalPaginaReeks(current, total);
  paginaNummers.forEach(p => {
    if (p === '...') {
      const puntjes = document.createElement('span');
      puntjes.textContent = '…';
      puntjes.style.cssText = 'padding: 0.5rem; color: var(--text-muted);';
      container.appendChild(puntjes);
    } else {
      container.appendChild(maakKnop(p, p, false, p === current));
    }
  });

  container.appendChild(maakKnop('Volgende →', current + 1, current === total));
};

// welke paginanummers tonen met puntjes ertussen als er veel paginas zijn
const bepaalPaginaReeks = (current, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const paginas = [1];
  if (current > 3) paginas.push('...');

  const start = Math.max(2, current - 1);
  const einde = Math.min(total - 1, current + 1);
  for (let i = start; i <= einde; i++) paginas.push(i);

  if (current < total - 2) paginas.push('...');
  paginas.push(total);

  return paginas;
};

// inhoud van de detail modal voor een character
export const renderCharacterModal = (character) => `
  <div class="modal-char">
    <img src="${character.image}" alt="${character.name}" />
    <div class="modal-info">
      <h2>${character.name}</h2>
      <table>
        <tr><td>Status</td><td>${maakStatusStip(character.status)} ${character.status}</td></tr>
        <tr><td>Species</td><td>${character.species}</td></tr>
        <tr><td>Type</td><td>${character.type || '–'}</td></tr>
        <tr><td>Gender</td><td>${character.gender}</td></tr>
        <tr><td>Origin</td><td>${character.origin.name}</td></tr>
        <tr><td>Locatie</td><td>${character.location.name}</td></tr>
        <tr><td>Aangemaakt</td><td>${new Date(character.created).toLocaleDateString('nl-BE')}</td></tr>
        <tr><td>Episodes</td><td>${character.episode.length} afleveringen</td></tr>
      </table>
    </div>
  </div>
  <div class="modal-episodes">
    <h3>Komt voor in:</h3>
    <div class="ep-tags">
      ${character.episode.map(url => {
        const num = url.split('/').pop();
        return `<span class="ep-tag">EP ${num}</span>`;
      }).join('')}
    </div>
  </div>
`;

// IntersectionObserver voor animatie als kaarten in beeld komen
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
