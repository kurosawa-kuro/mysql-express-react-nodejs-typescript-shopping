// backend\models\productModel.ts

import { Prisma, Product } from "@prisma/client";
import { db } from "../database/prisma/prismaClient";

const pageSize: number = Number(process.env.PAGINATION_LIMIT);

const createProductInDB = async (
  productData: Prisma.ProductCreateInput
): Promise<Product> => {
  const product: Product = await db.product.create({
    data: productData,
  });
  return product;
};

const getProductsFromDB = async (
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

const countProductsFromDB = async (
  keywordFilter: Prisma.ProductWhereInput
): Promise<number> => {
  return await db.product.count({ where: keywordFilter });
};

const updateProductInDB = async (
  id: number,
  updatedProductData: Prisma.ProductUpdateInput
): Promise<Product | null> => {
  const updatedProduct: Product | null = await db.product.update({
    where: { id },
    data: updatedProductData,
  });
  return updatedProduct;
};

export {
  createProductInDB,
  getProductsFromDB,
  countProductsFromDB,
  updateProductInDB,
  pageSize,
};
