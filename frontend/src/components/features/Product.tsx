// frontend\src\components\features\Product.tsx

import { Link } from "react-router-dom";
import { Rating } from "./Rating";
import { Product as ProductType } from "@prisma/client";

interface ProductProps {
  product: ProductType;
}

export const Product: React.FC<ProductProps> = ({ product }) => {
  return (
    <div className="my-3 rounded bg-white p-3 shadow">
      <Link to={`/products/${product.id}`}>
        <img
          className="h-64 w-full rounded-t object-contain"
          src={product.image}
          alt={product.name}
        />
      </Link>

      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h2 className="text-lg font-semibold text-gray-700">
            {product.name}
          </h2>
        </Link>

        <div className="mt-2">
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </div>

        <div className="mt-3 text-lg font-semibold text-gray-900">
          ${product.price}
        </div>
      </div>
    </div>
  );
};
