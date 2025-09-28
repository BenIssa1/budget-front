import { NextRequest, NextResponse } from "next/server";
import { decryptData, isTokenExpired } from "@/lib/crypto";
import { Role, User } from "./types/auth";

const ROUTES = {
    public: ["/", "forgot-password", "otp", "new-password"], // page d'accueil seulement
    protected: [
        "/dashboard",
        "/budget",
        "/extension",
        "/service",
        "/pricing",
        "/user",
        "/config",
    ],
} as const;

const TOKEN_NAME = process.env.NEXT_PUBLIC_NAME_TOKEN as string;
const TOKEN_USER_NAME = process.env.NEXT_PUBLIC_NAME_USER as string;

// Permissions par route - Structure moderne et lisible
const ROUTE_PERMISSIONS: Record<string, string[]> = {
    // Routes admin exclusif
    "/config": ["Admin"],
    "/user": ["Admin"],
};

// Fonction utilitaire pour vérifier l'accès
const hasAccess = (path: string, role: Role | undefined ): boolean => {
    // Trouver la route correspondante
    const restrictedRoute = Object.entries(ROUTE_PERMISSIONS).find(([route]) =>
        path.startsWith(route)
    );

    // Si pas de restriction trouvée, accès autorisé
    if (!restrictedRoute) return true;

    // Vérifier si le rôle est dans la liste autorisée
    const [, allowedRoles] = restrictedRoute;
    return allowedRoles.some((r) => r === role);
};

const createRedirect = (
    url: string,
    req: NextRequest,
    clearCookies = false
) => {
    if (req.nextUrl.pathname === url) {
        return NextResponse.next();
    }

    const response = NextResponse.redirect(new URL(url, req.url));
    if (clearCookies) {
        response.cookies.delete(TOKEN_NAME);
        response.cookies.delete(TOKEN_USER_NAME);
    }
    return response;
};

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const token = req.cookies.get(TOKEN_NAME)?.value;
    const tokenUser = req.cookies.get(TOKEN_USER_NAME)?.value;
    const decryptedToken = await decryptData(token);
    const decryptedTokenUser = await decryptData(tokenUser);

    const isPublic = ROUTES.public.some((route) => path === `/${route.replace(/^\/?/, "")}`);
    const isProtectedRoute = ROUTES.protected.some((route) => path === route || path.startsWith(`${route}/`));

    // 🔒 Cas 1 : route publique ("/")
    if (isPublic) {
        if (token) {
            try {
                const decryptedToken = await decryptData(token);
                if (decryptedToken && !isTokenExpired(decryptedToken)) {
                    return createRedirect("/dashboard", req); // Rediriger vers dashboard si déjà connecté
                }
            } catch {
                return createRedirect("/", req, true); // Token invalide → supprimer cookies
            }
        }
        return NextResponse.next(); // Non connecté → OK pour accéder à /
    }

    if (isProtectedRoute) {
        // Pas de token = redirection login
        if (!token) {
            const loginUrl = new URL("/", req.url);
            loginUrl.searchParams.set("redirect", encodeURI(req.url));
            return createRedirect("/", req, true);
        }

        try {
            const { role }: User = JSON.parse(decryptedTokenUser as string);
            if (!decryptedToken || isTokenExpired(decryptedToken)) {
                return createRedirect("/", req, true);
            }

            // Vérifier les permissions par rôle
            if (!hasAccess(path, role)) {
                return createRedirect("/unauthorized", req);
            }

            return NextResponse.next();
        } catch (error) {
            console.error("Erreur middleware:", error);
            return createRedirect("/", req, true);
        }
    }

    // Toutes les autres routes passent
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|images|fonts|api).*)",
    ],
};
