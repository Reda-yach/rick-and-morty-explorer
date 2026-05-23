# 🛸 Rick & Morty Explorer

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
| Elementen selecteren | `main.js` — `document.querySelector('#theme-toggle')` overal gebruikt |
| Elementen manipuleren | `ui.js` — `createElement`, `appendChild`, `innerHTML`, `classList.toggle` |
| Events koppelen | `main.js` — `addEventListener` voor click, input, change, keydown en load |

### Modern JavaScript

| Concept | Bestand + uitleg |
|---|---|
| Constanten | `api.js` — `const BASE_URL`, `storage.js` — `const SLEUTELS` |
| Template literals | `ui.js` — kaart HTML opbouwen met backticks en `${}` |
| Iteratie over arrays | `main.js` — `forEach` bij het renderen van kaarten |
| Array methodes | `storage.js` — `findIndex`, `splice`, `push`, `some`; `main.js` — `map`, `filter`, `sort` |
| Arrow functions | Overal — bv. `api.js`: `const fetchFromAPI = async (endpoint) => {...}` |
| Ternary operator | `ui.js` — `isAlFavoriet ? '⭐' : '☆'` |
| Callback functions | `main.js` — de zoekbalk gebruikt een `setTimeout` callback (debounce) |
| Promises | `api.js` — `fetchFromAPI` geeft een Promise terug |
| Async & Await | `main.js` — `laadCharacters`, `laadEpisodes`, `laadLocaties` |
| Observer API | `ui.js` — `IntersectionObserver` voor kaart animaties; `main.js` — `MutationObserver` |

### Data & API

| Concept | Bestand + uitleg |
|---|---|
| Fetch | `api.js` — `await fetch(...)` met foutafhandeling |
| JSON | `storage.js` — `JSON.parse` bij ophalen, `JSON.stringify` bij opslaan |

### Opslag & Validatie

| Concept | Bestand + uitleg |
|---|---|
| LocalStorage | `storage.js` — favorieten, thema en laatste pagina worden opgeslagen |
| Gebruikersvoorkeuren | Dark/light thema en laatste pagina blijven bewaard na herladen |

### Styling & Layout

| Concept | Bestand + uitleg |
|---|---|
| CSS Grid | `cards.css` — `.card-grid` gebruikt CSS grid |
| Flexbox | `main.css` — header en controls gebruiken flexbox |
| Gebruiksvriendelijke elementen | Ster knop voor favorieten, modal sluitknop, theme toggle, toast meldingen |

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
git clone https://github.com/JOUWUSERNAME/rick-and-morty-explorer.git
cd rick-and-morty-explorer
npm install
npm run dev
```

---

## Testen

Getest op:
- Google Chrome
- Mozilla Firefox
- Microsoft Edge
- Mobiel (responsive op 375px en 768px)

---

## 📝 Voortgang
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
- Lescursus Web Advanced — EHB (2024-2025)
- AI-assistent (Claude) gebruikt als hulpmiddel bij het project. Chatlog beschikbaar op aanvraag.
