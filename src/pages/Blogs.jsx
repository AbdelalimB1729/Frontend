import { useEffect, useState } from 'react';
import { FaSearch, FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Blogs.css';
import AvgStars from '../components/AvgStars';

const API_BASE = process.env.REACT_APP_API_BASE_URL ;

export default function Blogs() {
  const [articles,  setArticles]   = useState([]);
  const [filtered,  setFiltered]   = useState([]);
  const [categories,setCategories] = useState([]);
  const [loading,   setLoading]    = useState(true);
  const [error,     setError]      = useState(null);

  // filtres
  const [query, setQuery]       = useState('');
  const [activeCat,setActiveCat]   = useState('all');

  // modal création
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title:'', content:'', category:'', image:null });
  const [preview,  setPreview]  = useState(null);

  /* -------- fetch articles -------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/blog`);
        if (!response.ok) {
          throw new Error('Échec du chargement des articles');
        }
        const data = await response.json();
        setArticles(data);
        setFiltered(data);
        setCategories(['all', ...new Set(data.map(a => a.category || 'Divers'))]);
      } catch (err) {
        console.error('Erreur:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* -------- filtres -------- */
  const handleFilter = c => {
    setActiveCat(c);
    setFiltered(c === 'all' ? articles : articles.filter(a => (a.category || 'Divers') === c));
  };
  
  const handleSearch = e => {
    const q = e.target.value;
    setQuery(q);
    setFiltered(articles.filter(a => 
      a.title.toLowerCase().includes(q.toLowerCase())
    ));
  };

  /* -------- publier -------- */
  const submitArticle = async e => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    if (!token) return alert('Connecte-toi pour publier');
    
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => v && data.append(k, v));

      const res = await fetch(`${API_BASE}/api/blog`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: data
      });
      
      if (!res.ok) throw new Error('Échec de la création');
      
      const art = await res.json();
      setArticles([art, ...articles]); 
      handleFilter(activeCat);
      setShowForm(false); 
      setPreview(null);
      setFormData({ title: '', content: '', category: '', image: null });
    } catch (err) {
      console.error('Erreur création:', err);
      alert(err.message);
    }
  };

  /* -------- rendu -------- */
  return (
    <div className="blogs-page">
      <header className="blogs-header">
        <h1>Blog Cinéma</h1>
        <p>Découvrez les critiques des passionnés et partagez la vôtre !</p>
      </header>

      {/* filtres */}
      <div className="blogs-filters">
        <div className="cat-buttons">
          {categories.map(c => (
            <button 
              key={c} 
              className={c === activeCat ? 'active' : ''} 
              onClick={() => handleFilter(c)}
            >
              {c}
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
        <button className="cta-button" onClick={() => setShowForm(true)}>
          + Écrire
        </button>
      </div>

      {loading ? (
        <p className="spinner">Chargement…</p>
      ) : error ? (
        <p className="error">Erreur: {error}</p>
      ) : (
        <section className="blogs-grid">
          {filtered.length > 0 ? (
            filtered.map(a => (
              <article key={a._id} className="blog-card">
                {a.image && <img src={a.image} alt={a.title} />}
                <div className="card-content">
                  <h3>{a.title}</h3>
                  <p className="author">{a.author?.name || 'Anonyme'}</p>
                  <p className="excerpt">
                    {(a.content || '').slice(0, 160)}
                    {(a.content?.length || 0) > 160 ? '…' : ''}
                    <Link to={`/blogs/${a._id}`}>Lire la suite</Link>
                  </p>
                  <AvgStars articleId={a._id} />
                </div>
              </article>
            ))
          ) : (
            <p className="no-results">Aucun article trouvé</p>
          )}
        </section>
      )}

      {/* modal création */}
      {showForm && (
        <div className="modal-backdrop" onClick={() => setShowForm(false)}>
          <form 
            className="blog-form" 
            onClick={e => e.stopPropagation()} 
            onSubmit={submitArticle}
          >
            <h2>Nouvel article</h2>
            <input 
              required 
              placeholder="Titre" 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})} 
            />
            <textarea 
              required 
              rows="6" 
              placeholder="Contenu" 
              value={formData.content}
              onChange={e => setFormData({...formData, content: e.target.value})}
            />
            <input 
              placeholder="Catégorie" 
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})} 
            />
            <input 
              type="file" 
              accept="image/*" 
              onChange={e => {
                const f = e.target.files[0]; 
                setFormData({...formData, image: f}); 
                setPreview(f ? URL.createObjectURL(f) : null);
              }} 
            />
            {preview && <img className="img-preview" src={preview} alt="preview" />}
            <div className="form-actions">
              <button type="button" onClick={() => setShowForm(false)}>
                Annuler
              </button>
              <button className="cta-button" type="submit">
                Publier
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}