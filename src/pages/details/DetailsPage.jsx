import { useParams } from "react-router-dom";
import { useState } from "react";
import DishInfo from "../../components/dishes/DishInfo";
import DynamicHeader from "../../components/common/Header/Header";
import ExtraIngredientsSelector from "../../components/ingredients/Ingredients";
import styles from "./DetailsPage.module.css";
import useBasket from "../../components/Basket/Basket";
import SubHeaderHeadline from "../../components/common/Subheader/SubHeaderHeadline";

const DetailsPage = () => {
  const { id } = useParams(); 
  const { addToBasket } = useBasket();
  const [selectedExtras, setSelectedExtras] = useState([]);


  const handleRemoveExtra = (ingredientToRemove) => {
    setSelectedExtras((prev) => prev.filter((extra) => extra !== ingredientToRemove));
  };

 
  const handleAddToBasket = (dish, selectedSize) => {
    addToBasket(dish, selectedSize, selectedExtras); 
  };
  

  return (
    <DishInfo
      render={({ dish, selectedSize, handleSizeChange, price, availableSizes }) => {
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
                        <li key={index} className={styles.ingredientItem}>{ingredient}</li>
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
                setSelectedExtras={setSelectedExtras}
              />
              {selectedExtras.length > 0 && (
                <div className={styles.selectedExtras}>
                  <p>Valgte ekstra ingredienser:</p>
                  <ul>
                    {selectedExtras.map((extra, index) => (
                      <li key={index}>
                        {extra}{" "}
                        <button
                          onClick={() => handleRemoveExtra(extra)}
                          className={styles.removeButton}
                        >
                          Fjern
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
             <div className={styles.priceContainer}> <p>Pris</p><p>{price},-</p></div>
              <button
                className={styles.addToCartButton}
                onClick={() => handleAddToBasket(dish, selectedSize)}
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
