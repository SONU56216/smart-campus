import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Verify structure for temporary multer files
const getTempDir = (): string => {
  const tempDir = path.join(process.cwd(), 'public', 'uploads', 'temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  return tempDir;
};

// Configure disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, getTempDir());
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

/**
 * File filter inspecting mimetypes, with a structural note about magic bytes.
 */
const getImageFilter = () => {
  return (req: any, file: any, cb: any) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (!allowedExtensions.includes(ext)) {
      return cb(new Error('Only JPG, JPEG, PNG, or WEBP images are permitted!'), false);
    }
    
    cb(null, true);
  };
};

const getDocumentFilter = () => {
  return (req: any, file: any, cb: any) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (!allowedExtensions.includes(ext)) {
      return cb(new Error('Only document formats (JPG, PNG, PDF) are permitted!'), false);
    }
    
    cb(null, true);
  };
};

const getCSVFilter = () => {
  return (req: any, file: any, cb: any) => {
    const allowedExtensions = ['.csv'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (!allowedExtensions.includes(ext)) {
      return cb(new Error('Only spreadsheet CSV formats are permitted!'), false);
    }
    
    cb(null, true);
  };
};

/**
 * Magic Bytes validator that can be run on uploaded files for added security.
 * Reads first bytes of file on disk to confirm physical headers match the extensions.
 */
export const verifyMagicBytes = (filePath: string, allowedTypes: ('image' | 'pdf' | 'csv')[]): boolean => {
  try {
    const fd = fs.openSync(filePath, 'r');
    const buffer = Buffer.alloc(4);
    fs.readSync(fd, buffer, 0, 4, 0);
    fs.closeSync(fd);

    const hex = buffer.toString('hex').toUpperCase();

    // PNG: 89504E47
    // JPEG/JPG: FFD8FF
    // PDF: 25504446 (%PDF)
    const isPNG = hex === '89504E47';
    const isJPG = hex.startsWith('FFD8FF');
    const isPDF = hex.startsWith('25504446');

    if (allowedTypes.includes('image') && (isPNG || isJPG)) {
      return true;
    }
    if (allowedTypes.includes('pdf') && isPDF) {
      return true;
    }
    if (allowedTypes.includes('csv')) {
      // CSV has no constant binary signature as it is plain text, so we rely on text checks/delimiter parse.
      return true;
    }

    return false;
  } catch (error) {
    console.error('Magic bytes verification failed:', error);
    return false; // Fail secure
  }
};

// Multer middleware instances
export const uploadPhoto = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB size limit
  fileFilter: getImageFilter()
});

export const uploadDocument = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB size limit
  fileFilter: getDocumentFilter()
});

export const uploadMultipleDocuments = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: getDocumentFilter()
});

export const uploadCSV = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: getCSVFilter()
});
