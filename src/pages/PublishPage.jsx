import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PublishPage.css";

function PublishPage() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("activeUserId");

  const [formData, setFormData] = useState({
    productName: "",
    type: "",
    brand: "",
    color: "",
    notes: "",
    price: "",
    hasPromo: false,
    discount: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!userId) {
      setError("Você precisa selecionar um usuário para publicar.");
      return;
    }

    if (!formData.productName?.trim()) {
      setError("Nome do produto é obrigatório.");
      return;
    }

    if (!formData.type?.trim()) {
      setError("Tipo do produto é obrigatório.");
      return;
    }

    if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      setError("Preço deve ser um número válido maior que zero.");
      return;
    }

    if (
      formData.hasPromo &&
      (isNaN(parseFloat(formData.discount)) ||
        parseFloat(formData.discount) <= 0)
    ) {
      setError("Desconto deve ser um número válido maior que zero.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const productData = {
        productName: formData.productName.trim(),
        type: formData.type.trim(),
        brand: formData.brand?.trim() || "",
        color: formData.color?.trim() || "",
        notes: formData.notes?.trim() || "",
      };

      const baseData = {
        date: new Date().toISOString().split("T")[0],
        product: productData,
        category: parseInt(formData.category || "1"),
        price: parseFloat(formData.price),
      };

      let finalData;
      const endpoint = formData.hasPromo
        ? "http://localhost:8080/products/promo-pub"
        : "http://localhost:8080/products/publish";

      if (formData.hasPromo) {
        finalData = {
          ...baseData,
          user_id: parseInt(userId),
          has_promo: true,
          discount: parseFloat(formData.discount),
        };
      } else {
        finalData = {
          ...baseData,
          userId: parseInt(userId),
        };
      }

      console.log("Enviando dados:", finalData); // Log para debug

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

      const responseData = await response.json();
      console.log("Publicação criada com sucesso:", responseData);
      navigate(`/users/${userId}/feed`);
    } catch (error) {
      console.error("Erro detalhado:", error);
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
          <label htmlFor="productName">Nome do Produto:</label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={formData.productName}
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
            required
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
            required
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

        <div className="promo-checkbox">
          <input
            type="checkbox"
            id="hasPromo"
            checked={formData.hasPromo}
            onChange={(e) =>
              setFormData({ ...formData, hasPromo: e.target.checked })
            }
          />
          <label htmlFor="hasPromo">
            Este produto está em promoção
            {formData.hasPromo && <span className="promo-badge">PROMO</span>}
          </label>
        </div>

        {formData.hasPromo && (
          <div className="form-group">
            <label htmlFor="discount">Desconto (%):</label>
            <input
              type="number"
              id="discount"
              name="discount"
              min="1"
              max="99"
              value={formData.discount}
              onChange={handleChange}
              required={formData.hasPromo}
            />
          </div>
        )}

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
