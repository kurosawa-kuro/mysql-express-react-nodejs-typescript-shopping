import bcrypt from "bcryptjs";
import { db } from "./prismaClient";

interface UserType {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

interface ProductType {
  name: string;
  image: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  countInStock: number;
  rating: number;
  numReviews: number;
}

async function prepareDatabase() {
  console.log("seed.js prepareDatabase()");

  // Disable foreign key checks
  await db.$executeRaw`SET FOREIGN_KEY_CHECKS=0;`;

  // Truncate the 'product' and 'user' tables
  await db.$executeRaw`TRUNCATE TABLE product;`;
  await db.$executeRaw`TRUNCATE TABLE user;`;

  // Enable foreign key checks
  await db.$executeRaw`SET FOREIGN_KEY_CHECKS=1;`;
}

async function createUsers() {
  console.log("seed.js createUsers()");

  const users: UserType[] = [
    {
      name: "Admin",
      email: "admin@email.com",
      password: "123456",
      isAdmin: true,
    },
    {
      name: "john",
      email: "john@email.com",
      password: "123456",
      isAdmin: false,
    },
    {
      name: "jane",
      email: "jane@email.com",
      password: "123456",
      isAdmin: false,
    },
  ];

  for (const user of users) {
    const { name, email, password, isAdmin } = user;
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.create({
      data: { name, password: hashedPassword, email, isAdmin },
    });
  }

  const createdUsers: UserType[] = await db.user.findMany();
  console.log("seed.js createUsers() createdUsers:", createdUsers);
}

async function createProducts() {
  console.log("seed.js createProducts()");

  const products: ProductType[] = [
    {
      name: "Airpods Wireless Bluetooth Headphones",
      image: "/images/airpods.jpg",
      description:
        "Bluetooth technology lets you connect it with compatible devices wirelessly High-quality AAC audio offers immersive listening experience Built-in microphone allows you to take calls while working",
      brand: "Apple",
      category: "Electronics",
      price: 89.99,
      countInStock: 10,
      rating: 4.5,
      numReviews: 12,
    },
    {
      name: "iPhone 13 Pro 256GB Memory",
      image: "/images/phone.jpg",
      description:
        "Introducing the iPhone 13 Pro. A transformative triple-camera system that adds tons of capability without complexity. An unprecedented leap in battery life",
      brand: "Apple",
      category: "Electronics",
      price: 599.99,
      countInStock: 7,
      rating: 4.0,
      numReviews: 8,
    },
    {
      name: "Cannon EOS 80D DSLR Camera",
      image: "/images/camera.jpg",
      description:
        "Characterized by versatile imaging specs, the Canon EOS 80D further clarifies itself using a pair of robust focusing systems and an intuitive design",
      brand: "Cannon",
      category: "Electronics",
      price: 929.99,
      countInStock: 5,
      rating: 3,
      numReviews: 12,
    },
    {
      name: "Sony Playstation 5",
      image: "/images/playstation.jpg",
      description:
        "The ultimate home entertainment center starts with PlayStation. Whether you are into gaming, HD movies, television, music",
      brand: "Sony",
      category: "Electronics",
      price: 399.99,
      countInStock: 11,
      rating: 5,
      numReviews: 12,
    },
    {
      name: "Logitech G-Series Gaming Mouse",
      image: "/images/mouse.jpg",
      description:
        "Get a better handle on your games with this Logitech LIGHTSYNC gaming mouse. The six programmable buttons allow customization for a smooth playing experience",
      brand: "Logitech",
      category: "Electronics",
      price: 49.99,
      countInStock: 7,
      rating: 3.5,
      numReviews: 10,
    },
    {
      name: "Amazon Echo Dot 3rd Generation",
      image: "/images/alexa.jpg",
      description:
        "Meet Echo Dot - Our most popular smart speaker with a fabric design. It is our most compact smart speaker that fits perfectly into small space",
      brand: "Amazon",
      category: "Electronics",
      price: 29.99,
      countInStock: 0,
      rating: 4,
      numReviews: 12,
    },
  ];

  for (const product of products) {
    const {
      name,
      image,
      description,
      brand,
      category,
      price,
      countInStock,
      rating,
      numReviews,
    } = product;

    await db.product.create({
      data: {
        name,
        image,
        description,
        brand,
        category,
        price,
        countInStock,
        rating: Number(rating),
        numReviews,
        userId: 1,
      },
    });
  }

  const createdProducts: ProductType[] = await db.product.findMany();
  console.log("seed.js createProducts() createdProducts:", createdProducts);
}

async function main() {
  await prepareDatabase();
  await createUsers();
  await createProducts();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
