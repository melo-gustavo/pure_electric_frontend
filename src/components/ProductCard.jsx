import { assetUrl } from "../api/client";
import { formatCurrency } from "../utils/format";

export default function ProductCard({ product, onBuy, buying, disabled }) {
  const image = assetUrl(product.image);

  return (
    <article className="card">
      <div className="card__media">
        {image ? <img src={image} alt={product.name} loading="lazy" /> : null}
      </div>
      <div className="card__body">
        <h2 className="card__title">{product.name}</h2>
        <p className="card__description">{product.description}</p>
        <div className="card__footer">
          <strong className="card__price">
            {formatCurrency(product.amount)}
          </strong>
          <button
            type="button"
            className="button"
            onClick={() => onBuy(product)}
            disabled={buying || disabled}
          >
            {buying ? "Enviando…" : "Comprar"}
          </button>
        </div>
      </div>
    </article>
  );
}
