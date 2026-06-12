import QRCode from 'qrcode';
import { encryptQRData } from './encryption';

/**
 * Generates a standard base64 Data URL QR code from a raw text payload
 */
export const generateStaticQR = async (payload: string): Promise<string> => {
  try {
    const dataUrl = await QRCode.toDataURL(payload, {
      margin: 1,
      width: 300,
      color: {
        dark: '#3700B3', // Brand dark purple color for aesthetic quality
        light: '#FFFFFF'
      }
    });
    return dataUrl;
  } catch (error: any) {
    throw new Error(`Failed to generate static QR code: ${error.message}`);
  }
};

/**
 * Generates an encrypted, daily-changing dynamic QR code.
 * Changes seed based on calendar date to prevent replay/screenshot cloning.
 */
export const generateDynamicQR = async (studentId: string, deviceId: string = 'unknown_client'): Promise<string> => {
  try {
    const today = new Date().toISOString().slice(0, 10); // Format: "YYYY-MM-DD"
    
    // Structured data layout
    const qrPayload = JSON.stringify({
      studentId,
      deviceId,
      date: today,
      ttl: 300, // 5 min lifespan, checked by gates
      timestamp: Date.now()
    });

    const encryptedData = encryptQRData(qrPayload);
    return generateStaticQR(encryptedData);
  } catch (error: any) {
    throw new Error(`Failed to generate dynamic rotating QR code: ${error.message}`);
  }
};

/**
 * Code helper to create a verification URL QR code for gate security staff
 */
export const generateQRForVerification = async (verificationCode: string): Promise<string> => {
  // Verification URL targeting security terminal check-ins
  const protocol = process.env.SERVER_PROTOCOL || 'https';
  const domain = process.env.SERVER_DOMAIN || 'localhost:5000';
  const url = `${protocol}://${domain}/api/v1/auth/verify-gate/${verificationCode}`;
  return generateStaticQR(url);
};
