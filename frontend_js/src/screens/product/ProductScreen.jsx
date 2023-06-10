// frontend\src\screens\product\ProductScreen.jsx

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Rating from '../../components/features/Rating';
import Loader from '../../components/common/Loader';
import Message from '../../components/common/Message';
import Meta from '../../components/helpers/Meta';
import { useCartStore } from '../../state/store';
import { getProductDetailsApi, createReviewApi } from '../../services/api';

const ProductScreen = () => {
  const { id: productId } = useParams();
  const { addToCart } = useCartStore();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const fetchProductDetails = useCallback(async () => {
    try {
      setLoading(true);
      const product = await getProductDetailsApi(productId);
      setProduct(product);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

  const addToCartHandler = () => {
    addToCart({ ...product, qty });
    navigate('/cart');
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReviewApi({
        productId,
        rating,
        comment,
      });
      fetchProductDetails();
      toast.success('Review created successfully');
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <Link className='text-blue-500 my-3' to='/'>
        Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : product ? (
        <>
          <Meta title={product.name} description={product.description} />
          <div className="flex flex-wrap -mx-2">
            <div className="w-full md:w-1/2 px-2">
              <img src={product.image} alt={product.name} className="w-full" />
            </div>
            <div className="w-full md:w-1/4 px-2">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                <Rating
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                />
                <p className="font-bold mt-2">Price: ${product.price}</p>
                <p>Description: {product.description}</p>
              </div>
            </div>
            <div className="w-full md:w-1/4 px-2">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex justify-between">
                  <div>Price:</div>
                  <div>
                    <strong>${product.price}</strong>
                  </div>
                </div>
                <div className="flex justify-between my-2">
                  <div>Status:</div>
                  <div>
                    {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                  </div>
                </div>
                {product.countInStock > 0 && (
                  <div className="flex justify-between my-2">
                    <div>Qty</div>
                    <div>
                      <select
                        className="form-select block w-full"
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                      >
                        {[...Array(product.countInStock).keys()].map(
                          (x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>
                )}
                <button
                  className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${product.countInStock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  type='button'
                  disabled={product.countInStock === 0}
                  onClick={addToCartHandler}
                >
                  Add To Cart
                </button>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ProductScreen;
