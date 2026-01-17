import React from "react";
import "./PostCard.css";

function PostCard({ post }) {
  const hasPromo = post.hasPromo || post.has_promo;
  const discount = post.discount;

  const originalPrice = post.price;
  const discountedPrice = hasPromo
    ? originalPrice - originalPrice * (discount / 100)
    : null;

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
        <span className="post-category">{post.category}</span>
      </div>

      <div className="post-seller">
        <span>Vendedor ID: {post.user_id}</span>
      </div>

      <div className="post-content">
        <p>
          <strong>Marca:</strong> {post.product.brand}
        </p>
        <p>
          <strong>Tipo:</strong> {post.product.type}
        </p>
        {post.product.color && (
          <p>
            <strong>Cor:</strong> {post.product.color}
          </p>
        )}
      </div>

      <div className="post-price-container">
        {hasPromo ? (
          <>
            <div className="promo-badge">{discount}% OFF</div>
            <div className="price-display">
              <span className="original-price">
                R$ {originalPrice.toFixed(2)}
              </span>
              <span className="discounted-price">
                R$ {discountedPrice.toFixed(2)}
              </span>
            </div>
          </>
        ) : (
          <div className="price-display">
            <span className="regular-price">R$ {originalPrice.toFixed(2)}</span>
          </div>
        )}
      </div>

      {post.product.notes && (
        <div className="post-notes">
          <p>
            <strong>Descrição: </strong>
            {post.product.notes}
          </p>
        </div>
      )}
    </div>
  );
}
export default PostCard;
