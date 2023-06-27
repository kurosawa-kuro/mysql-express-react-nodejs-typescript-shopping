// backend\models\productModel.ts

import { Prisma, Product } from "@prisma/client";
import { db } from "../database/prisma/prismaClient";

export const pageSize: number = Number(process.env.PAGINATION_LIMIT);

export const createProductInDB = async (
  productData: Prisma.ProductCreateInput
): Promise<Product> => {
  const product: Product = await db.product.create({
    data: productData,
  });
  return product;
};

export const getProductsFromDB = async (
  page: number,
  keywordFilter: Prisma.ProductWhereInput
): Promise<Product[]> => {
  const products: Product[] = await db.product.findMany({
    where: keywordFilter,
    take: pageSize,
    skip: pageSize * (page - 1),
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
  updatedProductData: Prisma.ProductUpdateInput
): Promise<Product | null> => {
  const updatedProduct: Product | null = await db.product.update({
    where: { id },
    data: updatedProductData,
  });
  return updatedProduct;
};

export const deleteProductInDB = async (id: number): Promise<void> => {
  await db.product.delete({
    where: { id },
  });
};

export const getTopProductsFromDB = async (): Promise<Product[]> => {
  const products: Product[] = await db.product.findMany({
    orderBy: { rating: "desc" },
    take: 3,
  });
  return products;
};