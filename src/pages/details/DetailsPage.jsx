import { useParams } from "react-router-dom";
import { useState } from "react";
import DishInfo from "../../components/dishes/DishInfo";
import DynamicHeader from "../../components/common/Header/Header";
import ExtraIngredientsSelector from "../../components/ingredients/Ingredients";
import styles from "./DetailsPage.module.css";
import useBasket from "../../components/Basket/Basket";
import SubHeaderHeadline from "../../components/common/Subheader/SubHeaderHeadline";

const DetailsPage = () => {
  const { id } = useParams(); // Henter 'id' fra URL'en ved hjælp af useParams til at identificere den specifikke ret
  const { addToBasket } = useBasket(); // Henter addToBasket-funktionen fra useBasket hook til at tilføje retter til kurven
  const [selectedExtras, setSelectedExtras] = useState([]); // State til at holde styr på valgte ekstra ingredienser

  // Funktion til at fjerne en ekstra ingrediens fra 'selectedExtras'
  const handleRemoveExtra = (ingredientToRemove) => {
    setSelectedExtras((prev) => prev.filter((extra) => extra !== ingredientToRemove));
  };

  // Funktion til at tilføje en ret til kurven med den valgte størrelse og ekstra ingredienser
  const handleAddToBasket = (dish, selectedSize) => {
    addToBasket(dish, selectedSize, selectedExtras); 
  };

  return (
    <DishInfo
      // Render-funktion til at vise information om den valgte ret, inklusiv størrelse og pris
      render={({ dish, selectedSize, handleSizeChange, price, availableSizes }) => {
        // Kombinerer ingredienser fra retten med de valgte ekstra ingredienser
        const combinedIngredients = [
          ...(Array.isArray(dish.ingredients) ? dish.ingredients : []),
          ...selectedExtras,
        ];
        return (
          <div>
            <DynamicHeader backgroundImage="/headerImg.png" dynamicWord={dish.title} />
            <div className={styles.detailContainer}>
              
              <img src={dish.image} alt={dish.title} className={styles.dishImage} />

              <div className={styles.dishInfo}>
                <h2>{dish.title}</h2>
                {combinedIngredients.length > 0 && (
                  <div className={styles.ingredientsContainer}> 
                    <ul className={styles.ingredientsList}>
                      {combinedIngredients.map((ingredient, index) => (
                        <li key={index} className={styles.ingredientItem}>{ingredient}</li> // Viser ingredienserne for retten
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className={styles.sizeSelector}>
                <SubHeaderHeadline title="Vælg Størrelse" />
                <select id="size" value={selectedSize} onChange={handleSizeChange}>
                  {availableSizes.map((sizeKey) => (
                    <option key={sizeKey} value={sizeKey}>
                      {sizeKey === "normal" ? "Almindelig" : sizeKey === "family" ? "Familie" : sizeKey} 
                    </option>
                  ))}
                </select>
              </div>
              
              <ExtraIngredientsSelector
                selectedExtras={selectedExtras}
                setSelectedExtras={setSelectedExtras} // Komponent til at vælge ekstra ingredienser
              />
              {selectedExtras.length > 0 && (
                <div className={styles.selectedExtras}>
                  <p>Valgte ekstra ingredienser:</p>
                  <ul>
                    {selectedExtras.map((extra, index) => (
                      <li key={index}>
                        {extra}{" "}
                        <button
                          onClick={() => handleRemoveExtra(extra)} // Fjern ekstra ingrediens ved klik
                          className={styles.removeButton}
                        >
                          Fjern
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className={styles.priceContainer}> 
                <p>Pris</p>
                <p>{price},-</p> {/* Viser prisen for retten */}
              </div>
              <button
                className={styles.addToCartButton}
                onClick={() => handleAddToBasket(dish, selectedSize)} // Tilføjer retten til kurven ved klik
              >
                Tilføj {dish.title} til kurven
              </button>
            </div>
          </div>
        );
      }}
    />
  );
};

export default DetailsPage;
