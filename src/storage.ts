import { Express, Request } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';

import { IMAGES_DIR } from './hobbies';
if (!fs.existsSync(IMAGES_DIR)) {
  try {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  } catch (error) {
    console.warn(`Warning: Could not create uploads directory: ${error}`);
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, IMAGES_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const safeExt = path.extname(file.originalname).replace(/[^a-zA-Z0-9.]/g, '');
    cb(null, `${uniqueSuffix}${safeExt}`);
  },
});

const fileFilter = async (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  try {
    const { fileTypeFromFile } = await import('file-type');
    const fileType = await fileTypeFromFile(file.path);
    
    if (!fileType || !fileType.mime.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'));
    }
    cb(null, true);
  } catch (error) {
    cb(new Error('Only image files are allowed!'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
