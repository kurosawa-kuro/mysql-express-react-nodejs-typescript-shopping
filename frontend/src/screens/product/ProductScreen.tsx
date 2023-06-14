// frontend\src\screens\product\ProductScreen.tsx

import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
// import Rating from '../../components/features/Rating';
import Loader from "../../components/common/Loader";
import Message from "../../components/common/Message";
// import Meta from '../../components/helpers/Meta';
import { useCartStore } from "../../state/store";
import { getProductDetailsApi } from "../../services/api";
import { Product } from "../../interfaces";

export const ProductScreen: React.FC = () => {
  const { id: productId } = useParams();
  const { addToCart } = useCartStore();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [qty, setQty] = useState<number>(1);

  const fetchProductDetails = useCallback(async () => {
    try {
      setLoading(true);
      let product;
      if (productId) {
        product = await getProductDetailsApi(Number(productId));
      }
      setProduct(product);
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
  }, [productId]);

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

  const addToCartHandler = () => {
    if (product && product.id !== undefined) {
      addToCart({
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        qty,
      });
      navigate("/cart");
    }
  };

  // const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   try {
  //     await createReviewApi({
  //       productId,
  //       rating,
  //       comment,
  //     });
  //     fetchProductDetails();
  //     toast.success("Review created successfully");
  //   } catch (err) {
  //     toast.error(err?.data?.message || err.message);
  //   }
  // };

  if (!product) {
    return null;
  }

  return (
    <div className="container mx-auto px-4">
      <Link className="my-3 text-blue-500" to="/">
        Go Back
      </Link>

      <>
        {/* <Meta title={product.name} description={product.description} /> */}
        <div className="-mx-2 flex flex-wrap">
          {loading && <Loader />}
          {error && <Message variant="danger">{error}</Message>}
          <div className="w-full px-2 md:w-1/2">
            <img src={product.image} alt={product.name} className="w-full" />
          </div>
          <div className="w-full px-2 md:w-1/4">
            <div className="rounded-lg bg-white p-4 shadow-md">
              <h3 className="mb-2 text-2xl font-bold">{product.name}</h3>
              {/* <Rating
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                /> */}
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
    </div>
  );
};
