import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleMode = () => {
    setIsLoginMode(prev => !prev);
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const url = isLoginMode
        ? process.env.REACT_APP_API_BASE_URL + '/api/auth/login'
        : process.env.REACT_APP_API_BASE_URL + '/api/auth/register';

      const payload = isLoginMode
        ? { email: formData.email, password: formData.password }
        : formData;

      const res = await axios.post(url, payload);

      if (isLoginMode) {
        localStorage.setItem('authToken', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        
        // Redirection basée sur le rôle de l'utilisateur
        if (res.data.user.role === 'admin') {
          navigate('/admin'); // Redirection vers le dashboard admin
        } else {
          navigate('/'); // Redirection normale pour les autres utilisateurs
        }
      } else {
        setMessage('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        setIsLoginMode(true);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Erreur inconnue';
      setMessage(msg);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h2 className="text-center mb-4">
        {isLoginMode ? 'Connexion' : 'Inscription'}
      </h2>

      {message && (
        <div className={`alert ${message.includes('réussie') ? 'alert-success' : 'alert-danger'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {!isLoginMode && (
          <div className="mb-3">
            <label>Nom</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Mot de passe</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          {isLoginMode ? 'Se connecter' : "S'inscrire"}
        </button>
      </form>

      <div className="text-center mt-3 d-flex">
        <button className="btn btn-link btn-primary w-100 m-1 bg-gradient" onClick={toggleMode}>
          {isLoginMode ? "Créer un compte" : "J'ai déjà un compte"}
        </button>
        {isLoginMode && (
          <div>
            <a href="/forgot-password" className='btn btn-primary w-100 m-1 bg-gradient'>Mot de passe oublié ?</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;