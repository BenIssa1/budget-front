import { jwtDecode } from "jwt-decode";
import { EncryptJWT, jwtDecrypt } from "jose";

// Clé de chiffrement secrète
const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY as string;

// Fonction pour dériver une clé de 256 bits à partir de la clé secrète
// Compatible avec Edge Runtime
const deriveKey = async (key: string): Promise<Uint8Array> => {
  // Encoder la clé secrète en UTF-8
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);

  // Utiliser SubtleCrypto pour créer une clé de 256 bits
  const hashBuffer = await crypto.subtle.digest("SHA-256", keyData);

  // Convertir le buffer en Uint8Array
  return new Uint8Array(hashBuffer);
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