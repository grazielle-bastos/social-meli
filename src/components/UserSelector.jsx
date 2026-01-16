import React, { useEffect, useState } from "react";
import { useUser } from "../UserContext";

function UserSelector() {
  const { userId, setUserId } = useUser();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("http://localhost:8080/user");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.log("Erro ao buscar usuários:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  function handleChange(event) {
    setUserId(event.target.value);
  }

  return (
    <div className="user-selector">
      <label htmlFor="user-select">ID do usuário ativo:</label>
      <select
        id="user-select"
        value={userId}
        onChange={handleChange}
        disabled={loading}
      >
        <option value="">Selecione um usuário</option>
        {users.length > 0 ? (
          users.map((user) => (
            <option key={user.userId} value={user.userId}>
              {user.userId}
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
