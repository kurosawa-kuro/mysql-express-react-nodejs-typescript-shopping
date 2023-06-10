// frontend\src\components\features\ProductCarousel.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import Message from '../common/Message';
import { getTopProductsApi } from '../../services/api';

const ProductCarousel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopProducts = async () => {
      setLoading(true);
      try {
        const data = await getTopProductsApi();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  return loading ? null : error ? (
    <Message variant='danger'>{error?.data?.message || error.message}</Message>
  ) : (
    <Carousel className="h-[250px]" showThumbs={false} showStatus={false} infiniteLoop useKeyboardArrows autoPlay>
      {products.map((product) => (
        <div key={product.id} className="relative">
          <Link to={`/product/${product.id}`} className="block w-full h-[250px]">
            <img src={product.image} alt={product.name} className="object-contain w-full h-full" />
            <p className='absolute bottom-0 text-white text-right bg-black bg-opacity-50 p-2'>
              {product.name} (${product.price})
            </p>
          </Link>
        </div>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;
