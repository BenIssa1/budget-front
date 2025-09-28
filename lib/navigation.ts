"use client";

import { useSearchParams } from "next/navigation";

export function useNavigationWithHotelId() {
  const searchParams = useSearchParams();

  const buildUrl = (path: string): string => {
    // Pour ce projet, on peut simplement retourner le path tel quel
    // ou ajouter des paramètres de requête si nécessaire
    return path;
  };

  return {
    buildUrl,
  };
}
