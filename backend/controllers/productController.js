import asyncHandler from '../middleware/asyncHandler.js';
import { db } from '../database/prisma/prismaClient.js';

const pageSize = Number(process.env.PAGINATION_LIMIT);

const getKeywordFilter = (keyword) => keyword
  ? {
    name: {
      contains: keyword
    }
  }
  : {};

const getProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.pageNumber) || 1;
  const keywordFilter = getKeywordFilter(req.query.keyword);
  const count = await db.product.count({ where: keywordFilter });

  const products = await db.product.findMany({
    where: keywordFilter,
    take: pageSize,
    skip: pageSize * (page - 1),
  });

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

const getProductById = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const product = await db.product.findUnique({
    where: { id }
  });

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Resource not found');
  }
});

const createProduct = asyncHandler(async (req, res) => {
  const productData = {
    name: 'Sample name',
    price: 0,
    userId: req.user.id,
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  };

  const createdProduct = await db.product.create({ data: productData });
  res.status(201).json(createdProduct);
});

const updateProduct = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const updatedProduct = await db.product.update({
    where: { id },
    data: req.body,
  });

  if (updatedProduct) {
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const deletedProduct = await db.product.delete({
    where: { id }
  });

  if (deletedProduct) {
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

const createProductReview = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { rating, comment } = req.body;

  const product = await db.product.findUnique({
    where: { id },
  });

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.userId.toString() === req.user.id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      userId: req.user.id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await db.product.update({
      where: { id },
      data: { reviews: product.reviews, numReviews: product.numReviews, rating: product.rating },
    });

    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

const getTopProducts = asyncHandler(async (req, res) => {
  const products = await db.product.findMany({
    orderBy: { rating: 'desc' },
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
  createProductReview,
  getTopProducts,
};
