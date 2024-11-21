// Dishes.jsx
import { Link } from "react-router-dom"; 
import { useEffect, useState } from "react";
import useTinyFetch from "../../hooks/tinyFetch.hook";
import styles from "./Dishes.module.css"; 

const Dishes = ({ selectedCategory }) => {
  const { data: dishes, fetchData } = useTinyFetch();
  const [filteredDishes, setFilteredDishes] = useState([]);
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    if (!isFetched) {
      fetchData("/dishes").then(() => {
        console.log("Dishes fetched:", dishes);
      });
      setIsFetched(true);
    }
  }, [fetchData, isFetched, dishes]);

  useEffect(() => {
    if (selectedCategory) {
      const filtered = dishes.filter((dish) => dish.category === selectedCategory);
      setFilteredDishes(filtered);
    } else {
      setFilteredDishes(dishes);
    }
  }, [dishes, selectedCategory]);

  return (
    <div className={styles.dishes}>
      {filteredDishes.length > 0 ? (
        <div className={styles.dishList}>
          {filteredDishes.map((dish) => {
            console.log("Dish image:", dish.image);
            console.log("Base URL:", import.meta.env.BASE_URL);

        
            const imagePath = dish.image.replace(/^\/+/, '');

            return (
              <div key={dish._id} className={styles.dishItem}>
                <Link to={`/details/${dish._id}`}>
                  <h3 className={styles.dishTitle}>{dish.title}</h3>
                  <img
                    src={`${import.meta.env.BASE_URL}${imagePath}`}
                    alt={dish.title}
                    className={styles.dishImage}
                  />
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <p>Ingen retter fundet.</p>
      )}
    </div>
  );
};

export default Dishes;
