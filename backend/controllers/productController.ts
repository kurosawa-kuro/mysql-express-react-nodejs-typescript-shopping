import asyncHandler from "express-async-handler";
import { db } from "../database/prisma/prismaClient";
import { Prisma, Product, User } from "@prisma/client";
import { Request, Response } from "express";

interface ReqUser extends Request {
  user?: User & { id: string };
}

const pageSize: number = Number(process.env.PAGINATION_LIMIT);

const getKeywordFilter = (
  keyword: string | undefined
): Prisma.ProductWhereInput =>
  keyword
    ? {
        name: {
          contains: keyword,
        },
      }
    : {};

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

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

const createProduct = asyncHandler(async (req: ReqUser, res: Response) => {
  if (!req.user || !req.user.id) {
    res.status(401);
    throw new Error("Not authorized");
  }

  // 以下は元のコードをそのまま使っています
  const productData: Prisma.ProductCreateInput = {
    name: "Sample name",
    price: 0,
    user: {
      connect: {
        id: Number(req.user.id),
      },
    },
    image: "/images/sample.jpg",
    brand: "Sample brand",
    category: "Sample category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample description",
  };

  const createdProduct: Product = await db.product.create({
    data: productData,
  });
  res.status(201).json(createdProduct);
});

const updateProduct = asyncHandler(async (req: ReqUser, res: Response) => {
  const id: number = Number(req.params.id);
  req.body.image = req.body.image
    .replace(/\\/g, "/")
    .replace("/frontend/public", "");

  const product: Product | null = await db.product.update({
    where: { id },
    data: req.body as Prisma.ProductUpdateInput,
  });

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

const deleteProduct = asyncHandler(async (req: ReqUser, res: Response) => {
  const id: number = Number(req.params.id);
  const deletedProduct: Product = await db.product.delete({
    where: { id },
  });

  if (deletedProduct) {
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
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
