import { Link } from "react-router-dom"; 
import { useEffect, useState } from "react";
import useTinyFetch from "../../hooks/tinyFetch.hook";
import styles from "./Dishes.module.css"; 
import { serverPath } from "../../services/settings";

const Dishes = ({ selectedCategory }) => {
  // Bruger useTinyFetch hook til at hente retter og gemme dem i 'dishes'
  const { data: dishes, fetchData } = useTinyFetch();
  // State til at gemme filtrerede retter baseret på den valgte kategori
  const [filteredDishes, setFilteredDishes] = useState([]);
  // State til at sikre, at data kun bliver hentet én gang
  const [isFetched, setIsFetched] = useState(false);

 
  useEffect(() => {
    if (!isFetched) {
      fetchData("/dishes"); // Henter retter fra serveren
      setIsFetched(true); // Sikrer, at vi kun henter data én gang
    }
  }, [fetchData, isFetched]);

  // Opdaterer de filtrerede retter, når 'dishes' eller 'selectedCategory' ændres
  useEffect(() => {
    if (selectedCategory) {
      // Filtrer retterne baseret på den valgte kategori
      const filtered = dishes.filter((dish) => dish.category === selectedCategory);
      setFilteredDishes(filtered);
    } else {
      // Hvis ingen kategori er valgt, vis alle retter
      setFilteredDishes(dishes);
    }
  }, [dishes, selectedCategory]);

  return (
    <div className={styles.dishes}>
      {/* Tjekker om der er filtrerede retter at vise */}
      {filteredDishes.length > 0 ? (
        <div className={styles.dishList}>
          {filteredDishes.map((dish) => (
            console.log("Dish image:", dish.image),
            console.log("ServerPath:", serverPath),
            <div key={dish._id} className={styles.dishItem}>
              <Link to={`/details/${dish._id}`}>
                <h3 className={styles.dishTitle}>{dish.title}</h3>
                <img src={`${serverPath}${dish.image}`} alt={dish.title} className={styles.dishImage} />
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
