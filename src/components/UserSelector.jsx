import React, { useEffect, useState } from "react";
import { useUser } from "../UserContext";

function UserSelector() {
  const { userId, setUserId } = useUser();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        console.log("Iniciando busca de usuários...");
        const response = await fetch("http://localhost:8080/user?size=1000");
        console.log("Resposta recebida:", response);

        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log("Dados recebidos:", data);

        const usersArray = data.content || [];
        console.log("Usuários buscados:", usersArray);
        setUsers(usersArray);
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
      <label htmlFor="user-select">Usuário ativo:</label>
      <select
        id="user-select"
        value={userId}
        onChange={handleChange}
        disabled={loading}
      >
        <option value="">Selecione um usuário</option>
        {console.log("Renderizando opções com users:", users)}
        {users.length > 0 ? (
          users.map((user) => (
            <option key={user.userName} value={user.userName}>
              {user.userName}
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
