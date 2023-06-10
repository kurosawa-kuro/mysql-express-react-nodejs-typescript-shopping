// frontend\src\screens\admin\product\ProductListScreen.jsx

import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { useParams, Link } from 'react-router-dom';
import Message from '../../../components/common/Message';
import Loader from '../../../components/common/Loader';
import Paginate from '../../../components/utils/Paginate';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { getProductsApi, deleteProductApi, createProductApi } from '../../../services/api';

const ProductListScreen = () => {
  const { pageNumber } = useParams();
  const [productsData, setProductsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProductsApi({ pageNumber });
        setProductsData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [pageNumber]);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure')) {
      try {
        await deleteProductApi(id);
        const newProductsData = await getProductsApi({ pageNumber });
        setProductsData(newProductsData);
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const createProductHandler = async () => {
    if (window.confirm('Are you sure you want to create a new product?')) {
      try {
        await createProductApi();
        const newProductsData = await getProductsApi({ pageNumber });
        setProductsData(newProductsData);
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <button onClick={createProductHandler} className='bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-500 transition duration-150'>
          <FaPlus className='inline' /> Create Product
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message>{error}</Message>
      ) : (
        <>
          <div className='overflow-x-auto'>
            <table className='w-full whitespace-nowrap'>
              <thead>
                <tr className='text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50'>
                  <th className='px-4 py-3'>ID</th>
                  <th className='px-4 py-3'>NAME</th>
                  <th className='px-4 py-3'>PRICE</th>
                  <th className='px-4 py-3'>CATEGORY</th>
                  <th className='px-4 py-3'>BRAND</th>
                  <th className='px-4 py-3'></th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y'>
                {productsData && productsData.products.map((product) => (
                  <tr key={product.id} className='text-gray-700'>
                    <td className='px-4 py-3'>
                      <Link to={`/admin/product/${product.id}/edit`} className='text-indigo-600 hover:text-indigo-900'>
                        {product.id}
                      </Link>
                    </td>
                    <td className='px-4 py-3'>
                      {product.name}
                    </td>
                    <td className='px-4 py-3'>
                      ${product.price}
                    </td>
                    <td className='px-4 py-3'>
                      {product.category}
                    </td>
                    <td className='px-4 py-3'>
                      {product.brand}
                    </td>
                    <td className='px-4 py-3'>
                      <div className="flex items-center space-x-4 text-sm">
                        <Link to={`/admin/product/${product.id}/edit`} className='bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600'>
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => deleteHandler(product.id)}
                          className='bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600'
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {productsData &&
            <Paginate pages={productsData.pages} page={productsData.page} isAdmin={true} />
          }
        </>
      )}
    </>
  );
};

export default ProductListScreen;
