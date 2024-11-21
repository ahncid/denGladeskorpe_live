import { useState } from "react";
import { serverPath } from "../services/settings"; 

const useTinyFetch = () => {
  // State til at gemme de hentede data
  const [data, setData] = useState([]);

  // Funktion til at hente data fra en given URL
  const fetchData = async (url) => {
    // Laver en GET-anmodning til den angivne endpoint med serverPath
    const response = await fetch(`${serverPath}${url}`);
    // Parser JSON-svaret fra serveren
    const result = await response.json();
    // Opdaterer state med de hentede data
    setData(result.data);

    // Returnerer hele resultatet 
    return result;
  };

  // Returnerer de hentede data og fetchData-funktionen til brug i komponenter
  return {
    data,
    fetchData,
  };
};

export default useTinyFetch;
