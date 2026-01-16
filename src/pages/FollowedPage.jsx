import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../UserContext";
import "./FollowedPage.css";

function FollowedPage() {
  const params = useParams();
  const contextUser = useUser();

  const userId = contextUser.userId || params.userId;

  const [followed, setFollowed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState("name_asc");

  useEffect(() => {
    async function fetchFollowed() {
      if (!userId) return;

      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8080/user/${userId}/followed/list?order=${order}`
        );

        if (!response.ok) {
          throw new Error(`Falha ao buscar seguidos: ${response.status}`);
        }

        const data = await response.json();
        setFollowed(data.followed || data || []);
        setError(null);
      } catch (error) {
        console.error("Erro:", error);
        setError(
          "Não foi possível carregar os vendedores que você segue. Tente novamente mais tarde."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchFollowed();
  }, [userId, order]);

  function handleOrderChange(e) {
    setOrder(e.target.value);
  }

  return (
    <div className="followed-page">
      <h1>Quem eu sigo</h1>

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
        <div className="followed-list">
          {followed.length > 0 ? (
            <ul>
              {followed.map((seller) => (
                <li key={seller.id} className="followed-item">
                  <span className="followed-id">ID: {seller.userId}</span>
                  <br />
                  <span className="followed-name">Nome: {seller.userName}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-list">Você ainda não segue nenhum vendedor.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default FollowedPage;
