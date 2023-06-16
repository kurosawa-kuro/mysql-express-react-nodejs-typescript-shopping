// frontend\src\components\features\ProductCarousel.tsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Message } from "../common/Message";
import { getTopProductsApi } from "../../services/api";
import { toast } from "react-toastify";
import { ProductFull } from "../../../../backend/interfaces";

export const ProductCarousel: React.FC = () => {
  const [products, setProducts] = useState<ProductFull[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopProducts = async () => {
      setLoading(true);
      try {
        const data: ProductFull[] = await getTopProductsApi();
        if (data) {
          setProducts(data);
        }
        setLoading(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast.error(err.message);
          setError(err.message);
        } else {
          toast.error("An error occurred.");
          setError("An error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  return loading ? null : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <Carousel
      className="h-[250px]"
      showThumbs={false}
      showStatus={false}
      infiniteLoop
      useKeyboardArrows
      autoPlay
    >
      {products.map((product) => (
        <div key={product.id} className="relative">
          <Link
            to={`/products/${product.id}`}
            className="block h-[250px] w-full"
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-contain"
            />
            <p className="absolute bottom-0 bg-black bg-opacity-50 p-2 text-right text-white">
              {product.name} (${product.price})
            </p>
          </Link>
        </div>
      ))}
    </Carousel>
  );
};
