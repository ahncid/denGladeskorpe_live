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
      fetchData("/dishes");
      setIsFetched(true);
    }
  }, [fetchData, isFetched]);

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
          {filteredDishes.map((dish) => (
            <div key={dish._id} className={styles.dishItem}>
             
              <Link to={`/details/${dish._id}`}>
                <h3 className={styles.dishTitle}>{dish.title}</h3>
                <img src={dish.image} alt={dish.title} className={styles.dishImage} />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>Ingen retter fundet.</p>
      )}
    </div>
  );
};

export default Dishes;
