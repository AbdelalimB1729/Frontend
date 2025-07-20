import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="header-container">
      <div className="brand">
        <Link to="/" className="brand-link">
          <span className="brand-icon">🎬</span>
          <span className="brand-name">CineSphere</span>
        </Link>
      </div>

      <nav className="nav-menu">
        <div className="nav-links">
          <Link to="/films" className="nav-link">Films</Link>
          <Link to="/blogs" className="nav-link">Blogs</Link>
          <Link to="/chat" className="nav-link">Chat</Link>
          <Link to="/cinema" className="nav-link">Cinéma</Link>
        </div>
        
        <div className="user-section">
          {user ? (
            <div className="dropdown-container">
              <div className="user-profile">
                <span className="user-icon">👤</span>
                <span className="user-name">{user.name}</span>
              </div>
              <div className="dropdown-content">
                <button 
                  className="logout-button"
                  onClick={handleLogout}
                >
                  Déconnexion
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="login-button">Connexion</Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;