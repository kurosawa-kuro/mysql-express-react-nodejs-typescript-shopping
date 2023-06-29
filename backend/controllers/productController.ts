// backend\controllers\productController.ts

// External Imports
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

// Internal Imports
import { db } from "../database/prisma/prismaClient";
import { Prisma, Product } from "@prisma/client";
import { UserRequest } from "../interfaces";
import {
  createProductInDB,
  readProductsFromDB,
  readTopProductsFromDB,
  countProductsFromDB,
  updateProductInDB,
  deleteProductInDB,
  pageSize,
} from "../models/productModel";

const getKeywordFilter = (
  keyword: string | undefined
): Prisma.ProductWhereInput => (keyword ? { name: { contains: keyword } } : {});

const handleNotFoundProduct = (product: Product | null, res: Response) => {
  if (!product) {
    res.status(404);
    const err: any = new Error("Resource not found");
    throw err;
  }
  return product;
};

const createProduct = asyncHandler(async (req: UserRequest, res: Response) => {
  req.body.image = req.body.image
    .replace(/\\/g, "/")
    .replace("/frontend/public", "");

  const {
    name,
    price,
    image,
    brand,
    category,
    countInStock,
    numReviews,
    description,
  } = req.body;

  if (!req.user || !req.user.id) {
    res.status(401);
    throw new Error("Not authorized");
  }
  const id = Number(req.user.id);

  const productData: Prisma.ProductCreateInput = {
    name,
    price,
    image,
    brand,
    category,
    countInStock,
    numReviews,
    description,
    user: { connect: { id } },
  };
  const product: Product = await createProductInDB(productData);

  res.status(201).json(product);
});

const readProducts = asyncHandler(async (req: Request, res: Response) => {
  const page: number = Number(req.query.pageNumber) || 1;
  const keywordFilter: Prisma.ProductWhereInput = getKeywordFilter(
    req.query.keyword as string | undefined
  );

  const products: Product[] = await readProductsFromDB(page, keywordFilter);
  const count: number = await countProductsFromDB(keywordFilter);

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

const readProductById = asyncHandler(async (req: Request, res: Response) => {
  const id: number = Number(req.params.id);
  const product: Product | null = await db.product.findUnique({
    where: { id },
  });
  res.json(handleNotFoundProduct(product, res));
});

const readTopProducts = asyncHandler(async (req: Request, res: Response) => {
  const products = await readTopProductsFromDB();
  res.json(products);
});

const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const id: number = Number(req.params.id);
  req.body.image = req.body.image
    .replace(/\\/g, "/")
    .replace("/frontend/public", "");

  const product: Product | null = await updateProductInDB(
    id,
    req.body as Prisma.ProductUpdateInput
  );

  res.json(handleNotFoundProduct(product, res));
});

const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const id: number = Number(req.params.id);
  await deleteProductInDB(id);
  res.json({ message: "Product removed" });
});

export {
  createProduct,
  readProducts,
  readProductById,
  readTopProducts,
  updateProduct,
  deleteProduct,
};
