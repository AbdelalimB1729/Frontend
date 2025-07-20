import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await axios.post(process.env.REACT_APP_API_BASE_URL + `/api/auth/reset-password/${token}`, {
        newPassword,
      });
      setMessage('Mot de passe modifié avec succès ! Vous pouvez maintenant vous connecter.');
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      const msg = error.response?.data?.message || 'Erreur lors de la réinitialisation';
      setMessage(msg);
      setSuccess(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h2 className="text-center mb-4">Nouveau mot de passe</h2>
      {message && (
        <div className={`alert ${success ? 'alert-success' : 'alert-danger'}`}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Nouveau mot de passe</label>
          <input
            type="password"
            className="form-control"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Réinitialiser</button>
      </form>
    </div>
  );
};

export default ResetPassword;
