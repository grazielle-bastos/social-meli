import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import "../styles/FeedPage.css";
import { useUser } from "../UserContext";

function FeedPage() {
  const params = useParams();
  const contextUser = useUser();

  const userId = contextUser.userId || params.userId;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState("date_desc");

  useEffect(() => {
    async function fetchPosts() {
      if (!userId) return;

      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8080/products/followed/${userId}/list?order=${order}`
        );

        if (!response.ok) {
          throw new Error("Falha ao buscar publicações");
        }

        const data = await response.json();
        setPosts(data.posts || []);
        setError(null);
      } catch (error) {
        console.error("Erro:", error);
        setError(
          "Não foi possível carregar o feed. Tente novamente mais tarde."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [userId, order]);

  function handleOrderChange(e) {
    setOrder(e.target.value);
  }

  return (
    <div className="feed-page">
      <h1>Feed de Publicações</h1>

      <div className="order-controls">
        <label htmlFor="order-select">Ordenar por: </label>
        <select id="order-select" value={order} onChange={handleOrderChange}>
          <option value="date_desc">Mais recentes primeiro</option>
          <option value="date_asc">Mais antigas primeiro</option>
        </select>
      </div>

      {loading && <p className="loading">Carregando...</p>}

      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <div className="posts-list">
          {posts.length > 0 ? (
            posts.map((post) => <PostCard key={post.post_id} post={post} />)
          ) : (
            <p className="empty-list">
              Não há publicações no seu feed. Comece a seguir vendedores para
              ver suas publicações.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default FeedPage;
