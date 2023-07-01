// File Path: frontend\src\screens\product\HomeScreen.tsx

// External Imports
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

// Internal Imports
import { Loader } from "../../components/common/Loader";
import { Message } from "../../components/common/Message";
import { Paginate } from "../../components/utils/Paginate";
import { Product } from "../../components/features/Product";
import { readProducts } from "../../services/api";
import { ProductList } from "../../../../backend/interfaces";
import { Product as ProductType } from "@prisma/client";
import { ProductCarousel } from "../../components/features/ProductCarousel";

interface ProductsFetchParams {
  keyword: string;
  pageNumber: number;
}

const fetchProducts = async ({
  keyword,
  pageNumber,
}: ProductsFetchParams): Promise<ProductList | null> => {
  try {
    const data = await readProducts({ keyword, pageNumber });
    return data;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An error occurred.";
    toast.error(message);
    return null;
  }
};

export const HomeScreen: React.FC = () => {
  const { pageNumber = "1", keyword = "" } = useParams();
  const [productsData, setProductsData] = useState<ProductList | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchProducts({ keyword, pageNumber: Number(pageNumber) })
      .then((data) => setProductsData(data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [pageNumber, keyword]);

  return (
    <>
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link
          to="/"
          className="mb-4 inline-block rounded bg-white px-4 py-2 text-gray-700 hover:bg-gray-200"
        >
          Go Back
        </Link>
      )}

      <h1 className="mb-2 mt-2 text-center  text-3xl font-bold text-custom-blue-dark">
        Latest Products
      </h1>

      {loading && <Loader />}
      {error && <Message variant="danger">{error}</Message>}

      <div className="m-4 flex flex-wrap">
        {productsData?.products.map((product: ProductType) => (
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
