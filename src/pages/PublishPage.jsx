import { useState, useEffect } from "react";
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
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);
  const [touched, setTouched] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "type") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    validateField(name, formData[name]);
  }

  function validateField(fieldName, value) {
    let newErrors = { ...errors };

    switch (fieldName) {
      case "product_name":
        if (!value?.trim()) {
          newErrors.product_name = "Nome do produto é obrigatório";
        } else if (value.trim().length < 3) {
          newErrors.product_name =
            "Nome do produto deve ter pelo menos 3 caracteres";
        } else if (value.trim().length > 100) {
          newErrors.product_name =
            "Nome do produto não pode exceder 100 caracteres";
        } else {
          newErrors.product_name = null;
        }
        break;

      case "type":
        if (!value) {
          newErrors.type = "Categoria é obrigatória";
        } else if (!/^\d+$/.test(value)) {
          newErrors.type = "Categoria deve ser um número";
        } else if (parseInt(value) <= 0) {
          newErrors.type = "Categoria deve ser um número positivo";
        } else if (parseInt(value) > 10000) {
          newErrors.type = "Categoria inválida";
        } else {
          newErrors.type = null;
        }
        break;

      case "price":
        if (!value) {
          newErrors.price = "Preço é obrigatório";
        } else if (isNaN(parseFloat(value))) {
          newErrors.price = "Preço deve ser um número válido";
        } else if (parseFloat(value) <= 0) {
          newErrors.price = "Preço deve ser maior que zero";
        } else if (parseFloat(value) > 1000000) {
          newErrors.price = "Preço não pode exceder 1.000.000";
        } else {
          newErrors.price = null;
        }
        break;

      case "brand":
        if (value?.trim().length > 50) {
          newErrors.brand = "Marca não pode exceder 50 caracteres";
        } else {
          newErrors.brand = null;
        }
        break;

      case "color":
        if (value?.trim().length > 30) {
          newErrors.color = "Cor não pode exceder 30 caracteres";
        } else {
          newErrors.color = null;
        }
        break;

      case "notes":
        if (value?.trim().length > 500) {
          newErrors.notes = "Observações não podem exceder 500 caracteres";
        } else {
          newErrors.notes = null;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return !newErrors[fieldName];
  }

  function validateForm() {
    let isValid = true;
    let newErrors = {};
    let newTouched = {};

    Object.keys(formData).forEach((field) => {
      newTouched[field] = true;
      const fieldIsValid = validateField(field, formData[field]);
      if (!fieldIsValid) isValid = false;
      newErrors[field] = errors[field];
    });

    if (!userId) {
      setGeneralError("Você precisa selecionar um usuário para publicar.");
      isValid = false;
    } else {
      setGeneralError(null);
    }

    setTouched(newTouched);
    setErrors(newErrors);
    return isValid;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setGeneralError(null);

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
        category: parseInt(formData.type, 10),
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
      setGeneralError(
        `Não foi possível criar a publicação: ${
          error.message || "Verifique os dados e tente novamente."
        }`,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="publish-page">
      <h1>Criar Publicação</h1>
      {generalError && <p className="error-message">{generalError}</p>}
      <form onSubmit={handleSubmit} className="publish-form">
        <div className="form-group">
          <label htmlFor="product_name">Nome do Produto:</label>
          <input
            type="text"
            id="product_name"
            name="product_name"
            value={formData.product_name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={
              touched.product_name && errors.product_name ? "input-error" : ""
            }
            placeholder="Digite o nome do produto"
          />
          {touched.product_name && errors.product_name && (
            <p className="error-text">{errors.product_name}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="type">Categoria:</label>
          <input
            type="text"
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            onBlur={handleBlur}
            className={touched.type && errors.type ? "input-error" : ""}
            placeholder="Digite a categoria do produto"
          />
          {touched.type && errors.type && (
            <p className="error-text">{errors.type}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="brand">Marca:</label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            onBlur={handleBlur}
            className={touched.brand && errors.brand ? "input-error" : ""}
            placeholder="Digite a marca (opcional)"
          />
          {touched.brand && errors.brand && (
            <p className="error-text">{errors.brand}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="color">Cor:</label>
          <input
            type="text"
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            onBlur={handleBlur}
            className={touched.color && errors.color ? "input-error" : ""}
            placeholder="Digite a cor (opcional)"
          />
          {touched.color && errors.color && (
            <p className="error-text">{errors.color}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="price">Preço:</label>
          <div className="price-input-container">
            <span className="currency-symbol">R$</span>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              onBlur={handleBlur}
              step="0.01"
              min="0.01"
              className={
                touched.price && errors.price
                  ? "input-error price-input"
                  : "price-input"
              }
              placeholder="0,00"
            />
          </div>
          {touched.price && errors.price && (
            <p className="error-text">{errors.price}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="notes">Descrição:</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            onBlur={handleBlur}
            className={touched.notes && errors.notes ? "input-error" : ""}
            placeholder="Observações adicionais sobre o produto (opcional)"
            rows="4"
          ></textarea>
          {touched.notes && errors.notes && (
            <p className="error-text">{errors.notes}</p>
          )}
          {formData.notes && (
            <p className="char-count">{formData.notes.length}/500 caracteres</p>
          )}
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
