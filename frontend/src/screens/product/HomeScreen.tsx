// File Path: frontend\src\screens\product\HomeScreen.tsx

// External Imports
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

// Internal Imports
import Loader from "../../components/common/Loader";
import Message from "../../components/common/Message";
import Paginate from "../../components/utils/Paginate";
import Product from "../../components/features/Product";
import { getProductsApi } from "../../services/api";
import { ProductResponse } from "../../interfaces";

export const HomeScreen: React.FC = () => {
  const { pageNumber = "1", keyword = "" } = useParams();
  const [productsData, setProductsData] = useState<ProductResponse | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProductsApi({
        keyword,
        pageNumber: Number(pageNumber),
      });
      setProductsData(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred.";
      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [pageNumber, keyword]);

  return (
    <>
      {keyword && (
        <Link
          to="/"
          className="mb-4 inline-block rounded bg-white px-4 py-2 text-gray-700 hover:bg-gray-200"
        >
          Go Back
        </Link>
      )}

      <h1 className="mt-4 text-2xl font-semibold text-gray-700">
        Latest Products
      </h1>

      {loading && <Loader />}
      {error && <Message variant="danger">{error}</Message>}

      <div className="m-4 flex flex-wrap">
        {productsData?.products.map((product) => (
          <div
            key={product.id}
            className="w-full p-4 sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3"
          >
            <Product product={product} />
          </div>
        ))}
      </div>

      {productsData && (
        <Paginate
          pages={productsData.pages}
          page={productsData.page}
          keyword={keyword}
        />
      )}
    </>
  );
};
