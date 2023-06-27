// backend/routes/uploadRoutes.ts

// External Imports
import express, { Request, Response, Router } from "express";
import { diskStorage } from "multer";
import path from "path";

// Middleware Initialization
import multer from "multer";

export const router: Router = express.Router();
const { NODE_ENV } = process.env;

const uploadFolder: string =
  NODE_ENV === "production" ? "var/data/" : "uploads";

const storage = diskStorage({
  destination(req, file, cb) {
    cb(null, "./frontend/public/images/");
  },
  filename(
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage });

router.post("/", upload.single("image"), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send({ message: "No file uploaded" });
  }

  res.send({
    message: "Image uploaded successfully",
    image: `/${req.file.path}`,
  });
});
