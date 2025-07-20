import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RatingStars from '../components/RatingStars';
import './Films.css';

const API_BASE = process.env.REACT_APP_API_BASE_URL ;

export default function FilmDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [film, setFilm] = useState(null);
  const [notFound, setNF] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [myStars, setMyStars] = useState(0);
  const [comment, setComment] = useState('');
  const [userRating, setUserRating] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [error, setError] = useState('');

  /* ---------- FETCH FILM AND RATINGS ---------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch film data
        const filmResponse = await fetch(`${API_BASE}/api/films/${id}`);
        if (!filmResponse.ok) {
          setNF(true);
          return;
        }
        const filmData = await filmResponse.json();
        setFilm(filmData);

        // Fetch ratings
        const ratingsResponse = await fetch(`${API_BASE}/api/ratings?film=${id}`);
        if (!ratingsResponse.ok) {
          throw new Error('Failed to fetch ratings');
        }
        const ratingsData = await ratingsResponse.json();
        setRatings(ratingsData);

        // Check if user has rated this film
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const userId = payload.id; // Assurez-vous que c'est "id" ou "userId" selon votre token
            
            const existingRating = ratingsData.find(r => 
              r.user && (typeof r.user === 'string' 
                ? r.user === userId 
                : r.user._id === userId)
            );
            
            setUserRating(existingRating || null);
          } catch (e) {
            console.error("Token parsing error:", e);
          }
        }
      } catch (error) {
        console.error("Data loading error:", error);
        setNF(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  /* ---------- SUBMIT NEW RATING ---------- */
  const submitRating = async () => {
    if (!myStars) return;
    
    if (!token) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/api/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          film: id, 
          stars: myStars, 
          comment 
        }),
      });

      if (response.status === 401) {
        localStorage.removeItem('authToken');
        setToken(null);
        navigate('/login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Rating submission failed');
      }

      const newRating = await response.json();
      
      // Mettre à jour les ratings et la notation utilisateur
      setRatings(prev => [newRating, ...prev]);
      setUserRating(newRating);
      setMyStars(0);
      setComment('');
    } catch (error) {
      console.error("Submission error:", error);
      
      let errorMessage = 'Erreur lors de la soumission de la note';
      
      if (error.message.includes('E11000') || 
          error.message.includes('déjà noté')) {
        errorMessage = "Vous avez déjà noté ce film. Vous pouvez modifier votre note existante.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------- UPDATE EXISTING RATING ---------- */
  const updateRating = async () => {
    if (!myStars || !userRating) return;
    
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/api/ratings/${userRating._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          stars: myStars, 
          comment 
        }),
      });

      if (response.status === 401) {
        localStorage.removeItem('authToken');
        setToken(null);
        navigate('/login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Rating update failed');
      }

      const updatedRating = await response.json();
      
      // Mettre à jour les ratings et la notation utilisateur
      setRatings(prev => 
        prev.map(r => r._id === userRating._id ? updatedRating : r)
      );
      setUserRating(updatedRating);
      setMyStars(0);
      setComment('');
    } catch (error) {
      console.error("Update error:", error);
      setError(error.message || 'Erreur lors de la mise à jour de la note');
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------- HANDLE RATING SUBMISSION ---------- */
  const handleRatingSubmit = () => {
    if (userRating) {
      updateRating();
    } else {
      submitRating();
    }
  };

  /* ---------- HANDLE EDIT CLICK ---------- */
  const handleEditClick = () => {
    if (userRating) {
      setMyStars(userRating.stars);
      setComment(userRating.comment || '');
    }
  };

  /* ---------- RENDER ---------- */
  if (notFound) return <p className="center-msg">Film introuvable.</p>;
  if (!film) return <p className="center-msg">Chargement…</p>;

  const totalStars = ratings.reduce((sum, r) => sum + r.stars, 0);
  const avg = ratings.length ? (totalStars / ratings.length).toFixed(1) : 0;

  return (
    <div className="film-details-page">
      <button className="back-btn cta-button" onClick={() => navigate(-1)}>
        ← Retour
      </button>

      <article className="film-detail-card">
        {film.poster && (
          <img 
            className="detail-hero" 
            src={film.poster} 
            alt={film.title} 
            onError={(e) => e.target.src = '/placeholder.jpg'} 
          />
        )}

        <div className="detail-content">
          <h1>
            {film.title}{' '}
            {film.year && <span className="year">({film.year})</span>}
          </h1>

          <p className="detail-meta">
            {film.genre?.join(', ') || 'Genre inconnu'}
            {' — '}
            Réal. {film.director || 'N/A'}
          </p>

          <div className="avg-block">
            <RatingStars value={avg} readOnly />
            <span className="avg-note">{avg} / 5</span>
            <span className="rating-count">({ratings.length} avis)</span>
          </div>

          <hr />

          <p className="detail-text">{film.description}</p>

          {!token ? (
            <div className="login-prompt">
              <p>Connectez-vous pour noter ce film</p>
              <button 
                className="cta-button"
                onClick={() => navigate('/login')}
              >
                Se connecter
              </button>
            </div>
          ) : userRating && !myStars ? (
            <section className="user-rating-box">
              <h2>Votre avis</h2>
              <div className="user-rating">
                <RatingStars value={userRating.stars} readOnly />
                <p>{userRating.comment || '—'}</p>
              </div>
              <button 
                className="edit-button"
                onClick={handleEditClick}
              >
                Modifier
              </button>
            </section>
          ) : (
            <section className="rate-box">
              <h2>{userRating ? "Modifier votre note" : "Laisser une note"}</h2>
              <RatingStars value={myStars} onChange={setMyStars} />
              <textarea
                placeholder="Commentaire (facultatif)"
                rows="3"
                value={comment}
                onChange={e => setComment(e.target.value)}
                maxLength={500}
              />
              <div className="char-count">{comment.length}/500</div>
              
              {error && <p className="error-message">{error}</p>}
              
              <div className="button-group">
                <button
                  className="cta-button"
                  disabled={!myStars || isLoading}
                  onClick={handleRatingSubmit}
                >
                  {isLoading 
                    ? (userRating ? 'Mise à jour...' : 'Publication...') 
                    : (userRating ? 'Mettre à jour' : 'Publier ma note')}
                </button>
                {userRating && (
                  <button 
                    className="cancel-button"
                    onClick={() => {
                      setMyStars(0);
                      setComment('');
                    }}
                    disabled={isLoading}
                  >
                    Annuler
                  </button>
                )}
              </div>
            </section>
          )}

          <h2>Avis des spectateurs</h2>
          <ul className="rating-list">
            {ratings
              .filter(r => !userRating || r._id !== userRating._id)
              .map(r => (
                <li key={r._id}>
                  <div className="rating-header">
                    <RatingStars value={r.stars} readOnly />
                    <b>{r.user?.name || 'Anonyme'}</b>
                    <span className="rating-date">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="rating-comment">{r.comment || '—'}</p>
                </li>
              ))}
            {ratings.length === 0 && <p className="no-ratings">Pas encore d'avis. Soyez le premier à noter !</p>}
          </ul>
        </div>
      </article>
    </div>
  );
}