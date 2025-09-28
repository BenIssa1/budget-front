"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { encryptData, decryptData } from "@/lib/crypto";
import { loginResponse, User } from "@/types/auth";

const TOKEN_NAME = process.env.NEXT_PUBLIC_NAME_TOKEN as string;
const TOKEN_USER_NAME = process.env.NEXT_PUBLIC_NAME_USER as string;

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const fetchUser = async () => {
            const token = Cookies.get(TOKEN_NAME);
            const storedUser = Cookies.get(TOKEN_USER_NAME);

            if (token && storedUser) {
                try {
                    const decrypted = await decryptData(storedUser);
                    if (decrypted) {
                        const parsedUser: User = JSON.parse(decrypted);
                        setUser(parsedUser);
                    }
                } catch (error) {
                    console.error(error);
                    logout();
                }
            }

            setLoading(false); // Important : même en cas d’absence de cookie
        };

        fetchUser();
    }, []);

    async function login(loginResponse: loginResponse) {
        const { dataUser, token } = loginResponse;
        

        let userData = {
            lastName: dataUser.lastName,
            firstName: dataUser.firstName,
            email: dataUser.email,
            role: dataUser.role,
        }

        const encryptToken = await encryptData(token);
        const encryptUser = await encryptData(JSON.stringify(userData));

        Cookies.set(TOKEN_NAME, encryptToken, {
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            expires: 1 / 3,
        });

        Cookies.set(TOKEN_USER_NAME, encryptUser, {
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            expires: 1 / 3,
        });

        setUser(userData);
    }

    async function logout() {
        Cookies.remove(TOKEN_NAME);
        Cookies.remove(TOKEN_USER_NAME);
        setUser(null);
    }


    return { user, loading, login, logout };
}