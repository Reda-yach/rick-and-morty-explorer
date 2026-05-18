# 🛸 Rick & Morty Explorer

Een interactieve Single Page Application gebouwd voor het vak **Web Advanced**.

## 📋 Projectbeschrijving

Rick & Morty Explorer is een SPA waarmee gebruikers de volledige wereld van Rick & Morty kunnen verkennen. Je kan characters, episodes en locaties filteren, zoeken en sorteren. Favoriete characters kan je opslaan — ze blijven bewaard tussen sessies via localStorage.

## 🌐 Gebruikte API

- **Rick and Morty API** — https://rickandmortyapi.com/
  - `/character` — characters ophalen met filters
  - `/episode` — episodes ophalen
  - `/location` — locaties ophalen

## ✨ Functionaliteiten

- 🔍 Zoeken op naam (characters, episodes, locaties)
- 🎛️ Filteren op status, species, gender, seizoen, locatietype
- 🔃 Sorteren op ID of naam (A-Z / Z-A)
- ⭐ Favorieten opslaan en beheren (blijft bewaard in localStorage)
- 🌙 Dark/Light theme switcher (voorkeur wordt opgeslagen)
- 📄 Paginatie voor alle 3 de secties
- 🖼️ Character detail modal
- 📱 Responsive design (mobiel-vriendelijk)

---

## 🛠️ Technische vereisten — Implementatie

### DOM Manipulatie

| Concept | Waar in de code |
|---|---|
| Elementen selecteren | `ui.js` regel 1 — `document.querySelector()`, `document.querySelectorAll()` |
| Elementen manipuleren | `ui.js` — `createElement`, `appendChild`, `innerHTML`, `classList.toggle` |
| Events koppelen | `main.js` — `addEventListener` voor click, input, change, keydown, load |

### Modern JavaScript

| Concept | Waar in de code |
|---|---|
| `const` | Overal — `api.js` r1: `const BASE_URL`, `storage.js` r8: `const KEYS` |
| Template literals | `ui.js` r47: card innerHTML, `api.js` r26: URL opbouw |
| Iteratie over arrays | `main.js` r105: `forEach`, r168: `for...of` |
| Array methodes | `storage.js` r35: `findIndex`, `splice`, `push`, `some`; `main.js` r186: `.map()` |
| Arrow functions | Overal — bv. `api.js` r20: `const fetchFromAPI = async (endpoint) => {...}` |
| Ternary operator | `ui.js` r51: `favorited ? '⭐' : '☆'`; `main.js` r210: noFavMsg toggle |
| Callback functions | `main.js` r117: debounce setTimeout callback; `ui.js` r65: event handlers |
| Promises | `api.js` r20: `fetchFromAPI` returns Promise; `ui.js` r124: `.then()` chaining |
| Async & Await | `main.js` r95: `loadCharacters`, r162: `loadEpisodes`, r185: `loadLocations` |
| Observer API | `ui.js` r133: `IntersectionObserver` (card animaties); `main.js` r226: `MutationObserver` |

### Data & API

| Concept | Waar in de code |
|---|---|
| Fetch | `api.js` r22: `fetch(...)` met error handling |
| JSON manipuleren | `storage.js` r16: `JSON.parse`, r29: `JSON.stringify`; `api.js` r25: `response.json()` |

### Opslag & Validatie

| Concept | Waar in de code |
|---|---|
| LocalStorage | `storage.js` — alle functies; thema + favorieten + last page bewaard |
| Gebruikersvoorkeuren | Theme (dark/light) en laatste bezochte pagina worden bewaard |

### Styling & Layout

| Concept | Waar in de code |
|---|---|
| Flexbox / CSS Grid | `main.css` — header flexbox; `cards.css` — card-grid CSS Grid |
| Basis CSS | `main.css`, `cards.css`, `filters.css` — volledige custom CSS met CSS variables |
| Gebruiksvriendelijke elementen | Favorieten ⭐ knop, verwijderknoppen, theme toggle, modal close |

### Tooling & Structuur

| Concept | Waar |
|---|---|
| Vite | `package.json` + `vite.config.js` |
| Folderstructuur | `src/js/`, `src/css/`, `dist/` (na build) |
| ES Modules | Alle JS-bestanden gebruiken `import`/`export` |

---

## 📁 Folderstructuur

```
rick-and-morty-explorer/
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
├── README.md
├── src/
│   ├── js/
│   │   ├── main.js       # App entry point, navigatie, event handling
│   │   ├── api.js        # Fetch calls naar Rick & Morty API
│   │   ├── storage.js    # LocalStorage helpers
│   │   └── ui.js         # DOM rendering & Observer API
│   └── css/
│       ├── main.css      # Globale stijlen, theming, layout
│       ├── cards.css     # Card componenten
│       └── filters.css   # Filter UI elementen
└── dist/                 # Gegenereerd door `npm run build`
```

---

## 🚀 Installatiehandleiding

### Vereisten
- Node.js (v18 of hoger) — https://nodejs.org/
- npm (wordt meegeleverd met Node.js)

### Stappen

```bash
# 1. Clone de repository
git clone https://github.com/JOUWUSERNAME/rick-and-morty-explorer.git

# 2. Ga naar de map
cd rick-and-morty-explorer

# 3. Installeer dependencies
npm install

# 4. Start de development server
npm run dev
# → opent automatisch http://localhost:5173

# 5. Productie build maken
npm run build

# 6. Productie build testen
npm run preview
```

---

## 📸 Functionaliteiten in beeld

- **Characters pagina:** grid met 20 characters per pagina, 
  filterbaar op status/species/gender, sorteerbaar op naam of ID
- **Episodes pagina:** alle episodes per seizoen te filteren
- **Locations pagina:** alle dimensies en planeten uit het universum
- **Favorieten:** opgeslagen via localStorage, blijft na herladen
- **Dark/Light mode:** themavoorkeur wordt bewaard

---

## 📚 Gebruikte bronnen

- Rick and Morty API documentatie: https://rickandmortyapi.com/documentation
- MDN Web Docs — Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- MDN Web Docs — localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- MDN Web Docs — IntersectionObserver: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
- Vite documentatie: https://vitejs.dev/
- Lescursus Web Advanced — EHB (2024-2025)
- AI-assistent (Claude): gebruikt voor code review en probleemoplossing. Chatlog beschikbaar op aanvraag.

## 📝 Voortgang
- [x] Project opgezet met Vite
- [x] Rick and Morty API gekoppeld
- [ ] Favorieten systeem testen
- [ ] Responsive design verfijnen
