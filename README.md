# 🧠 MemOS — Page Replacement Simulator

Interactive simulator for **FIFO**, **LRU**, and **Optimal** page replacement algorithms.

**Stack:** Node.js · Express · HTML / CSS / JS

---

## 🚀 Getting Started

```bash
npm install
npm start
# open http://localhost:3000
```

> Dev mode (auto-reload): `npm run dev` — requires `nodemon`

---

## 📁 Structure

```
├── server.js              # Express entry point
├── algorithms/
│   ├── fifo.js
│   ├── lru.js
│   └── optimal.js
├── routes/
│   ├── simulate.js        # POST /api/simulate
│   └── compare.js         # POST /api/compare
└── public/
    ├── index.html
    ├── css/
    │   ├── style.css      # ← browser loads this (bundled)
    │   └── *.css          # individual modules (edit these)
    └── js/
        ├── utils.js       # shared App state + helpers
        ├── background.js  # canvas animation
        ├── playback.js    # play / pause / step
        ├── simulator.js   # core simulation engine
        ├── comparison.js  # compare all algorithms
        ├── tour.js        # guided tour
        ├── boot.js        # boot screen
        └── keyboard.js    # keyboard shortcuts
```

---

## 🔌 API

### `POST /api/simulate`

```json
{ "pages": [7, 0, 1, 2, 0, 3], "frames": 3, "algorithm": "fifo" }
```

### `POST /api/compare`

```json
{ "pages": [7, 0, 1, 2, 0, 3], "frames": 3 }
```

---

## ⌨️ Keyboard Shortcuts

| Key     | Action              |
| ------- | ------------------- |
| `→ / ←` | Step forward / back |
| `Space` | Play / Pause        |
| `R`     | Run simulation      |
| `Esc`   | Close tour          |

---

## 🔄 Rebuild CSS Bundle

After editing any CSS module, regenerate `style.css`:

```bash
cat public/css/variables.css public/css/base.css public/css/boot.css \
    public/css/tour.css public/css/hero.css public/css/algorithms.css \
    public/css/simulator.css public/css/table.css public/css/comparison.css \
    public/css/footer.css public/css/reasoning.css public/css/overrides.css \
    > public/css/style.css
```

---

Built with ❤️ for **LPU** 🚀
