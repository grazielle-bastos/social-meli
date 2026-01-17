import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import "../styles/PublishPage.css";

function PublishPage() {
  const navigate = useNavigate();
  const { userId } = useUser();

  const [formData, setFormData] = useState({
    product_name: "",
    type: "",
    brand: "",
    color: "",
    notes: "",
    price: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!userId) {
      setError("Você precisa selecionar um usuário para publicar.");
      return;
    }
    if (!formData.product_name?.trim()) {
      setError("Nome do produto é obrigatório.");
      return;
    }
    if (!formData.type?.trim()) {
      setError("Categoria é obrigatória.");
      return;
    }
    if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      setError("Preço deve ser um número válido maior que zero.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const finalData = {
        userId: parseInt(userId, 10),
        date: new Date().toISOString().split("T")[0],
        product: {
          productName: formData.product_name.trim(),
          type: formData.type.trim(),
          brand: formData.brand?.trim() || "",
          color: formData.color?.trim() || "",
          notes: formData.notes?.trim() || "",
        },
        category: 1,
        price: parseFloat(formData.price),
      };

      const endpoint = "http://localhost:8080/products/publish";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      if (!response.ok) {
        let errorMessage = `Erro ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {}
        throw new Error(`Falha ao criar publicação: ${errorMessage}`);
      }

      navigate(`/users/${userId}/feed`);
    } catch (error) {
      setError(
        `Não foi possível criar a publicação: ${
          error.message || "Verifique os dados e tente novamente."
        }`
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="publish-page">
      <h1>Criar Publicação</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="publish-form">
        <div className="form-group">
          <label htmlFor="product_name">Nome do Produto:</label>
          <input
            type="text"
            id="product_name"
            name="product_name"
            value={formData.product_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="type">Categoria:</label>
          <input
            type="text"
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="brand">Marca:</label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="color">Cor:</label>
          <input
            type="text"
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Preço (R$):</label>
          <input
            type="number"
            id="price"
            name="price"
            min="0.01"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="notes">Descrição:</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </button>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Publicando..." : "Publicar Produto"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PublishPage;
