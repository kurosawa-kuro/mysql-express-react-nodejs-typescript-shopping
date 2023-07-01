// frontend\src\screens\admin\product\ProductListScreen.tsx

import React, { useState, useEffect } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Message } from "../../../components/common/Message";
import { Loader } from "../../../components/common/Loader";
import { Paginate } from "../../../components/utils/Paginate";
import { readProducts, deleteProduct } from "../../../services/api";
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
        const data = await readProducts({
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
        const newProductsData = await readProducts({
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
      <>
        <h1 className="mb-2 mt-2 text-center text-3xl font-bold text-custom-blue-dark">
          Products
        </h1>
        {loading && <Loader />}
        {error && <Message variant="danger">{error}</Message>}
      </>
      <button
        onClick={createProductHandler}
        className="mb-2 rounded-md bg-custom-green-light p-2 text-white transition duration-150 hover:bg-custom-green-dark hover:text-custom-blue-lightest"
      >
        <FaPlus className="inline text-custom-blue-lightest" /> Create Product
      </button>
      <>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-custom-blue-dark">
            <thead className="bg-custom-blue-lightest">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-custom-blue-dark">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-custom-blue-dark">
                  NAME
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-custom-blue-dark">
                  IMAGE
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-custom-blue-dark">
                  PRICE
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-custom-blue-dark">
                  CATEGORY
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-custom-blue-dark">
                  BRAND
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-custom-blue-dark"></th>
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
                          className="mr-2 inline-flex items-center rounded bg-custom-blue-darker px-2 py-1 text-white hover:bg-custom-blue-darkest"
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
