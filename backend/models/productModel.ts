// backend\models\productModel.ts

import { Prisma, Product } from "@prisma/client";
import { db } from "../database/prisma/prismaClient";

export const pageSize: number = Number(process.env.PAGINATION_LIMIT);

export const createProductInDB = async (
  data: Prisma.ProductCreateInput
): Promise<Product> => {
  const product: Product = await db.product.create({
    data,
  });
  return product;
};

export const readProductsFromDB = async (
  page: number,
  keywordFilter: Prisma.ProductWhereInput
): Promise<Product[]> => {
  const products: Product[] = await db.product.findMany({
    where: keywordFilter,
    take: pageSize,
    skip: pageSize * (page - 1),
    orderBy: {
      createdAt: "desc",
    },
  });
  return products;
};

export const countProductsFromDB = async (
  keywordFilter: Prisma.ProductWhereInput
): Promise<number> => {
  return await db.product.count({ where: keywordFilter });
};

export const updateProductInDB = async (
  id: number,
  data: Prisma.ProductUpdateInput
): Promise<Product | null> => {
  const updatedProduct: Product | null = await db.product.update({
    where: { id },
    data,
  });
  return updatedProduct;
};

export const deleteProductInDB = async (id: number): Promise<void> => {
  await db.product.delete({
    where: { id },
  });
};

export const readTopProductsFromDB = async (): Promise<Product[]> => {
  const products: Product[] = await db.product.findMany({
    orderBy: { rating: "desc" },
    take: 3,
  });
  return products;
};
