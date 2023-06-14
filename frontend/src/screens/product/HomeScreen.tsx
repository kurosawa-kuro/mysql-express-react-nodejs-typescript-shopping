// frontend\src\screens\product\HomeScreen.tsx

// External Imports
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";

// Internal Imports
import { ProductResponse } from "../../interfaces";
import Loader from "../../components/common/Loader";
import Message from "../../components/common/Message";
import Paginate from "../../components/utils/Paginate";
import Product from "../../components/features/Product";
import { getProductsApi } from "../../services/api";

// Component Definition
export const HomeScreen: React.FC = () => {
  // State Variables
  const params = useParams();
  const pageNumber = Number(params.pageNumber);
  const keyword = (params.keyword as string) || "";

  const [productsData, setProductsData] = useState<ProductResponse | null>(
    null
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Effect
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProductsApi({
          keyword,
          pageNumber,
        });
        setProductsData(data);
        setLoading(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast.error(err.message);
          setError(err.message);
        } else {
          toast.error("An error occurred.");
          setError("An error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [pageNumber, keyword]);

  // Component Render
  return (
    <>
      {!keyword ? (
        <></>
      ) : (
        <Link
          to="/"
          className="mb-4 inline-block rounded bg-white px-4 py-2 text-gray-700 hover:bg-gray-200"
        >
          Go Back
        </Link>
      )}
      <>
        {/* <Meta /> */}
        <h1 className="mt-4 text-2xl font-semibold text-gray-700">
          Latest Products
        </h1>

        {loading && <Loader />}
        {error && <Message variant="danger">{error}</Message>}

        <div className="m-4 flex flex-wrap">
          {productsData &&
            productsData.products.map((product) => (
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
            keyword={keyword ? keyword : ""}
          />
        )}
      </>
    </>
  );
};
