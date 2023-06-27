// backend\models\productModel.ts

import { Prisma, Product } from "@prisma/client";
import { db } from "../database/prisma/prismaClient";

const createProductInDB = async (
  productData: Prisma.ProductCreateInput
): Promise<Product> => {
  const product: Product = await db.product.create({
    data: productData,
  });
  return product;
};

export { createProductInDB };
