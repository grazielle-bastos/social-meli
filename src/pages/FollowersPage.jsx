import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../UserContext";
import "./FollowersPage.css";

function FollowersPage() {
  const params = useParams();
  const contextUser = useUser();

  const userId = contextUser.userId || params.userId;

  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState("name_asc");

  useEffect(() => {
    async function fetchFollowers() {
      if (!userId) return;

      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8080/user/${userId}/followers/list?order=${order}`
        );

        if (!response.ok) {
          throw new Error(`Falha ao buscar seguidores: ${response.status}`);
        }

        const data = await response.json();
        setFollowers(data.followers || []);
        setError(null);
      } catch (error) {
        console.error("Erro:", error);
        setError(
          "Não foi possível carregar seus seguidores. Tente novamente mais tarde."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchFollowers();
  }, [userId, order]);

  function handleOrderChange(e) {
    setOrder(e.target.value);
  }

  return (
    <div className="followers-page">
      <h1>Quem me segue</h1>

      <div className="order-controls">
        <label htmlFor="order-select">Ordenar por:</label>
        <select id="order-select" value={order} onChange={handleOrderChange}>
          <option value="name_asc">Nome (A-Z)</option>
          <option value="name_desc">Nome (Z-A)</option>
        </select>
      </div>

      {loading && <p className="loading">Carregando...</p>}

      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <div className="followers-list">
          {followers.length > 0 ? (
            <ul>
              {followers.map((follower) => (
                <li key={follower.followerId} className="follower-item">
                  <span className="follower-id">ID: {follower.userId}</span>
                  <br />
                  <span className="follower-name">
                    Nome: {follower.userName}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-list">Você ainda não tem seguidores.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default FollowersPage;
