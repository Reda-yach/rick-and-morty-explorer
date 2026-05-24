# Rick & Morty Explorer

Project voor het vak Web Advanced. Ik heb een SPA gemaakt met de Rick and Morty API waarbij je characters, episodes en locaties kan bekijken, filteren en zoeken. Characters kan je ook opslaan als favoriet.

## Wat kan je doen?

- Characters bekijken en filteren op status, species en gender
- Zoeken op naam bij characters, episodes en locaties
- Characters sorteren op naam of ID
- Episodes filteren per seizoen
- Locaties filteren op type
- Characters opslaan als favoriet (blijft bewaard na herladen)
- Wisselen tussen dark en light mode (voorkeur wordt bewaard)
- Op een character klikken voor meer details

## Gebruikte API

- **Rick and Morty API** — https://rickandmortyapi.com/
  - `/character` — characters ophalen
  - `/episode` — episodes ophalen
  - `/location` — locaties ophalen

---

## Technische vereisten

### DOM Manipulatie

| Concept | Bestand + uitleg |
|---|---|
| Elementen selecteren | `main.js` lijn 62 — `document.querySelector` bij de `gaNaar` functie |
| Elementen manipuleren | `ui.js` lijn 32 — `renderCharacterCard` maakt kaarten aan via `createElement` en `innerHTML` |
| Events koppelen | `main.js` lijn 62 — `addEventListener` voor click, input, change, keydown en load |

### Modern JavaScript

| Concept | Bestand + uitleg |
|---|---|
| Constanten | `api.js` lijn 10 — `const BASE_URL`, `storage.js` lijn 16 — `const SLEUTELS` |
| Template literals | `ui.js` lijn 32 — kaart HTML opbouwen met backticks en `${}` |
| Iteratie over arrays | `main.js` lijn 108 — `forEach` bij het renderen van kaarten in `laadCharacters` |
| Array methodes | `storage.js` lijn 33 — `findIndex`, `splice`, `push`, `some` in `toggleFavoriet` |
| Arrow functions | `api.js` lijn 29 — `const fetchFromAPI = async (endpoint) => {...}` |
| Ternary operator | `ui.js` lijn 32 — `isAlFavoriet ? '⭐' : '☆'` |
| Callback functions | `main.js` lijn 108 — debounce via `setTimeout` callback in zoekbalk |
| Promises | `api.js` lijn 29 — `fetchFromAPI` geeft een Promise terug |
| Async & Await | `main.js` lijn 108 — `laadCharacters`, lijn 195 — `laadEpisodes`, lijn 246 — `laadLocaties` |
| Observer API | `ui.js` lijn 199 — `IntersectionObserver` voor kaart animaties; `main.js` — `MutationObserver` |

### Data & API

| Concept | Bestand + uitleg |
|---|---|
| Fetch | `api.js` lijn 29 — `await fetch(...)` met foutafhandeling |
| JSON | `storage.js` lijn 16 — `JSON.parse` bij ophalen, `JSON.stringify` bij opslaan |


### Opslag & Validatie

| Concept | Bestand + uitleg |
|---|---|
| LocalStorage | `storage.js` lijn 16 — favorieten, thema en laatste pagina worden opgeslagen |
| Gebruikersvoorkeuren | Dark/light thema en laatste pagina blijven bewaard na herladen |
| Toast meldingen | `ui.js` lijn 32 — gebruiker krijgt melding bij toevoegen/verwijderen favoriet |

### Styling & Layout

| Concept | Bestand + uitleg |
|---|---|
| CSS Grid | `cards.css` lijn 1 — `.card-grid` gebruikt CSS grid |
| Flexbox | `main.css` — header en controls gebruiken flexbox |
| Animaties | `cards.css` — kaarten bewegen omhoog bij hover; `ui.js` lijn 199 — kaarten fade in via IntersectionObserver |

### Tooling & Structuur

| Concept | Bestand + uitleg |
|---|---|
| Vite | `package.json` + `vite.config.js` |
| ES Modules | Elk JS bestand gebruikt `import` en `export` |
| Folderstructuur | `src/js/`, `src/css/`, `dist/` na build |

---

## Folderstructuur

```
rick-and-morty-explorer/
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
├── README.md
└── src/
    ├── js/
    │   ├── main.js      — navigatie, filters, events
    │   ├── api.js       — fetch calls naar de API
    │   ├── storage.js   — localStorage
    │   └── ui.js        — DOM rendering en observers
    └── css/
        ├── main.css     — globale stijlen en thema
        ├── cards.css    — kaart componenten
        └── filters.css  — filter dropdowns
```

---

## Installatie

Je hebt Node.js nodig: https://nodejs.org/

```bash
git clone https://github.com/Reda-yach/rick-and-morty-explorer.git
cd rick-and-morty-explorer
npm install
npm run dev
```

---

## Testen

Getest op:
- Google Chrome
- Microsoft Edge
- Mobiel (responsive op 375px en 768px)

---


## Voortgang
- [x] Project opgezet met Vite
- [x] Rick and Morty API gekoppeld
- [x] Characters pagina met filters en sortering
- [x] Episodes pagina
- [x] Locaties pagina
- [x] Favorieten systeem met localStorage
- [x] Dark/light mode
- [x] Responsive design
- [x] Character detail modal
- [x] Alles getest op Chrome en Firefox
- [x] Responsive gecontroleerd op mobiel

---

## Bronnen

- Rick and Morty API documentatie: https://rickandmortyapi.com/documentation
- MDN Web Docs — Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- MDN Web Docs — localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- MDN Web Docs — IntersectionObserver: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
- Vite documentatie: https://vitejs.dev/
- Lescursus Web Advanced — EHB (2025-2026)
- AI-assistent (Claude) gebruikt als hulpmiddel bij het project. Chatlog beschikbaar op aanvraag.

## AI-Log

Ik heb Claude (claude.ai) gebruikt als hulpmiddel bij dit project.

### Hoe ik AI heb gebruikt:
- Hulp bij het opzetten van de Vite projectstructuur
- Debuggen van de fetch functie (foutafhandeling)
- Uitleg over hoe IntersectionObserver werkt
- Hulp bij het schrijven van de CSS grid layout
- Vragen gesteld over localStorage en JSON.parse/stringify

### Wat ik zelf heb gedaan:
- De logica voor filters en sortering zelf uitgewerkt
- Variabelenamen aangepast naar Nederlands
- Comments zelf geschreven en uitgelegd
- De README zelf ingevuld
- Alles getest en debugged in de browser

### Gebruikte AI tool:
- Claude (Anthropic) — https://claude.ai

### Chatlog overzicht

| # | Wat ik gevraagd heb | Wat ik ermee gedaan heb |
|---|---|---|
| 1 | Vite project opzetten met Rick and Morty API | Als startpunt gebruikt, zelf aangepast |
| 2 | Uitleg over hoe fetch en async/await werkt | Begrepen en toegepast in api.js |
| 3 | Hulp bij CSS grid layout voor de kaarten | Zelf aangepast naar eigen stijl |
| 4 | Uitleg over IntersectionObserver | Toegepast in ui.js voor kaart animaties |
| 5 | Hulp bij localStorage voor favorieten | Zelf variabelenamen aangepast naar Nederlands |
| 6 | Debuggen van filter functionaliteit | Zelf opgelost na uitleg |
| 7 | README structuur en inhoud | Zelf ingevuld en aangepast |
