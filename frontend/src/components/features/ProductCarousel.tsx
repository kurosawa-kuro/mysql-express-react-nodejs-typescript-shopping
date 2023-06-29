// frontend\src\components\features\ProductCarousel.tsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Message } from "../common/Message";
import { getTopProducts } from "../../services/api";
import { toast } from "react-toastify";
import { Product } from "@prisma/client";

export const ProductCarousel: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopProducts = async () => {
      setLoading(true);
      try {
        const data: Product[] = await getTopProducts();
        if (data) {
          setProducts(data);
        }
        setLoading(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast.error(err.message);
          setError(err.message);
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
