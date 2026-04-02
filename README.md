# KEXP Six Degrees Week Music Explorer

A web player for [KEXP](https://kexp.org)'s **Six Degrees Week** (March 20-27, 2026) with synced playlists and DJ commentary. Every song connected to the last, 24 hours a day, 7 days.

Six Degrees Week is a marathon event where every DJ on KEXP links every song to the one before it — by artist, genre, theme, sample, or any creative connection — across the entire week without a break. The DJ comments in the playlist explain each connection.

## Listen

**[https://l13w.github.io/KEXP-six-degrees-explorer/](https://l13w.github.io/KEXP-six-degrees-explorer/)**

Audio streams directly from KEXP's public archive. Playlist data (track listings, DJ commentary, album art) is baked into the app. No downloads, no setup — just open the URL in your browser.

## How It Works

**Show Selector** — Browse shows grouped by day. Each card shows the program name, DJ, time, genre tags, host photo, and the highlighted artist for each show's six degrees journey.

**Player** — Click a show to start listening. The left side shows the current track (album art, song, artist, album, labels). The right side is a scrollable playlist with each track's DJ commentary displayed inline — this is where the six degrees connections are explained.

**Transport Bar** — Play/pause, seek, and volume controls pinned at the bottom. Persists when browsing back to the show list. Volume is remembered across sessions.

**Continuous Playback** — When a show ends, the next one starts automatically with a brief transition overlay.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### Building for deployment

```bash
npm run build:web
```

This generates the `dist/` directory, which can be deployed to any static hosting (GitHub Pages, Netlify, Vercel, etc.).

## Tech Stack

- **React** + **Vite** for the frontend
- HTML5 `<audio>` streaming from KEXP's public archive
- Fonts: DM Serif Display, Outfit, JetBrains Mono (Google Fonts)
- No backend — all data is baked at build time

## Credits

Built with data from [KEXP 90.3 FM](https://kexp.org), Seattle's listener-powered radio. KEXP is a non-profit that depends on listener support — [donate here](https://kexp.org/donate).

This app links to KEXP's public archive and does not redistribute their content.
