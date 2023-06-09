// frontend\src\screens\product\HomeScreen.jsx

// External Imports
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// Internal Imports
import Product from '../../components/features/Product';
import Loader from '../../components/common/Loader';
import Message from '../../components/common/Message';
import Paginate from '../../components/utils/Paginate';
import ProductCarousel from '../../components/features/ProductCarousel';
import Meta from '../../components/helpers/Meta';
import { getProductsApi } from '../../services/api';

// Component Definition
const HomeScreen = () => {
  // State Variables
  const { pageNumber = 1, keyword = '' } = useParams();
  const [productsData, setProductsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Effect
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProductsApi({ keyword, pageNumber });
        setProductsData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [pageNumber, keyword]);

  // Conditional Rendering
  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Message variant='danger'>{error}</Message>;
  }

  // Component Render
  return (
    <>
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to='/' className='inline-block bg-white text-gray-700 py-2 px-4 rounded hover:bg-gray-200 mb-4'>
          Go Back
        </Link>
      )}
      <>
        <Meta />
        <h1 className='text-2xl font-semibold text-gray-700 mt-4'>Latest Products</h1>
        <div className='flex flex-wrap m-4'>
          {productsData && productsData.products.map((product) => (
            <div key={product.id} className='w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3 p-4'>
              <Product product={product} />
            </div>
          ))}
        </div>
        {productsData &&
          <Paginate
            pages={productsData.pages}
            page={productsData.page}
            keyword={keyword ? keyword : ''}
          />
        }
      </>
    </>
  );
};

export default HomeScreen;
