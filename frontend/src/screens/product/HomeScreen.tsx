// frontend\src\screens\product\HomeScreen.tsx

// External Imports
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

// Internal Imports
import { ProductResponse, ErrorMessage } from "../../interfaces";
import Loader from "../../components/common/Loader";
import Message from "../../components/common/Message";
import Paginate from "../../components/utils/Paginate";
import Product from "../../components/features/Product";
import { getProductsApi } from "../../services/api";

// Component Definition
export const HomeScreen = () => {
  // State Variables
  const params = useParams();
  const pageNumber = (params.pageNumber as string) || "1";
  const keyword = (params.keyword as string) || "";

  const [productsData, setProductsData] = useState<ProductResponse | null>(
    null
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorMessage | null>(null);

  // Effect
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProductsApi({ keyword, pageNumber });
        console.log({ data });
        setProductsData(data);
        setLoading(false);
      } catch (err) {
        setError({ message: (err as Error).message });
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
    return <Message variant="danger">{error.message}</Message>;
  }

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
