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

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 5;

  async function fetchPosts(pageNumber = 0) {
    if (!userId) return;

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8080/products/followed/${userId}/list?order=${order}&page=${pageNumber}&size=${pageSize}`,
      );

      if (!response.ok) {
        throw new Error("Falha ao buscar publicações");
      }

      const data = await response.json();
      console.log("Dados recebidos:", data);

      const postsArray = data.posts?.content || [];
      setTotalPages(data.posts?.totalPages || 0);
      setPosts(postsArray);
      setCurrentPage(pageNumber);
      setError(null);
    } catch (error) {
      console.error("Erro:", error);
      setError("Não foi possível carregar o feed. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  }

  function goToPreviousPage() {
    if (currentPage > 0) {
      fetchPosts(currentPage - 1);
    }
  }

  function goToNextPage() {
    if (currentPage < totalPages - 1) {
      fetchPosts(currentPage + 1);
    }
  }

  function handleOrderChange(e) {
    setOrder(e.target.value);
    fetchPosts(0);
  }

  useEffect(() => {
    console.log("Efeito executado - userId:", userId, "order:", order);
    fetchPosts(0);
  }, [userId, order]);

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
        <div className="posts-container">
          <div className="posts-list">
            {posts.length > 0 ? (
              posts.map((post, index) => (
                <PostCard key={post.post_id || index} post={post} />
              ))
            ) : (
              <p className="empty-list">
                Não há publicações no seu feed. Comece a seguir vendedores para
                ver suas publicações.
              </p>
            )}
          </div>

          {posts.length > 0 && totalPages > 1 && (
            <div className="pagination-controls">
              <button
                className="pagination-button"
                onClick={goToPreviousPage}
                disabled={currentPage === 0}
              >
                Anterior
              </button>

              <span className="page-info">
                Página {currentPage + 1} de {totalPages}
              </span>

              <button
                className="pagination-button"
                onClick={goToNextPage}
                disabled={currentPage === totalPages - 1}
              >
                Próximo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FeedPage;
