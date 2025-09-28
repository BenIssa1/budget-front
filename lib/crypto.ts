import { jwtDecode } from "jwt-decode";
// @ts-ignore - crypto-js types may not be available in all environments
import CryptoJS from "crypto-js";

// Clé de chiffrement secrète
const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY as string;

// Note: Les fonctions de dérivation de clé ne sont plus nécessaires
// car nous utilisons directement crypto-js pour le chiffrement AES

// Fonction pour chiffrer les données
export const encryptData = async (data: string): Promise<string> => {
  try {
    // Vérifier que la clé n'est pas vide
    if (!SECRET_KEY) {
      throw new Error("La clé de chiffrement est manquante");
    }

    // Chiffrer les données avec crypto-js (AES)
    const encrypted = CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
    
    // Ajouter un timestamp pour l'expiration (7 jours)
    const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000);
    
    // Créer un objet avec les données chiffrées et l'expiration
    const payload = {
      data: encrypted,
      exp: expiresAt
    };
    
    // Encoder en base64 pour faciliter le stockage
    return btoa(JSON.stringify(payload));
  } catch (error) {
    console.error("Erreur lors du chiffrement:", error);
    throw error;
  }
};

// Fonction pour déchiffrer les données
export const decryptData = async (
  encryptedData: string | null | undefined
): Promise<string | null> => {
  try {
    // Vérification des paramètres
    if (!encryptedData) {
      console.error("Données de chiffrement manquantes ou invalides");
      return null;
    }

    if (!SECRET_KEY) {
      console.error("La clé de chiffrement est manquante");
      return null;
    }

    // Décoder le base64
    const decodedPayload = JSON.parse(atob(encryptedData));
    
    // Vérifier l'expiration
    if (decodedPayload.exp && decodedPayload.exp < Date.now()) {
      console.error("Les données chiffrées ont expiré");
      return null;
    }

    // Déchiffrer avec crypto-js
    const decrypted = CryptoJS.AES.decrypt(decodedPayload.data, SECRET_KEY);
    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedString) {
      console.error("Le déchiffrement a produit un résultat invalide");
      return null;
    }

    return decryptedString;
  } catch (error) {
    console.error("Erreur lors du déchiffrement:", error);
    return null;
  }
};

// Fonction pour vérifier si un token est expiré
export const isTokenExpired = (token: string | null | undefined): boolean => {
  try {
    if (!token) return true;

    // Pour notre nouveau format, vérifier directement l'expiration
    const decodedPayload = JSON.parse(atob(token));
    return decodedPayload.exp && decodedPayload.exp < Date.now();
  } catch {
    // Si le parsing échoue, essayer avec jwtDecode pour les anciens tokens
    try {
      if (token) {
        const decoded: any = jwtDecode(token);
        return decoded.exp * 1000 < Date.now();
      }
      return true;
    } catch {
      return true;
    }
  }
};