import { Link } from 'react-router-dom';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaYoutube,
  FaHome,
  FaFilm,
  FaBlog,
  FaEnvelope,
  FaFistRaised,
  FaTheaterMasks,
  FaLaugh,
  FaRocket
} from 'react-icons/fa';
import './Footer.css'; 

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer bg-dark text-light pt-5 pb-4">
      <div className="container">
        <div className="row g-4">
          {/* Colonne 1 - À propos */}
          <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <div className="d-flex align-items-center mb-3">
              <div className="bg-pink p-2 rounded me-2">
                <FaFilm className="fs-4" />
              </div>
              <h3 className="h4 mb-0">CineSphere</h3>
            </div>
            <p className="text-light-60 mb-3">
              Votre plateforme complète pour découvrir, réserver et partager votre passion du cinéma.
            </p>
            <div className="social-icons d-flex gap-2">
              {[
                { icon: <FaFacebookF />, label: "Facebook", url: "#" },
                { icon: <FaTwitter />, label: "Twitter", url: "#" },
                { icon: <FaInstagram />, label: "Instagram", url: "#" },
                { icon: <FaYoutube />, label: "YouTube", url: "#" }
              ].map((social, index) => (
                <a 
                  key={index}
                  href={social.url}
                  className="social-icon d-flex align-items-center justify-content-center rounded-circle"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Colonne 2 - Liens rapides */}
          <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <h3 className="h5 mb-3 pb-2 border-bottom border-pink border-2 d-inline-block">
              Liens rapides
            </h3>
            <ul className="list-unstyled">
              {[
                { to: "/", label: "Accueil", icon: <FaHome className="me-2" /> },
                { to: "/films", label: "Films à l'affiche", icon: <FaFilm className="me-2" /> },
                { to: "/blogs", label: "Blogs", icon: <FaBlog className="me-2" /> },
                { to: "/contact", label: "Contact", icon: <FaEnvelope className="me-2" /> }
              ].map((link, index) => (
                <li key={index} className="mb-2">
                  <Link 
                    to={link.to} 
                    className="footer-link d-flex align-items-center py-1"
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 3 - Catégories */}
          <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <h3 className="h5 mb-3 pb-2 border-bottom border-pink border-2 d-inline-block">
              Catégories
            </h3>
            <ul className="list-unstyled">
              {[
                { genre: "action", label: "Action", icon: <FaFistRaised className="me-2" /> },
                { genre: "drame", label: "Drame", icon: <FaTheaterMasks className="me-2" /> },
                { genre: "comedie", label: "Comédie", icon: <FaLaugh className="me-2" /> },
                { genre: "science-fiction", label: "Science-fiction", icon: <FaRocket className="me-2" /> }
              ].map((category, index) => (
                <li key={index} className="mb-2">
                  <Link 
                    to={`/films?genre=${category.genre}`} 
                    className="footer-link d-flex align-items-center py-1"
                  >
                    {category.icon}
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 4 - Newsletter */}
          <div className="col-lg-3 col-md-6">
            <h3 className="h5 mb-3 pb-2 border-bottom border-pink border-2 d-inline-block">
              Newsletter
            </h3>
            <p className="text-light-60 mb-3">
              Inscrivez-vous pour recevoir les dernières actualités et offres spéciales.
            </p>
            <div className="input-group mb-3">
              <input 
                type="email" 
                className="form-control bg-gray-800 border-0 text-light" 
                placeholder="Votre email" 
                aria-label="Votre email"
              />
              <button 
                className="btn btn-pink px-3" 
                type="button"
              >
                S'inscrire
              </button>
            </div>
            <small className="text-light-50">
              Nous ne partageons jamais votre email avec des tiers
            </small>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-5 pt-4 border-top border-gray-700 text-center text-light-50">
          &copy; {currentYear} CineSphere. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer;