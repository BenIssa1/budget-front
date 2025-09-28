import { jwtDecode } from "jwt-decode";
import { EncryptJWT, jwtDecrypt } from "jose";
// @ts-ignore - crypto-js types may not be available in all environments
import CryptoJS from "crypto-js";

// Clé de chiffrement secrète
const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY as string;

// Fonction pour vérifier si crypto.subtle est disponible
const isCryptoSubtleAvailable = (): boolean => {
  return typeof window !== 'undefined' && 
         typeof crypto !== 'undefined' && 
         crypto.subtle !== undefined;
};

// Fonction alternative pour dériver une clé sans crypto.subtle
const deriveKeyFallback = (key: string): Uint8Array => {
  // Utiliser crypto-js pour créer un hash SHA-256
  const hash = CryptoJS.SHA256(key);
  
  // Convertir le hash en Uint8Array
  const words = hash.words;
  const result = new Uint8Array(32);
  
  for (let i = 0; i < 8; i++) {
    const word = words[i] || 0;
    result[i * 4] = (word >>> 24) & 0xff;
    result[i * 4 + 1] = (word >>> 16) & 0xff;
    result[i * 4 + 2] = (word >>> 8) & 0xff;
    result[i * 4 + 3] = word & 0xff;
  }
  
  return result;
};

// Fonction pour dériver une clé de 256 bits à partir de la clé secrète
// Compatible avec Edge Runtime et environnements sans crypto.subtle
const deriveKey = async (key: string): Promise<Uint8Array> => {
  // Vérifier si crypto.subtle est disponible
  if (isCryptoSubtleAvailable()) {
    try {
      // Encoder la clé secrète en UTF-8
      const encoder = new TextEncoder();
      const keyData = encoder.encode(key);

      // Utiliser SubtleCrypto pour créer une clé de 256 bits
      const hashBuffer = await crypto.subtle.digest("SHA-256", keyData);

      // Convertir le buffer en Uint8Array
      return new Uint8Array(hashBuffer);
    } catch (error) {
      console.warn("crypto.subtle.digest failed, using fallback:", error);
      return deriveKeyFallback(key);
    }
  } else {
    console.warn("crypto.subtle not available, using fallback method");
    return deriveKeyFallback(key);
  }
};

// Fonction pour chiffrer les données
export const encryptData = async (data: string): Promise<string> => {
  try {
    // Vérifier que la clé n'est pas vide
    if (!SECRET_KEY) {
      throw new Error("La clé de chiffrement est manquante");
    }

    // Dériver une clé de 256 bits (32 octets)
    const secretKey = await deriveKey(SECRET_KEY);

    // Chiffrer les données avec EncryptJWT
    const jwt = await new EncryptJWT({ data })
      .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
      .setIssuedAt()
      .setExpirationTime("7d") // Définit une expiration du token (optionnel)
      .encrypt(secretKey);
    return jwt;
  } catch (error) {
    console.error("Erreur lors du chiffrement:", error);
    throw error;
  }
};

// Fonction pour déchiffrer les données
export const decryptData = async (
  encryptedJwt: string | null | undefined
): Promise<string | null> => {
  try {
    // Vérification des paramètres
    if (!encryptedJwt) {
      console.error("Token de chiffrement manquant ou invalide");
      return null;
    }


    if (!SECRET_KEY) {
      console.error("La clé de chiffrement est manquante");
      return null;
    }

    // Dériver une clé de 256 bits (32 octets)
    const secretKey = await deriveKey(SECRET_KEY);

    // Déchiffrer le JWT
    const { payload } = await jwtDecrypt(encryptedJwt, secretKey);


    if (!payload.data) {
      console.error("Le déchiffrement a produit un résultat invalide");
      return null;
    }

    return payload.data as string;
  } catch (error) {
    console.error("Erreur lors du déchiffrement:", error);
    return null;
  }
};

// Fonction pour vérifier si un token est expiré
export const isTokenExpired = (token: string | null | undefined): boolean => {
  try {
    if (!token) return true;

    const decoded: any = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};