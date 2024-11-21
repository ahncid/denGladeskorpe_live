import { useState, useEffect } from 'react';
import styles from './Ingredients.module.css';
import { serverPath } from '../../services/settings';

// Komponent til at vælge ekstra ingredienser
const ExtraIngredientsSelector = ({ selectedExtras, setSelectedExtras }) => {
  // State til at gemme de hentede ingredienser
  const [ingredients, setIngredients] = useState([]);
  // State til at holde styr på, om ingredienserne er ved at blive hentet
  const [isLoading, setIsLoading] = useState(true);

  // useEffect til at hente ingredienserne fra serveren, når komponenten loader
  useEffect(() => {
    const fetchIngredients = async () => {
      // Henter ingredienser fra serveren
      const response = await fetch(`${serverPath}/ingredients`); 
      if (response.ok) {
        const result = await response.json();
        // Hvis der er data i resultatet, gemmes ingredienserne i state
        if (result && result.data) {
          setIngredients(result.data);
        }
      }
      // Sætter isLoading til false, når data er hentet eller forsøget er færdigt
      setIsLoading(false);
    };

    fetchIngredients();
  }, []); // Tom array betyder, at denne useEffect kun kører, når komponenten mountes

  // Håndterer valg af ekstra ingrediens
  const handleIngredientSelect = (e) => {
    const selectedIngredient = e.target.value;
    // Tjekker om den valgte ingrediens ikke allerede er valgt og tilføjer den til selectedExtras
    if (selectedIngredient && !selectedExtras.includes(selectedIngredient)) {
      setSelectedExtras([...selectedExtras, selectedIngredient]);
    }
  };

  // Hvis data stadig indlæses, vises en besked til brugeren
  if (isLoading) return <p>Indlæser ekstra ingredienser...</p>;

  return (
    <div className={styles.selectorContainer}>
      <label htmlFor="extra-ingredients">Tilføj ekstra ingredienser:</label>
      <select
        id="extra-ingredients"
        value=""
        onChange={handleIngredientSelect} // Kald funktionen ved ændring af valg
        className={styles.selector}
        size={5} 
      >
        <option value="" disabled>
          Vælg en ingrediens
        </option>
        {/* Mapper over ingredienserne og skaber en option for hver ingrediens */}
        {ingredients.map((ingredient) => (
          <option key={ingredient._id} value={ingredient.name}>
            {ingredient.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ExtraIngredientsSelector;
