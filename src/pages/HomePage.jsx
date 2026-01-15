import React from 'react';
import { useState, useEffect } from 'react';

function HomePage() {
  const [user, setUser] = useState(null);
  const userId = localStorage.getItem('activeUserId');

  useEffect(() => {
    if (userId) {
      async function fetchUser() {
        try {
          const response = await fetch(`http://localhost:8080/user/${userId}`);
          const data = await response.json();
          setUser(data);
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
        }
      }
      
      fetchUser();
    } else {
      setUser(null);
    }
  }, [userId]);

  return (
    <div className="home-page">
      <h1>Bem-vindo ao SocialMeli</h1>
      
      {user ? (
        <div className="user-info">
          <h2>Olá, {user.name}!</h2>
          <p>Você está navegando como usuário ID: {user.id}</p>
          <p>Use o menu acima para explorar o sistema.</p>
        </div>
      ) : (
        <div className="no-user">
          <h2>Selecione um usuário para começar</h2>
          <p>Use o seletor no canto superior direito para escolher um usuário.</p>
        </div>
      )}
    </div>
  );
}

export default HomePage;