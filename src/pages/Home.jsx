import './Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  const isFilmsBlocked = true; // change to false to activer le bouton

  const movies = [
    {
      id: 1,
      title: "The Irishman",
      genre: "Crime, Drame",
      rating: 7.8,
      poster: "https://m.media-amazon.com/images/M/MV5BMTY2YThkNmQtOWJhYy00ZDc3LWEzOGEtMmQwNzM0YjFmZWIyXkEyXkFqcGc@._V1_.jpg"
    },
    {
      id: 2,
      title: "The Pianist",
      genre: "Biographie, Drame",
      rating: 8.5,
      poster: "https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p30193_p_v13_aa.jpg"
    },
    {
      id: 3,
      title: "Scent of a Woman",
      genre: "Drame",
      rating: 8.0,
      poster: "https://m.media-amazon.com/images/M/MV5BNzc5ODg2NzMtYTQ4MS00MWFiLWI5NWMtNWNkODNmZjE0ZGVjXkEyXkFqcGc@._V1_.jpg"
    },
    {
      id: 4,
      title: "The Devil's Advocate",
      genre: "Thriller, Drame",
      rating: 7.5,
      poster: "https://m.media-amazon.com/images/M/MV5BNGIxZmU2ZjEtYjc3OC00Y2FiLWE2ZTQtZGI3NzE0YmRhOTMxXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg"
    }
  ];

  const reviews = [
    {
      id: 1,
      author: "Sophie Martin",
      role: "Cinéphile passionnée",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      content: "\"The Irishman est un chef-d'œuvre de Martin Scorsese. La performance de Robert De Niro est tout simplement époustouflante.\"",
      movie: "The Irishman"
    },
    {
      id: 2,
      author: "Thomas Dubois",
      role: "Critique professionnel",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      content: "\"The Pianist est une œuvre bouleversante qui nous plonge dans l'horreur de la guerre avec une sensibilité rare.\"",
      movie: "The Pianist"
    },
    {
      id: 3,
      author: "Camille Leroy",
      role: "Rédactrice cinéma",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      content: "\"Scent of a Woman est une leçon de cinéma. Al Pacino livre une performance magistrale dans ce rôle d'homme aveugle rebelle.\"",
      movie: "Scent of a Woman"
    }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Votre univers cinématographique complet</h1>
          <p>Découvrez, réservez et partagez votre passion du cinéma. Explorez les derniers films, lisez les critiques des blogueurs et réservez vos places en quelques clics.</p>
          <div className="hero-buttons">
            <Link
              to={isFilmsBlocked ? "#" : "/films"}
              className={`cta-button ${isFilmsBlocked ? "disabled" : ""}`}
              onClick={(e) => {
                if (isFilmsBlocked) {
                  e.preventDefault();
                  alert("Accès aux films bloqué pour le moment.");
                }
              }}
            >
              Voir les films
            </Link>
            <Link to="/blogs" className="cta-button secondary">Lire les blogs</Link>
          </div>
        </div>
        <div className="hero-bg">
          <img src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" alt="Cinéma" />
        </div>
      </section>

      {/* Movies Section */}
      <section className="movies">
        <div className="section-title">
          <h2>Films à l'affiche</h2>
        </div>
        <div className="movie-grid">
          {movies.map(movie => (
            <div key={movie.id} className="movie-card">
              <div className="movie-poster">
                <img src={movie.poster} alt={movie.title} />
              </div>
              <div className="movie-info">
                <h3 className="movie-title">{movie.title}</h3>
                <div className="movie-meta">
                  <span>{movie.genre}</span>
                  <span className="movie-rating">
                    <i className="fas fa-star"></i> {movie.rating}
                  </span>
                </div>
                <div className="movie-buttons">
                  <Link to={`/booking/${movie.id}`} className="btn btn-primary">Réserver</Link>
                  <Link to={`/films/${movie.id}`} className="btn btn-secondary">Détails</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="reviews">
        <div className="section-title">
          <h2>Critiques de nos blogueurs</h2>
        </div>
        <div className="review-container">
          <div className="review-grid">
            {reviews.map(review => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="review-avatar">
                    <img src={review.avatar} alt={review.author} />
                  </div>
                  <div className="review-author">
                    <h3>{review.author}</h3>
                    <p>{review.role}</p>
                  </div>
                </div>
                <div className="review-content">
                  <p>{review.content}</p>
                </div>
                <div className="review-movie">
                  <i className="fas fa-film"></i>
                  <span>{review.movie}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ticketing Section */}
      <section className="ticketing">
        <div className="section-title">
          <h2>Réservez vos billets</h2>
        </div>
        <div className="ticketing-container">
          <div className="ticketing-form">
            <h3>Réservez votre séance</h3>
            <div className="form-group">
              <label htmlFor="movie">Film</label>
              <select id="movie">
                {movies.map(movie => (
                  <option key={movie.id}>{movie.title}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="cinema">Cinéma</label>
              <select id="cinema">
                <option>Pathé Beaugrenelle</option>
                <option>UGC Ciné Cité Les Halles</option>
                <option>MK2 Bibliothèque</option>
                <option>Grand Rex</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input type="date" id="date" />
            </div>
            <div className="form-group">
              <label htmlFor="time">Horaire</label>
              <select id="time">
                <option>14h00</option>
                <option>16h30</option>
                <option>19h00</option>
                <option>21h30</option>
              </select>
            </div>
            <button className="cta-button">Voir les places disponibles</button>
          </div>
          <div className="ticketing-image"></div>
        </div>
      </section>
    </div>
  );
};

export default Home;
