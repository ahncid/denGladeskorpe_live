import { useLocalStorage } from "@uidotdev/usehooks";
import { createContext, useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';
import { useNavigate, useLocation } from 'react-router-dom';
import { serverPath } from "../services/settings";

// AuthContextProvider komponent, der giver autentificeringsstatus og funktioner til hele appen
export const AuthContextProvider = ({ children }) => {

    const [auth, saveAuth] = useLocalStorage("auth", {}); // Lagrer brugerens autentificeringsdata i localStorage
    const [user, setUser] = useState({}); // Lagrer oplysninger om den aktuelle bruger

    const location = useLocation(); // Brugerens aktuelle rute
    const navigate = useNavigate(); // Muliggør navigation til andre ruter

    // useEffect køres, når brugerens rute ændrer sig, for at tjekke brugerens token-validitet
    useEffect(() => {
        const checkUser = async () => {
            // Tjekker om brugeren forsøger at få adgang til en beskyttet backoffice-side uden at være logget ind
            if (location.pathname.includes('backoffice') && !location.pathname.includes('signin')) {
                if (auth.token !== undefined) {
                    // Validerer tokenet ved at sende en forespørgsel til serveren
                    let response = await fetch(`${serverPath}/auth/token`, {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${auth.token}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ token: auth.token })
                    });

                    let data = await response.json();

                    // Hvis tokenet er udløbet, logger brugeren ud og sender dem til login-siden
                    if (data.message === 'Token Expired') {
                        signOut();  
                        return navigate('/backoffice/signin');
                    } else {
                        setUser(data.user); // Sætter brugerdata, hvis tokenet er gyldigt
                    }
                } else {
                    // Hvis der ikke er et token, omdirigeres brugeren til login-siden
                    return navigate('/backoffice/signin');
                }
            }
        };

        checkUser(); // Kører checkUser-funktionen ved ruteændringer
    }, [location.pathname, auth.token, navigate]);

    // Funktion til at logge ind med email og password
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
        const user = jwtDecode(result.data.token); // Dekoder brugerens token for at få brugeroplysninger

        saveAuth({ token: result.data.token }); // Gemmer det modtagne token i localStorage
        setUser(user); // Sætter brugeroplysningerne

        return user;
    };

    // Funktion til at logge brugeren ud
    const signOut = () => {
        saveAuth({});  // Fjerner token fra localStorage
        setUser({});   // Nulstiller user state
        navigate("/backoffice/signin"); // Omdirigerer til login-siden
    };

    // Boolean værdi for at tjekke, om brugeren er logget ind
    const signedIn = auth.token !== undefined;

    // Værdier der deles med AuthContext, så de kan bruges i andre komponenter
    const value = { token: auth.token, user, signIn, signOut, signedIn };

    return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    );
};

// Opretter AuthContext, som bruges til at dele login-status og brugeroplysninger på tværs af applikationen
export const AuthContext = createContext();
