import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to get destination folder dynamically
const getUploadFolder = (fieldname) => {
  // Ensure uploads directory exists
  const uploadDir = path.join(
    __dirname,
    `../public/images/products/${fieldname}/`
  );

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  return uploadDir;
};

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, getUploadFolder(file.fieldname)); // Set folder dynamically based on fieldname
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); // Preserve file extension
    cb(null, uniqueSuffix + ext);
  },
});

// Multer Upload Middleware
const upload = multer({ storage });

export default upload;
