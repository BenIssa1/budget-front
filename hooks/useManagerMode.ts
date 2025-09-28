"use client";

import { useAuth } from "@/hooks/useAuth";
import { UserRole, RoleName } from "@/types/auth";

export function useManagerMode() {
  const { user } = useAuth();

  // Détermine si l'utilisateur est en mode admin
  const isManagerMode = user?.role === RoleName.ADMIN;

  // Détermine le rôle effectif
  const effectiveRole = user?.role as UserRole | undefined;

  return {
    isManagerMode,
    effectiveRole,
  };
}
