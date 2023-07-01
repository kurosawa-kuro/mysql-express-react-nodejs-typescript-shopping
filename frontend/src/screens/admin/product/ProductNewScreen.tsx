// frontend\src\screens\admin\product\ProductEditScreen.tsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { uploadProductImage, createProduct } from "../../../services/api";
import { Loader } from "../../../components/common/Loader";
import { Message } from "../../../components/common/Message";
import { ProductData } from "../../../../../backend/interfaces";
import { FormContainer } from "../../../components/layout/FormContainer";

export const ProductNewScreen: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitHandler = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data: ProductData = {
        name,
        image,
        brand,
        category,
        description,
        rating: 0,
        numReviews: 0,
        price,
        countInStock,
      };
      await createProduct(data);
      toast.success("Product created");
      navigate("/admin/products/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await uploadProductImage(formData);
      toast.success(res.message);
      setImage(res.image);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    }
  };

  return (
    <>
      <Link to="/admin/products/" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <div className="mx-auto mt-4 w-full max-w-md">
          <h1 className="mb-2 mt-2 text-center  text-3xl font-bold text-custom-blue-dark">
            Create Product
          </h1>
          {loading && <Loader />}
          {error && <Message variant="danger">{error}</Message>}
          <form className="mt-8 space-y-6" onSubmit={submitHandler}>
            <input type="hidden" name="remember" value="true" />
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="name" className="text-custom-blue-dark">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="name"
                  required
                  className="relative mb-4 mt-2 block w-full appearance-none rounded-none border border-custom-blue-light px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-custom-blue-dark focus:outline-none focus:ring-custom-blue-dark sm:text-sm"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="price" className="text-custom-blue-dark">
                  Price
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  required
                  className="relative mb-4 mt-2 block w-full appearance-none rounded-none border border-custom-blue-light px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-custom-blue-dark focus:outline-none focus:ring-custom-blue-dark sm:text-sm"
                  placeholder="Enter price"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </div>
              <div>
                <label htmlFor="image-file" className="text-custom-blue-dark">
                  Image File
                </label>
                {image && (
                  <img
                    className="w-40"
                    src={image
                      .replace(/\\/g, "/")
                      .replace("/frontend/public", "")}
                    alt={image}
                  />
                )}
                <input
                  id="image"
                  name="image"
                  type="text"
                  required
                  className="relative block w-full appearance-none rounded-none border border-custom-blue-light px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-custom-blue-dark focus:outline-none focus:ring-custom-blue-dark sm:text-sm"
                  placeholder="Enter image url"
                  value={image
                    .replace(/\\/g, "/")
                    .replace("/frontend/public", "")}
                  onChange={(e) => setImage(e.target.value)}
                  style={{ display: "none" }}
                />
                <input
                  id="image-file"
                  name="image-file"
                  type="file"
                  className="relative mb-4 block w-full appearance-none rounded-none border border-custom-blue-light bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-custom-blue-dark focus:outline-none focus:ring-custom-blue-dark sm:text-sm"
                  onChange={uploadFileHandler}
                />
              </div>
              <div>
                <label htmlFor="brand" className="text-custom-blue-dark">
                  Brand
                </label>
                <input
                  id="brand"
                  name="brand"
                  type="text"
                  required
                  className="relative mb-4 mt-2 block w-full appearance-none rounded-none border border-custom-blue-light px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-custom-blue-dark focus:outline-none focus:ring-custom-blue-dark sm:text-sm"
                  placeholder="Enter brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="countInStock" className="text-custom-blue-dark">
                  Count In Stock
                </label>
                <input
                  id="countInStock"
                  name="countInStock"
                  type="number"
                  required
                  className="relative mb-4 mt-2 block w-full appearance-none rounded-none border border-custom-blue-light px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-custom-blue-dark focus:outline-none focus:ring-custom-blue-dark sm:text-sm"
                  placeholder="Enter countInStock"
                  value={countInStock}
                  onChange={(e) => setCountInStock(Number(e.target.value))}
                />
              </div>
              <div>
                <label htmlFor="category" className="text-custom-blue-dark">
                  Category
                </label>
                <input
                  id="category"
                  name="category"
                  type="text"
                  required
                  className="relative mb-4 mt-2 block w-full appearance-none rounded-none border border-custom-blue-light px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-custom-blue-dark focus:outline-none focus:ring-custom-blue-dark sm:text-sm"
                  placeholder="Enter category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="description" className="text-custom-blue-dark">
                  Description
                </label>
                <input
                  id="description"
                  name="description"
                  type="text"
                  required
                  className="relative mb-4 mt-2 block w-full appearance-none rounded-none border border-custom-blue-light px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-custom-blue-dark focus:outline-none focus:ring-custom-blue-dark sm:text-sm"
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-custom-blue-dark px-4 py-2 text-sm font-medium text-white hover:bg-custom-blue-darkest focus:outline-none focus:ring-2 focus:ring-custom-blue-dark focus:ring-offset-2"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </FormContainer>
    </>
  );
};
