import { Link } from 'react-router-dom';
import UserSelector from './UserSelector';
import { useState, useEffect } from 'react';

function Navigation() {
  const [userId, setUserId] = useState(localStorage.getItem('activeUserId') || '');
  
  useEffect(() => {
    function checkUserId() {
      const storedId = localStorage.getItem('activeUserId') || '';
      if (storedId !== userId) {
        setUserId(storedId);
      }
    }
    
    const interval = setInterval(checkUserId, 500);
    
    return () => clearInterval(interval);
  }, [userId]);

  return (
    <nav className="navbar">
      <div className="logo">SocialMeli</div>
      
      <div className="nav-links">
        <Link to="/">Início</Link>
        
        {userId ? (
          <>
            <Link to={`/users/${userId}/followers`}>Quem me segue</Link>
            <Link to={`/users/${userId}/followed`}>Quem eu sigo</Link>
            <Link to={`/users/${userId}/feed`}>Meu Feed</Link>
            <Link to="/publish">Criar Publicação</Link>
            <Link to={`/users/${userId}/promo-pub`}>Promoções</Link>
          </>
        ) : (
          <>
            <span className="disabled-link">Quem me segue</span>
            <span className="disabled-link">Quem eu sigo</span>
            <span className="disabled-link">Meu Feed</span>
            <span className="disabled-link">Criar Publicação</span>
            <span className="disabled-link">Promoções</span>
          </>
        )}
      </div>
      
      <UserSelector onUserChange={(id) => setUserId(id)} />
    </nav>
  );
}

export default Navigation;