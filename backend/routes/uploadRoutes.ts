// backend\routes\uploadRoutes.ts

import path from 'path';
import express, { Request, Response, Router } from 'express';
import multer, { diskStorage } from 'multer';

const router: Router = express.Router();

// If production, use Render server's data folder, else use local uploads folder
const uploadFolder: string = 
  process.env.NODE_ENV === 'production' ? 'var/data/' : 'uploads/';

const storage = diskStorage({
  destination(req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    cb(null, uploadFolder);
  },
  filename(req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file: Express.Multer.File, cb: (error: Error | null, checkType: boolean) => void) {
  const filetypes: RegExp = /jpg|jpeg|png/;
  const extname: boolean = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype: boolean = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only!'), false);
  }
}


const upload = multer({
  storage,
});

router.post('/', upload.single('image'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send({ message: 'No file uploaded' });
  }
  
  res.send({
    message: 'Image uploaded successfully',
    image: `/${req.file.path}`,
  });
});

export default router;
