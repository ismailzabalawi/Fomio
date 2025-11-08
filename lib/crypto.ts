import forge from 'node-forge';

export interface RsaKeypair {
  publicKeyPem: string;
  privateKeyPem: string;
}

/**
 * Generate an RSA keypair for Discourse User API Key authentication
 * @param bits Key size in bits (default: 2048)
 * @returns Object containing PEM-formatted public and private keys
 */
export function generateRsaKeypair(bits: number = 2048): RsaKeypair {
  const keypair = forge.pki.rsa.generateKeyPair(bits);
  
  const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);
  const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey);
  
  return {
    publicKeyPem,
    privateKeyPem,
  };
}

/**
 * Decrypt a base64-encoded payload using RSA PKCS#1 v1.5
 * @param base64Payload Base64-encoded encrypted payload from Discourse
 * @param privateKeyPem PEM-formatted private key
 * @returns Decrypted UTF-8 string
 */
export function decryptPayloadBase64ToUtf8(
  base64Payload: string,
  privateKeyPem: string
): string {
  try {
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
    const encryptedBytes = forge.util.decode64(base64Payload);
    
    const decryptedBytes = privateKey.decrypt(encryptedBytes, 'RSAES-PKCS1-V1_5');
    const decryptedText = forge.util.decodeUtf8(decryptedBytes);
    
    return decryptedText;
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt payload. Invalid key or payload format.');
  }
}
