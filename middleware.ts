import { NextRequest, NextResponse } from "next/server";
import { decryptData, isTokenExpired } from "@/lib/crypto";

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

    const isPublic = ROUTES.public.some((route) => path === `/${route.replace(/^\/?/, "")}`);
    const isProtected = ROUTES.protected.some((route) => path.startsWith(route));

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

    // 🔐 Cas 2 : route protégée
    if (isProtected) {
        if (!token) {
            return createRedirect("/", req); // Non connecté → retour à /
        }

        try {
            const decryptedToken = await decryptData(token);
            if (!decryptedToken || isTokenExpired(decryptedToken)) {
                return createRedirect("/", req, true); // Token invalide ou expiré → clear
            }
        } catch {
            return createRedirect("/", req, true); // Erreur déchiffrement → clear
        }

        return NextResponse.next(); // Token OK → accès autorisé
    }

    // Toutes les autres routes passent
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|images|fonts|api).*)",
    ],
};
