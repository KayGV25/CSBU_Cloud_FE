import axios from "axios";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { API_URL } from "../env";

export const UserContext = createContext({});

export function useUserContext() {
    return useContext(UserContext);
}

export default function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const router = useRouter();

    const fetchUser = async () => {
        if (typeof window === "undefined" || !router.isReady) return; // Ensure it runs in the browser

        const storedToken = localStorage.getItem("token");
        console.log(storedToken);

        try {
            if (!storedToken && !["/login", "/register"].includes(router.pathname)) {
                router.push("/login");
                return;
            }

            if (!user && storedToken) {
                const response = await axios.post(`${API_URL}/api/v1/auth/profile`, {
                    token: storedToken,
                });

                // Assuming the response contains the user ID
                // console.log(response);
                const userId = response.data;
                // console.log(userId);
                if (!userId) throw new Error("Invalid token or user ID not found");

                const userResponse = await fetch(`${API_URL}/api/v1/users/${userId}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${storedToken}`,
                    },
                });

                if (!userResponse.ok) throw new Error("Failed to fetch user data");

                const userData = await userResponse.json();
                setUser(userData);
            }
        } catch (error) {
            console.error("Error fetching user:", error);
            if (!["/login", "/register"].includes(router.pathname)) {
                router.push("/login");
            }
        }
    };

    useEffect(() => {
        fetchUser();
    }, [router]); // Run only once on mount

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}