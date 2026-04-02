import ShowCard from './ShowCard';

export default function ShowSelector({ dayGroups, onSelectShow }) {
  let globalCardIndex = 0;

  return (
    <div className="show-selector">
      <div className="selector-top-links">
        <a
          className="selector-top-link"
          href="https://www.kexp.org/sixdegrees/2026-six-degrees-week/"
          target="_blank"
          rel="noopener noreferrer"
        >
          About KEXP's Six Degrees Week
        </a>
        <span className="selector-top-divider">/</span>
        <a
          className="selector-top-link"
          href="https://github.com/L13w/KEXP-six-degrees-explorer"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg className="selector-github-icon" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
          GitHub
        </a>
      </div>

      <div className="selector-hero">
        <h1 className="selector-title">KEXP Six Degrees Week Music Explorer</h1>
        <hr className="selector-rule" />
        <p className="selector-subtitle">
          March 20–27, 2026 · Every song connected to the last · 24 hours a day · 7 days
        </p>
      </div>

      {dayGroups.map(day => (
        <div className="day-group" key={day.key}>
          <div className="day-header">
            <span className="day-header-text">{day.label}</span>
            <span className="day-header-line" />
          </div>
          <div className="card-grid">
            {day.shows.map(show => {
              const idx = globalCardIndex++;
              return (
                <ShowCard
                  key={show.filename}
                  show={show}
                  animDelay={idx * 0.04}
                  onClick={() => show.hasMP3 && onSelectShow(show)}
                />
              );
            })}
          </div>
        </div>
      ))}

      <div className="kexp-credit">
        Powered by <a href="https://kexp.org" target="_blank" rel="noopener noreferrer">KEXP 90.3 FM</a> — Seattle's listener-powered radio.
        {' '}<a href="https://kexp.org/donate" target="_blank" rel="noopener noreferrer">Support KEXP</a>
      </div>
    </div>
  );
}
