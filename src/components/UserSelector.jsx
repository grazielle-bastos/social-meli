import React, { useState, useEffect } from 'react';

function UserSelector({ onUserChange }) {
  const [userId, setUserId] = useState(localStorage.getItem('activeUserId') || '');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('http://localhost:8080/user');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.log('Erro ao buscar usuários:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  function handleChange(event) {
    const newUserId = event.target.value;
    setUserId(newUserId);

    localStorage.setItem('activeUserId', newUserId);

    if (onUserChange) {
      onUserChange(newUserId);
    }
  }

  return (
    <div className="user-selector">
      <label htmlFor="user-select">Usuário ativo:</label>
      <select 
        id="user-select" 
        value={userId} 
        onChange={handleChange}
        disabled={loading}
      >
      <option value="">Selecione um usuário</option>
      {users.length > 0 ? (
        users.map(user => (
          <option key={user.id} value={user.id}>
            {user.name} (ID: {user.id})
          </option>
        ))
      ) : (
        <option disabled>Nenhum usuário disponível</option>
      )}
    </select>
    </div>
  );
}

export default UserSelector;