// frontend\src\screens\product\ProductScreen.tsx

// External Imports
import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

// Internal Imports
import { Loader } from "../../components/common/Loader";
import { Message } from "../../components/common/Message";
import { useCartStore } from "../../state/store";
import { readProductById } from "../../services/api";
import { Product } from "@prisma/client";
import { Rating } from "../../components/features/Rating";
// import Meta from "../../components/helpers/Meta";

export const ProductScreen: React.FC = () => {
  const { id: productId = 0 } = useParams();
  const { createCartItem } = useCartStore();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [qty, setQty] = useState<number>(1);

  const fetchProductFulls = useCallback(async () => {
    setLoading(true);
    try {
      const product = productId
        ? await readProductById(Number(productId))
        : null;
      setProduct(product);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred.";
      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProductFulls();
  }, [fetchProductFulls]);

  const addToCartHandler = () => {
    if (product && product.id !== undefined) {
      createCartItem({
        product: { ...product },
        qty,
      });
      navigate("/cart");
    }
  };

  if (!product) {
    return null;
  }

  return (
    <>
      <Link className="my-3 text-blue-500" to="/">
        Go Back
      </Link>

      <>
        {/* <Meta title={product.name} description={product.description} /> */}
        <h1 className="mb-2 mt-2 text-center  text-3xl font-bold text-custom-blue-dark">
          Product
        </h1>
        <div className="-mx-2 flex flex-wrap">
          {loading && <Loader />}
          {error && <Message variant="danger">{error}</Message>}
          <div className="w-full px-2 md:w-1/2">
            <img src={product.image} alt={product.name} className="w-full" />
          </div>
          <div className="w-full px-2 md:w-1/4">
            <div className="rounded-lg bg-white p-4 shadow-md">
              <h3 className="mb-2 text-2xl font-bold">{product.name}</h3>
              <Rating
                value={product.rating}
                text={`${product.numReviews} reviews`}
              />
              <p className="mt-2 font-bold">Price: ${product.price}</p>
              <p>Description: {product.description}</p>
            </div>
          </div>
          <div className="w-full px-2 md:w-1/4">
            <div className="rounded-lg bg-white p-4 shadow-md">
              <div className="flex justify-between">
                <div>Price:</div>
                <div>
                  <strong>${product.price}</strong>
                </div>
              </div>
              <div className="my-2 flex justify-between">
                <div>Status:</div>
                <div>
                  {product.countInStock > 0 ? "In Stock" : "Out Of Stock"}
                </div>
              </div>
              {product.countInStock > 0 && (
                <div className="my-2 flex justify-between">
                  <div>Qty</div>
                  <div>
                    <select
                      className="form-select block w-full"
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
              <button
                className={`focus:shadow-outline w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none ${
                  product.countInStock === 0
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }`}
                type="button"
                disabled={product.countInStock === 0}
                onClick={addToCartHandler}
              >
                Add To Cart
              </button>
            </div>
          </div>
        </div>
      </>
    </>
  );
};
