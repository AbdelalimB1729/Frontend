import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setSuccess(false);
    setLoading(true);

    try {
      const res = await axios.post(process.env.REACT_APP_API_BASE_URL + '/api/auth/forgot-password', { email });
      setSuccess(true);
      setMessage('Un lien de réinitialisation a été envoyé à votre adresse email.');
    } catch (error) {
      const msg = error.response?.data?.message || 'Erreur lors de l’envoi de l’email';
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h2 className="text-center mb-4">Mot de passe oublié</h2>
      {message && (
        <div className={`alert ${success ? 'alert-success' : 'alert-danger'}`}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Adresse Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Entrez votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
