import { useState, useEffect } from 'react';
import styles from './Ingredients.module.css';
import { serverPath } from '../../services/settings';

const ExtraIngredientsSelector = ({ selectedExtras, setSelectedExtras }) => {
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIngredients = async () => {
      const response = await fetch(`${serverPath}/ingredients`); 
      if (response.ok) {
        const result = await response.json();
        if (result && result.data) {
          setIngredients(result.data);
        }
      }
      setIsLoading(false);
    };

    fetchIngredients();
  }, []);

  const handleIngredientSelect = (e) => {
    const selectedIngredient = e.target.value;
    if (selectedIngredient && !selectedExtras.includes(selectedIngredient)) {
      setSelectedExtras([...selectedExtras, selectedIngredient]);
    }
  };

  if (isLoading) return <p>Indlæser ekstra ingredienser...</p>;

  return (
    <div className={styles.selectorContainer}>
      <label htmlFor="extra-ingredients">Tilføj ekstra ingredienser:</label>
      <select
        id="extra-ingredients"
        value=""
        onChange={handleIngredientSelect}
        className={styles.selector}
        size={5}
      >
        <option value="" disabled>
          Vælg en ingrediens
        </option>
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
