import React from "react";
import "./PostCard.css";

function PostCard({ post }) {
  if (!post || !post.product)
    return <div className="post-card">Post inválido</div>;

  function formatDate(dateString) {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("pt-BR", options);
  }

  const price = post.price ?? 0;

  return (
    <div className="post-card">
      <div className="post-header">
        <h3>{post.product.product_name}</h3>
        <span className="post-date">{formatDate(post.date)}</span>
      </div>
      <div className="post-seller">
        <span>Vendedor ID: {post.user_id}</span>
      </div>
      <div className="post-details">
        <p>
          <strong>Categoria:</strong> {post.product.type}
        </p>
        <p>
          <strong>Marca:</strong> {post.product.brand}
        </p>
        <p>
          <strong>Cor:</strong> {post.product.color}
        </p>
        <div className="regular-price">R$ {price.toFixed(2)}</div>
      </div>
      {post.product.notes && (
        <div className="post-description">
          <p>
            <strong>Descrição:</strong> {post.product.notes}
          </p>
        </div>
      )}
    </div>
  );
}
export default PostCard;
