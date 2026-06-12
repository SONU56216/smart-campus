import crypto from 'crypto';

// Secret key must be 32 bytes (256 bits). If key is shorter, we hash it to guarantee length.
const getSecretKey = (): Buffer => {
  const secret = process.env.QR_ENCRYPTION_SECRET || 'campus-pass-secure-encryption-key-aes-256';
  return crypto.createHash('sha256').update(secret).digest();
};

/**
 * Encrypts data for the QR code using AES-256-CBC
 * The initialization vector (IV) is prepended to the ciphertext
 */
export const encryptQRData = (data: string): string => {
  try {
    const key = getSecretKey();
    const iv = crypto.randomBytes(16); // 16 bytes for AES block size
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Format: iv_hex:encrypted_hex
    return `${iv.toString('hex')}:${encrypted}`;
  } catch (error: any) {
    throw new Error(`QR Data encryption failed: ${error.message}`);
  }
};

/**
 * Decrypts encrypted QR code data back to its original string format
 */
export const decryptQRData = (encryptedData: string): string => {
  try {
    const parts = encryptedData.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted QR data format. Missing standard delimiter.');
    }
    
    const ivHex = parts[0];
    const encryptedHex = parts[1];
    
    const key = getSecretKey();
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error: any) {
    throw new Error(`QR Data decryption failed: ${error.message}`);
  }
};

/**
 * Tool helper to generate a secure random 32-byte (256-bit) encryption key
 */
export const generateEncryptionKey = (): string => {
  return crypto.randomBytes(32).toString('hex');
};
