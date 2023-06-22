// frontend\src\screens\admin\product\ProductListScreen.tsx

import React, { useState, useEffect } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Message } from "../../../components/common/Message";
import { Loader } from "../../../components/common/Loader";
import { Paginate } from "../../../components/utils/Paginate";
import { getProductsApi, deleteProductApi } from "../../../services/api";
import { ProductList, ProductFull } from "../../../../../backend/interfaces";
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
        const data = await getProductsApi({
          pageNumber: Number(pageNumber),
          keyword: "",
        });
        setProductsData(data);
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An error occurred.");
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
        await deleteProductApi(id);
        const newProductsData = await getProductsApi({
          pageNumber: Number(pageNumber),
          keyword: "",
        });
        setProductsData(newProductsData);
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error("An error occurred.");
        }
      }
    }
  };

  const createProductHandler = async () => {
    // "/admin/product/new"に遷移
    navigate("/admin/products/new");
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        {loading && <Loader />}
        {error && <Message variant="danger">{error}</Message>}
        <button
          onClick={createProductHandler}
          className="rounded-md bg-indigo-600 p-2 text-white transition duration-150 hover:bg-indigo-500"
        >
          <FaPlus className="inline" /> Create Product
        </button>
      </div>

      <>
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">NAME</th>
                <th className="px-4 py-3">PRICE</th>
                <th className="px-4 py-3">CATEGORY</th>
                <th className="px-4 py-3">BRAND</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y bg-white">
              {productsData &&
                productsData.products.map((product: ProductFull) => (
                  <tr key={product.id} className="text-gray-700">
                    <td className="px-4 py-3">
                      <Link
                        to={`/admin/products/${product.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        {product.id}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{product.name}</td>
                    <td className="px-4 py-3">${product.price}</td>
                    <td className="px-4 py-3">{product.category}</td>
                    <td className="px-4 py-3">{product.brand}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-4 text-sm">
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() =>
                            product.id && deleteHandler(product.id)
                          }
                          className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
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
