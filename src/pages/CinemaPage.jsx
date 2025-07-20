// src/pages/CinemaPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CinemaPage.css';

const CinemaPage = () => {
  const [cinemas, setCinemas] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [ticketDetails, setTicketDetails] = useState(null);
  const navigate = useNavigate();

  // Charger les cinémas et séances
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Récupérer les cinémas
        const cinemasResponse = await fetch(process.env.REACT_APP_API_BASE_URL + '/api/cinemas');
        if (!cinemasResponse.ok) throw new Error('Erreur de chargement des cinémas');
        const cinemasData = await cinemasResponse.json();
        setCinemas(cinemasData);
        
        // Récupérer les séances avec films et cinémas peuplés
        const sessionsResponse = await fetch(process.env.REACT_APP_API_BASE_URL + '/api/sessions?populate=film,cinema');
        if (!sessionsResponse.ok) throw new Error('Erreur de chargement des séances');
        const sessionsData = await sessionsResponse.json();
        setSessions(sessionsData);
        
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrer les séances par cinéma sélectionné
  const filteredSessions = selectedCinema 
    ? sessions.filter(session => session.cinema?._id === selectedCinema._id) 
    : sessions;

  // Gérer la sélection d'un cinéma
  const handleSelectCinema = (cinema) => {
    setSelectedCinema(cinema);
    setSelectedSession(null);
    setSelectedSeat(null);
  };

  // Gérer la sélection d'une séance
  const handleSelectSession = (session) => {
    setSelectedSession(session);
    setSelectedSeat(null);
  };

  // Gérer la sélection d'un siège
  const handleSelectSeat = (seat) => {
    if (!selectedSession) return;
    
    // Vérifier si le siège est disponible
    if (seat.isReserved) {
      alert('Ce siège est déjà réservé');
      return;
    }
    
    setSelectedSeat(seat);
  };

  // Réserver un billet
  const handleReserveTicket = async () => {
    if (!selectedSession || !selectedSeat || !selectedCinema) {
      alert('Veuillez sélectionner une séance et un siège');
      return;
    }

    // Créer les détails du billet
    const ticketInfo = {
      cinema: selectedCinema.name,
      film: selectedSession.film.title,
      date: new Date(selectedSession.date).toLocaleDateString(),
      time: selectedSession.time,
      seat: selectedSeat.seatNumber,
      price: 12.99
    };
    
    setTicketDetails(ticketInfo);
    setShowPayment(true);
  };

  // Traiter le paiement réussi
  const handlePaymentSuccess = async (details) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      // Créer le ticket dans la base de données
      const response = await fetch(process.env.REACT_APP_API_BASE_URL + '/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          session: selectedSession._id,
          seatNumber: selectedSeat.seatNumber,
          paymentMethod: 'PayPal'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création du billet');
      }

      // Mettre à jour le statut du siège
      const updatedSessions = sessions.map(session => {
        if (session._id === selectedSession._id) {
          const updatedSeats = session.seats.map(seat => 
            seat.seatNumber === selectedSeat.seatNumber 
              ? { ...seat, isReserved: true } 
              : seat
          );
          return { ...session, seats: updatedSeats };
        }
        return session;
      });

      setSessions(updatedSessions);
      
      alert('Réservation confirmée ! Votre billet est disponible dans votre compte.');
      setShowPayment(false);
      setSelectedSeat(null);
    } catch (error) {
      console.error('Erreur de réservation:', error);
      alert('Erreur lors de la réservation: ' + error.message);
      setShowPayment(false);
    }
  };

  // Initialiser PayPal
  useEffect(() => {
    if (!showPayment || !ticketDetails) return;

    const initializePayPal = () => {
      if (window.paypal) {
        window.paypal.Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [{
                description: `Billet pour ${ticketDetails.film}`,
                amount: {
                  value: ticketDetails.price.toFixed(2)
                }
              }]
            });
          },
          onApprove: (data, actions) => {
            return actions.order.capture().then(details => {
              handlePaymentSuccess(details);
            });
          },
          onError: (err) => {
            console.error('Erreur PayPal:', err);
            alert('Erreur lors du paiement: ' + err.message);
          }
        }).render('#paypal-button-container');
      }
    };

    // Charger le SDK PayPal s'il n'est pas déjà chargé
    if (!document.getElementById('paypal-sdk')) {
      const script = document.createElement('script');
      script.id = 'paypal-sdk';
      script.src = 'https://www.paypal.com/sdk/js?client-id=ART50ZLUTRsApktCVHMF4i4KzbbnM7o5b80o6tpHwODyTaxZGHaxkFzoWf_P9DStGm4OmmEV9dYB0kJs&currency=USD';
      script.async = true;
      script.onload = initializePayPal;
      script.onerror = () => console.error('Erreur chargement PayPal SDK');
      document.body.appendChild(script);
    } else {
      initializePayPal();
    }

    return () => {
      // Nettoyer si nécessaire
    };
  }, [showPayment, ticketDetails]);

  if (isLoading) {
    return (
      <div className="cinema-loading">
        <div className="spinner"></div>
        <p>Chargement des cinémas et séances...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cinema-error">
        <p>Erreur: {error}</p>
        <button onClick={() => window.location.reload()}>Réessayer</button>
      </div>
    );
  }

  return (
    <div className="cinema-page">
      <h1>Nos Cinémas</h1>
      
      <div className="cinema-container">
        {/* Liste des cinémas */}
        <div className="cinema-list">
          {cinemas.map(cinema => (
            <div 
              key={cinema._id} 
              className={`cinema-card ${selectedCinema?._id === cinema._id ? 'selected' : ''}`}
              onClick={() => handleSelectCinema(cinema)}
            >
              <h3>{cinema.name}</h3>
              <p>{cinema.location}</p>
              <p>{cinema.numberOfSeats} sièges</p>
            </div>
          ))}
        </div>
        
        {/* Séances pour le cinéma sélectionné */}
        <div className="session-container">
          <h2>Séances {selectedCinema ? `à ${selectedCinema.name}` : ''}</h2>
          
          <div className="session-list">
            {filteredSessions.map(session => (
              <div 
                key={session._id} 
                className={`session-card ${selectedSession?._id === session._id ? 'selected' : ''}`}
                onClick={() => handleSelectSession(session)}
              >
                <div className="session-info">
                  <h4>{session.film?.title}</h4>
                  <p>{new Date(session.date).toLocaleDateString()} à {session.time}</p>
                  <p>Salle: {session.cinema?.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Sélection des sièges */}
      {selectedSession && (
        <div className="seating-section">
          <h3>Sélectionnez votre siège</h3>
          <p>Film: {selectedSession.film?.title} - Salle: {selectedSession.cinema?.name}</p>
          
          <div className="screen">ÉCRAN</div>
          
          <div className="seating-grid">
            {selectedSession.seats?.map(seat => (
              <div 
                key={seat.seatNumber}
                className={`seat ${seat.isReserved ? 'reserved' : ''} ${selectedSeat?.seatNumber === seat.seatNumber ? 'selected' : ''}`}
                onClick={() => handleSelectSeat(seat)}
              >
                {seat.seatNumber}
              </div>
            ))}
          </div>
          
          <div className="seat-legend">
            <div><span className="seat available"></span> Disponible</div>
            <div><span className="seat selected"></span> Sélectionné</div>
            <div><span className="seat reserved"></span> Réservé</div>
          </div>
          
          {selectedSeat && (
            <button 
              className="reserve-button"
              onClick={handleReserveTicket}
            >
              Réserver ce siège - 12.99€
            </button>
          )}
        </div>
      )}
      
      {/* Modal de paiement */}
      {showPayment && ticketDetails && (
        <div className="payment-modal">
          <div className="payment-content">
            <button className="close-button" onClick={() => setShowPayment(false)}>×</button>
            <h3>Confirmation de réservation</h3>
            
            <div className="ticket-summary">
              <p><strong>Film:</strong> {ticketDetails.film}</p>
              <p><strong>Cinéma:</strong> {ticketDetails.cinema}</p>
              <p><strong>Date:</strong> {ticketDetails.date} à {ticketDetails.time}</p>
              <p><strong>Siège:</strong> {ticketDetails.seat}</p>
              <p><strong>Prix:</strong> {ticketDetails.price}€</p>
            </div>
            
            <div id="paypal-button-container"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CinemaPage;