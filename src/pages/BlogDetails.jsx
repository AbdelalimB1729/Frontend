import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RatingStars from '../components/RatingStars';
import './Blogs.css';

const API_BASE = process.env.REACT_APP_API_BASE_URL ;

export default function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [myStars, setMyStars] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  /* ---------- FETCH ARTICLE ---------- */
  useEffect(() => {
    fetch(`${API_BASE}/api/blog/${id}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(setArticle)
      .catch(() => setNotFound(true));
  }, [id]);

  /* ---------- FETCH RATINGS ---------- */
  useEffect(() => {
    fetch(`${API_BASE}/api/ratings?article=${id}`)
      .then(r => r.json())
      .then(setRatings)
      .catch(err => console.error("Erreur chargement notes:", err));
  }, [id]);

  /* ---------- SUBMIT RATING ---------- */
  const submitRating = () => {
    if (!myStars) return;
    
    const token = localStorage.getItem('authToken');
    if (!token) return alert('Connecte-toi pour noter.');

    setIsSubmitting(true);
    setError('');
    
    fetch(`${API_BASE}/api/ratings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        article: id, 
        stars: myStars, 
        comment 
      }),
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => {
          throw new Error(err.message || 'Erreur serveur');
        });
      }
      return response.json();
    })
    .then(newRating => {
      setRatings(prev => [newRating, ...prev]);
      setMyStars(0);
      setComment('');
    })
    .catch(err => {
      setError(err.message);
      console.error("Erreur soumission:", err);
    })
    .finally(() => setIsSubmitting(false));
  };

  /* ---------- RENDER ---------- */
  if (notFound) return <p className="center-msg">Article introuvable.</p>;
  if (!article) return <p className="center-msg">Chargement…</p>;

  const avg = ratings.reduce((sum, r) => sum + r.stars, 0) / (ratings.length || 1);

  return (
    <div className="blog-details-page">
      <button className="back-btn cta-button" onClick={() => navigate(-1)}>
        ← Retour
      </button>

      <article className="blog-detail-card">
        {article.image && (
          <img 
            className="detail-hero" 
            src={article.image} 
            alt={article.title} 
          />
        )}

        <div className="detail-content">
          <h1>{article.title}</h1>
          <p className="detail-author">
            par {article.author?.name || 'Anonyme'} —{' '}
            {new Date(article.createdAt).toLocaleDateString()}
          </p>

          <div className="avg-block">
            <RatingStars value={avg} readOnly />
            <span className="avg-note">
              {avg.toFixed(1)} / 5 ({ratings.length} avis)
            </span>
          </div>

          <hr />

          <p className="detail-text">{article.content}</p>

          {/* ---------- LAISSER UNE NOTE ---------- */}
          <section className="rate-box">
            <h2>Laisser une note</h2>
            <RatingStars 
              value={myStars} 
              onChange={setMyStars} 
            />
            
            <textarea
              placeholder="Commentaire (facultatif)"
              rows="3"
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
            
            {error && <p className="error-message">{error}</p>}
            
            <button
              className="cta-button"
              disabled={!myStars || isSubmitting}
              onClick={submitRating}
            >
              {isSubmitting ? 'Publication...' : 'Publier ma note'}
            </button>
          </section>

          {/* ---------- LISTE AVIS ---------- */}
          <h2>Avis des lecteurs</h2>
          <ul className="rating-list">
            {ratings.map(r => (
              <li key={r._id}>
                <div className="rating-header">
                  <RatingStars value={r.stars} readOnly />
                  <b>{r.user?.name || 'Anonyme'}</b>
                </div>
                <p className="rating-comment">
                  {r.comment || '—'}
                </p>
                <small>
                  {new Date(r.createdAt).toLocaleDateString()}
                </small>
              </li>
            ))}
            
            {ratings.length === 0 && (
              <p className="no-ratings">Pas encore d'avis. Soyez le premier à noter !</p>
            )}
          </ul>
        </div>
      </article>
    </div>
  );
}