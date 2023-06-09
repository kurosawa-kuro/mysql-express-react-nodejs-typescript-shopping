// backend\controllers\productController.ts

// External Imports
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

// Internal Imports
import { db } from "../database/prisma/prismaClient";
import { Prisma, Product } from "@prisma/client";
import { RequestUser } from "../interfaces";

const pageSize: number = Number(process.env.PAGINATION_LIMIT);

const getKeywordFilter = (
  keyword: string | undefined
): Prisma.ProductWhereInput => (keyword ? { name: { contains: keyword } } : {});

const handleNotFoundProduct = (product: Product | null) => {
  if (!product) {
    const err: any = new Error("Resource not found");
    err.statusCode = 404;
    throw err;
  }
  return product;
};

const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const page: number = Number(req.query.pageNumber) || 1;
  const keywordFilter: Prisma.ProductWhereInput = getKeywordFilter(
    req.query.keyword as string | undefined
  );
  const count: number = await db.product.count({ where: keywordFilter });

  const products: Product[] = await db.product.findMany({
    where: keywordFilter,
    take: pageSize,
    skip: pageSize * (page - 1),
  });

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const id: number = Number(req.params.id);
  const product: Product | null = await db.product.findUnique({
    where: { id },
  });
  res.json(handleNotFoundProduct(product));
});

const createProduct = asyncHandler(async (req: RequestUser, res: Response) => {
  if (!req.user?.id) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const product: Product = await db.product.create({
    data: {
      name: "Sample name",
      price: 0,
      user: { connect: { id: Number(req.user.id) } },
      image: "/images/sample.jpg",
      brand: "Sample brand",
      category: "Sample category",
      countInStock: 0,
      numReviews: 0,
      description: "Sample description",
    },
  });

  res.status(201).json(product);
});

const updateProduct = asyncHandler(async (req: RequestUser, res: Response) => {
  const id: number = Number(req.params.id);
  req.body.image = req.body.image
    .replace(/\\/g, "/")
    .replace("/frontend/public", "");

  const product: Product | null = await db.product.update({
    where: { id },
    data: req.body as Prisma.ProductUpdateInput,
  });

  res.json(handleNotFoundProduct(product));
});

const deleteProduct = asyncHandler(async (req: RequestUser, res: Response) => {
  const id: number = Number(req.params.id);
  await db.product.delete({
    where: { id },
  });
  res.json({ message: "Product removed" });
});

const getTopProducts = asyncHandler(async (req: Request, res: Response) => {
  const products: Product[] = await db.product.findMany({
    orderBy: { rating: "desc" },
    take: 3,
  });

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
