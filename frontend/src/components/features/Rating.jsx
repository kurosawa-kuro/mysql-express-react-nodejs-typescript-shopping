// frontend\src\components\features\Rating.jsx

import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const Rating = ({ value, text, color }) => {
  return (
    <div className='flex items-center space-x-1 text-yellow-500'>
      <span>
        {value >= 1 ? (
          <FaStar className='w-4 h-4' />
        ) : value >= 0.5 ? (
          <FaStarHalfAlt className='w-4 h-4' />
        ) : (
          <FaRegStar className='w-4 h-4' />
        )}
      </span>
      <span>
        {value >= 2 ? (
          <FaStar className='w-4 h-4' />
        ) : value >= 1.5 ? (
          <FaStarHalfAlt className='w-4 h-4' />
        ) : (
          <FaRegStar className='w-4 h-4' />
        )}
      </span>
      <span>
        {value >= 3 ? (
          <FaStar className='w-4 h-4' />
        ) : value >= 2.5 ? (
          <FaStarHalfAlt className='w-4 h-4' />
        ) : (
          <FaRegStar className='w-4 h-4' />
        )}
      </span>
      <span>
        {value >= 4 ? (
          <FaStar className='w-4 h-4' />
        ) : value >= 3.5 ? (
          <FaStarHalfAlt className='w-4 h-4' />
        ) : (
          <FaRegStar className='w-4 h-4' />
        )}
      </span>
      <span>
        {value >= 5 ? (
          <FaStar className='w-4 h-4' />
        ) : value >= 4.5 ? (
          <FaStarHalfAlt className='w-4 h-4' />
        ) : (
          <FaRegStar className='w-4 h-4' />
        )}
      </span>
      <span className='ml-2 text-gray-700'>{text && text}</span>
    </div>
  );
};

Rating.defaultProps = {
  color: '#f8e825',
};

export default Rating;
