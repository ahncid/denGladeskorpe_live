import { useLocalStorage } from "@uidotdev/usehooks";
import { createContext, useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';
import { useNavigate, useLocation } from 'react-router-dom';
import { serverPath } from "../services/settings";

export const AuthContextProvider = ({ children }) => {

    const [auth, saveAuth] = useLocalStorage("auth", {});
    const [user, setUser] = useState({});

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            if (location.pathname.includes('backoffice') && !location.pathname.includes('signin')) {
                if (auth.token !== undefined) {
                    let response = await fetch(`${serverPath}/auth/token`, {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${auth.token}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ token: auth.token })
                    });

                    let data = await response.json();

                    if (data.message === 'Token Expired') {
                        signOut();  
                        return navigate('/backoffice/signin');
                    } else {
                        setUser(data.user);
                    }
                } else {
                    return navigate('/backoffice/signin');
                }
            }
        };

        checkUser();
    }, [location.pathname, auth.token, navigate]);

    const signIn = async (email, password) => {
        let response = await fetch(`${serverPath}/auth/signin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });

        let result = await response.json();
        const user = jwtDecode(result.data.token);

        saveAuth({ token: result.data.token });
        setUser(user);

        return user;
    };

    const signOut = () => {
        saveAuth({});  // Fjerner token fra localStorage
        setUser({});   // Nulstiller user state
        navigate("/backoffice/signin"); // Omdirigerer til login-siden
    };

    const signedIn = auth.token !== undefined;

    const value = { token: auth.token, user, signIn, signOut, signedIn };

    return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    );
};

export const AuthContext = createContext();
