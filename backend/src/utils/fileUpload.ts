import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

// Configure Cloudinary with environment variables
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const isCloudinaryConfigured = !!(cloudName && apiKey && apiSecret);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
} else {
  console.warn(
    '⚠️  [CLOUDINARY] Credentials not configured. Local fallback filesystem will be used for file uploads.'
  );
}

/**
 * Uploads a local/bytes file to Cloudinary OR falls back to local storage
 */
export const uploadToCloudinary = async (
  filePath: string,
  folderName: string = 'campus_pass'
): Promise<{ url: string; publicId: string }> => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Upload source file not found at path: ${filePath}`);
    }

    if (isCloudinaryConfigured) {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: `campus_pass/${folderName}`,
        resource_type: 'auto',
      });
      
      // Attempt cleanup of temp file
      try {
        fs.unlinkSync(filePath);
      } catch (cleanErr) {
        // Suppress clean error
      }

      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
    } else {
      // Local fallback storage emulation
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', folderName);
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const fileExt = path.extname(filePath);
      const uniqueFileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}${fileExt}`;
      const destinationPath = path.join(uploadsDir, uniqueFileName);

      fs.copyFileSync(filePath, destinationPath);

      // Attempt cleanup of temp file
      try {
        fs.unlinkSync(filePath);
      } catch (cleanErr) {
        // Suppress
      }

      // Return a simulated URL path relative to the public structure
      const relativeUrl = `/uploads/${folderName}/${uniqueFileName}`;
      return {
        url: relativeUrl,
        publicId: `local_${folderName}_${uniqueFileName.split('.')[0]}`,
      };
    }
  } catch (error: any) {
    throw new Error(`File upload fails: ${error.message}`);
  }
};

/**
 * Deletes a file from Cloudinary (or local filesystem if it started there)
 */
export const deleteFromCloudinary = async (publicId: string): Promise<boolean> => {
  try {
    if (!publicId) return false;

    if (publicId.startsWith('local_')) {
      // It is local fallback. We can extract folder and file name from publicId.
      // Format is local_[folderName]_[fileName]
      const parts = publicId.split('_');
      if (parts.length >= 3) {
        const folder = parts[1];
        const fileBase = parts.slice(2).join('_');
        const searchDir = path.join(process.cwd(), 'public', 'uploads', folder);
        
        if (fs.existsSync(searchDir)) {
          const files = fs.readdirSync(searchDir);
          const foundFile = files.find(f => f.startsWith(fileBase));
          if (foundFile) {
            fs.unlinkSync(path.join(searchDir, foundFile));
            return true;
          }
        }
      }
      return true;
    }

    if (isCloudinaryConfigured) {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    }

    return true;
  } catch (error) {
    console.error(`Failed to delete asset ${publicId}:`, error);
    return false;
  }
};

/**
 * Returns an optimized cloud URL using transformations (compression, formats)
 */
export const getOptimizedUrl = (publicId: string, width: number = 300, height: number = 300): string => {
  if (!publicId) return '';
  
  if (publicId.startsWith('local_')) {
    // Local, transform URL string can't apply, return original placeholder path
    const parts = publicId.split('_');
    if (parts.length >= 3) {
      const folder = parts[1];
      const name = parts.slice(2).join('_');
      return `/uploads/${folder}/${name}.jpg`; // typical approximation
    }
    return '';
  }

  if (isCloudinaryConfigured) {
    return cloudinary.url(publicId, {
      width,
      height,
      crop: 'fill',
      quality: 'auto',
      fetch_format: 'auto',
    });
  }

  return '';
};

/**
 * High-level helper for student biometric photographs
 */
export const uploadStudentPhoto = async (tempPath: string): Promise<{ url: string; publicId: string }> => {
  return uploadToCloudinary(tempPath, 'student_photos');
};

/**
 * High-level helper for verification/fees files uploads
 */
export const uploadDocument = async (tempPath: string): Promise<{ url: string; publicId: string }> => {
  return uploadToCloudinary(tempPath, 'documents');
};
