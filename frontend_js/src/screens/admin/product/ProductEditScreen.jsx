// frontend\src\screens\admin\product\ProductEditScreen.jsx

import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  getProductDetailsApi,
  updateProductApi,
  uploadProductImageApi,
} from '../../../services/api';

const ProductEditScreen = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductDetailsApi(productId);
        setName(data.name);
        setPrice(data.price);
        setImage(data.image);
        setBrand(data.brand);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setDescription(data.description);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateProductApi({
        productId,
        name,
        price,
        image,
        brand,
        category,
        description,
        countInStock,
      });
      toast.success('Product updated');
      navigate('/admin/product-list');
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadProductImageApi(formData);
      toast.success(res.message);
      setImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  return (
    <>
      <Link to='/admin/product-list' className='btn btn-light my-3'>
        Go Back
      </Link>
      <div className='w-full max-w-md mx-auto mt-4'>
        <h1 className='text-2xl font-semibold mb-4 text-center'>Edit Product</h1>
        {loading && <p>Loading...</p>}
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className='text-red-500'>{error}</p>
        ) : (
          <form className='mt-8 space-y-6' onSubmit={submitHandler}>
            <input type='hidden' name='remember' value='true' />
            <div className='rounded-md shadow-sm -space-y-px'>
              <div>
                <label htmlFor='name' className='sr-only'>Name</label>
                <input id='name' name='name' type='name' required className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm' placeholder='Enter name' value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <label htmlFor='price' className='sr-only'>Price</label>
                <input id='price' name='price' type='number' required className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm' placeholder='Enter price' value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>
              <div>
                <label htmlFor='image' className='sr-only'>Image</label>
                <input id='image' name='image' type='text' required className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm' placeholder='Enter image url' value={image} onChange={(e) => setImage(e.target.value)} />
                <input id='image-file' name='image-file' type='file' className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm' onChange={uploadFileHandler} />
              </div>
              <div>
                <label htmlFor='brand' className='sr-only'>Brand</label>
                <input id='brand' name='brand' type='text' required className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm' placeholder='Enter brand' value={brand} onChange={(e) => setBrand(e.target.value)} />
              </div>
              <div>
                <label htmlFor='countInStock' className='sr-only'>Count In Stock</label>
                <input id='countInStock' name='countInStock' type='number' required className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm' placeholder='Enter countInStock' value={countInStock} onChange={(e) => setCountInStock(e.target.value)} />
              </div>
              <div>
                <label htmlFor='category' className='sr-only'>Category</label>
                <input id='category' name='category' type='text' required className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm' placeholder='Enter category' value={category} onChange={(e) => setCategory(e.target.value)} />
              </div>
              <div>
                <label htmlFor='description' className='sr-only'>Description</label>
                <input id='description' name='description' type='text' required className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm' placeholder='Enter description' value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
            </div>

            <div>
              <button type='submit' className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                Update
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default ProductEditScreen;
