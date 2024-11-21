import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";


const DishInfo = ({ render }) => {
  const { id } = useParams(); // Henter ret-id fra URL
  const [dish, setDish] = useState(null); // State til at gemme retten
  const [selectedSize, setSelectedSize] = useState(""); // Gemmer valgt størrelse
  const [price, setPrice] = useState(0); // Gemmer prisen baseret på størrelse
  const [availableSizes, setAvailableSizes] = useState([]); // Liste over tilgængelige størrelser
  const [loading, setLoading] = useState(true); // Status for indlæsning
  const [error, setError] = useState(null); // Gemmer fejlmeddelelser

  // Funktion til at opdatere prisen baseret på valgt størrelse
  const updatePriceBySize = (size) => {
    const selectedPrice = dish?.price[size];
    // Hvis prisen findes for den valgte størrelse, bruges den; ellers bruges standardprisen
    setPrice(selectedPrice !== undefined ? selectedPrice : dish.price[Object.keys(dish.price)[0]]);
  };

  // Henter ret-detaljer 
  useEffect(() => {
    const fetchDishDetails = async () => {
      setLoading(true); 
      try {
        const response = await fetch(`http://localhost:3042/dish/${id}`);
        if (!response.ok) throw new Error(`${response.status}`); // Håndterer fejl hvis serveren svarer med en statuskode som ikke er ok
        
        const result = await response.json();
        if (result?.data) { // Tjekker om data eksisterer i svaret
          const dishData = result.data;
          setDish(dishData); // Gemmer retten i state

          const sizes = Object.keys(dishData.price); // Finder tilgængelige størrelser
          setAvailableSizes(sizes);
          const defaultSize = sizes[0]; // Vælger standardstørrelse
          setSelectedSize(defaultSize);
          setPrice(dishData.price[defaultSize]); // Sætter prisen for standardstørrelsen
        } else {
          setError("Data ikke fundet"); // Sætter fejlmeddelelse hvis data mangler
        }
      } catch (err) {
        setError(err.message || "Fejl ved indlæsning af ret"); // Håndterer fejl under indlæsning
      } finally {
        setLoading(false); // Stopper indlæsning
      }
    };

    fetchDishDetails(); // Kalder datahentningsfunktionen
  }, [id]);

  // Opdaterer prisen, når en ny størrelse vælges
  useEffect(() => {
    if (selectedSize && dish) updatePriceBySize(selectedSize); // Kald opdatering af prisen baseret på størrelse
  }, [selectedSize, dish]);

  // Håndterer ændring af valgt størrelse
  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value);
  };

  // Viser besked under indlæsning, fejl, eller hvis retten ikke findes
  if (loading) return <p>Indlæser ret...</p>;
  if (error) return <p>Der opstod en fejl: {error}</p>;
  if (!dish) return <p>Ret ikke fundet.</p>;

  // Returnerer resultatet af `render`-funktionen, som modtager data om retten
  return render({
    dish,
    selectedSize,
    handleSizeChange,
    price,
    availableSizes,
  });
};

export default DishInfo;
