import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './Chat.css';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Bonjour! Je suis l\'assistant virtuel du Cinephere. Posez-moi vos questions sur les films à l\'affiche, les séances, les critiques, les billets et les services de la plateforme.',
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesContainerRef = useRef(null); // Changé de messagesEndRef à messagesContainerRef
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fonction modifiée pour utiliser le scrollTop
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await axios.post(process.env.REACT_APP_API_BASE_URL + '/api/chat', {
        message: input,
        sessionId: Date.now().toString()
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: 'Désolé, service temporairement indisponible. Contactez-nous',
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-container">
        <div className="chat-header">
          <div className="d-flex align-items-center">
            <button 
              onClick={() => navigate('/')}
              className="btn btn-sm btn-outline-secondary me-2"
              title="Retour à l'accueil"
            >
              <i className="bi bi-house-door"></i>
            </button>
            <img 
              src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png" 
              alt="Logo IA" 
              className="cei-chat-logo"
            />
          </div>
          <div>
            <h4 className="mb-1">Assistant Virtuel Cinephere</h4>
            <p className="mb-0 small">Posez vos questions en temps réel</p>
          </div>
        </div>

        {/* Ajout de la référence sur le conteneur des messages */}
        <div className="chat-messages" ref={messagesContainerRef}>
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`message ${msg.role}-message`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="message-bubble">
                <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, "<br>") }} />
                <div className="message-meta">
                  <span>{msg.role === 'user' ? 'Vous' : 'Assistant'}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="message assistant-message">
              <div className="typing-indicator">
                <div className="typing-dot" style={{ animationDelay: '0s' }}></div>
                <div className="typing-dot" style={{ animationDelay: '0.2s' }}></div>
                <div className="typing-dot" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
        </div>

        <form className="chat-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              ref={inputRef}
              type="text"
              name="message"
              className="form-control"
              placeholder="Écrivez votre message..."
              autoComplete="off"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
            />
            <button 
              type="submit" 
              className="btn send-btn"
              disabled={!input.trim() || isTyping}
            >
              Envoyer
            </button>
          </div>
        </form>
      </div>

      <div className="chat-footer">
        <button 
          onClick={() => navigate('/')}
          className="btn btn-back-home"
          title="Retour à l'accueil"
        >
          <i className="bi bi-house-door me-2"></i>
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
};

export default Chat;