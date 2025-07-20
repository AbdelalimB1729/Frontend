import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Films.css';

const API_BASE = process.env.REACT_APP_API_BASE_URL ;   // même base que vos blogs

export default function Films() {
  const [films,     setFilms]     = useState([]);
  const [filtered,  setFiltered]  = useState([]);
  const [genres,    setGenres]    = useState([]);
  const [loading,   setLoading]   = useState(true);

  /*-- filtres --*/
  const [query,       setQuery]      = useState('');
  const [activeGenre, setActiveGenre]= useState('all');

  /*-- fetch catalogue --*/
  useEffect(() => {
    fetch(`${API_BASE}/api/films`)
      .then(r => r.json())
      .then(data => {
        setFilms(data);
        setFiltered(data);
        setGenres(['all', ...new Set(data.map(f => f.genre || 'Divers'))]);
      })
      .finally(() => setLoading(false));
  }, []);

  /*-- handlers filtres/ search --*/
  const handleFilter = g => {
    setActiveGenre(g);
    setFiltered(g === 'all'
      ? films
      : films.filter(f => (f.genre || 'Divers') === g));
  };

  const handleSearch = e => {
    const q = e.target.value;
    setQuery(q);
    setFiltered(
      films.filter(f =>
        f.title.toLowerCase().includes(q.toLowerCase())
      )
    );
  };

  /*-- rendu --*/
  return (
    <div className="films-page">
      <header className="films-header">
        <h1>Catalogue Films</h1>
        <p>Parcourez, filtrez et découvrez vos prochains coups&nbsp;de&nbsp;cœur cinéma.</p>
      </header>

      {/* filtres */}
      <div className="films-filters">
        <div className="genre-buttons">
          {genres.map(g => (
            <button
              key={g}
              className={g === activeGenre ? 'active' : ''}
              onClick={() => handleFilter(g)}
            >
              {g}
            </button>
          ))}
        </div>

        <div className="search-box">
          <FaSearch />
          <input
            value={query}
            onChange={handleSearch}
            placeholder="Rechercher…"
          />
        </div>
      </div>

      {loading ? (
        <p className="spinner">Chargement…</p>
      ) : (
        <section className="films-grid">
          {filtered.map(f => (
            <article key={f._id} className="film-card">
              {f.poster && <img src={f.poster} alt={f.title} />}
              <div className="card-content">
                <h3>
                  {f.title}{' '}
                  <span className="year">({f.year || '—'})</span>
                </h3>
                <p className="genre-tag">{f.genre || 'Divers'}</p>

                <p className="synopsis">
                  {(f.synopsis || '').slice(0, 160)}…
                 <Link to={`/films/${f._id}`} className="read-next">Lire suivant</Link>
                </p>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
