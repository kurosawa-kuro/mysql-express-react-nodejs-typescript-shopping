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
  getProductsFromDB,
  countProductsFromDB,
  updateProductInDB,
  deleteProductInDB,
  getTopProductsFromDB,
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

const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const page: number = Number(req.query.pageNumber) || 1;
  const keywordFilter: Prisma.ProductWhereInput = getKeywordFilter(
    req.query.keyword as string | undefined
  );

  const products: Product[] = await getProductsFromDB(page, keywordFilter);
  const count: number = await countProductsFromDB(keywordFilter);

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const id: number = Number(req.params.id);
  const product: Product | null = await db.product.findUnique({
    where: { id },
  });
  res.json(handleNotFoundProduct(product, res));
});

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

  const product: Product = await createProductInDB({
    name,
    price,
    user: { connect: { id: Number(req.user.id) } },
    image,
    brand,
    category,
    countInStock,
    numReviews,
    description,
  });

  res.status(201).json(product);
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

const getTopProducts = asyncHandler(async (req: Request, res: Response) => {
  const products = await getTopProductsFromDB();
  res.json(products);
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getTopProducts,
};
