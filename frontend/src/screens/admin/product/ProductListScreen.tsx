// frontend\src\screens\admin\product\ProductListScreen.tsx

import React, { useState, useEffect } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Message } from "../../../components/common/Message";
import { Loader } from "../../../components/common/Loader";
import { Paginate } from "../../../components/utils/Paginate";
import { getProducts, deleteProduct } from "../../../services/api";
import { ProductList } from "../../../../../backend/interfaces";
import { Product } from "@prisma/client";
import { toast } from "react-toastify";

export const ProductListScreen: React.FC = () => {
  const { pageNumber } = useParams();

  const [productsData, setProductsData] = useState<ProductList | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts({
          pageNumber: Number(pageNumber),
          keyword: "",
        });
        setProductsData(data);
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [pageNumber]);

  const deleteHandler = async (id: number) => {
    if (window.confirm("Are you sure")) {
      try {
        await deleteProduct(id);
        const newProductsData = await getProducts({
          pageNumber: Number(pageNumber),
          keyword: "",
        });
        setProductsData(newProductsData);
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast.error(err.message);
        }
      }
    }
  };

  const createProductHandler = async () => {
    navigate("/admin/products/new");
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-custom-blue-dark">Products</h1>
        {loading && <Loader />}
        {error && <Message variant="danger">{error}</Message>}
        <button
          onClick={createProductHandler}
          className="rounded-md bg-custom-blue-dark p-2 text-white transition duration-150 hover:bg-custom-blue-darker hover:text-custom-blue-lightest"
        >
          <FaPlus className="inline text-custom-blue-lightest" /> Create Product
        </button>
      </div>

      <>
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">NAME</th>
                <th className="px-4 py-3 ">IMAGE</th>
                <th className="px-4 py-3">PRICE</th>
                <th className="px-4 py-3">CATEGORY</th>
                <th className="px-4 py-3">BRAND</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y bg-white">
              {productsData &&
                productsData.products.map((product: Product, index: number) => (
                  <tr key={index} className="text-gray-700">
                    <td className="px-4 py-3">
                      <Link
                        to={`/admin/products/${product.id}/edit`}
                        className="text-custom-blue-dark hover:text-custom-blue-darker"
                      >
                        {product.id}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{product.name}</td>
                    <td className="px-4 py-3">
                      <img
                        className="w-40"
                        src={product.image}
                        alt={product.name}
                      />
                    </td>
                    <td className="px-4 py-3 text-custom-blue-dark">
                      ${product.price}
                    </td>
                    <td className="px-4 py-3">{product.category}</td>
                    <td className="px-4 py-3">{product.brand}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-4 text-sm">
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="mr-2 inline-flex items-center rounded bg-custom-blue-dark px-2 py-1 text-white hover:bg-custom-blue-darkest"
                        >
                          <FaEdit size={18} className="mr-1" />
                          Edit
                        </Link>
                        <button
                          data-testid="delete-button"
                          className="inline-flex items-center rounded bg-custom-red-light px-2 py-1 text-white hover:bg-custom-red-dark"
                          onClick={() => deleteHandler(product.id)}
                        >
                          <FaTrash size={18} className="mr-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {productsData && (
          <Paginate
            pages={productsData.pages}
            page={productsData.page}
            isAdmin={true}
          />
        )}
      </>
    </>
  );
};
