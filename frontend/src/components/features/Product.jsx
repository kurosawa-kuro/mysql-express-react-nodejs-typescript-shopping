// frontend\src\components\features\Product.jsx

import { Link } from 'react-router-dom';
import Rating from './Rating';

const Product = ({ product }) => {
  return (
    <div className='my-3 p-3 bg-white rounded shadow'>
      <Link to={`/product/${product.id}`}>
        <img className='w-full h-64 object-contain rounded-t' src={product.image} alt={product.name} />
      </Link>

      <div className='p-4'>
        <Link to={`/product/${product.id}`}>
          <h2 className='text-lg font-semibold text-gray-700'>{product.name}</h2>
        </Link>

        <div className='mt-2'>
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </div>

        <div className='mt-3 text-lg font-semibold text-gray-900'>${product.price}</div>
      </div>
    </div>
  );
};

export default Product;
