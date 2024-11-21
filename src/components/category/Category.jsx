import { useEffect, useState } from "react";
import useTinyFetch from "../../hooks/tinyFetch.hook";
import styles from "./Category.module.css";

const Categories = ({ CategorySelect }) => {
  // Bruger useTinyFetch hook til at hente kategorier og gemme dem i 'categories'
  const { data: categories, fetchData } = useTinyFetch();
  // State til at sikre, at data kun bliver hentet én gang
  const [isFetched, setIsFetched] = useState(false);

  // useEffect kører kun, når komponenten mountes og data ikke er hentet endnu
  useEffect(() => {
    if (!isFetched) {
      fetchData("/categories"); // Henter kategorier fra serveren
      setIsFetched(true); // Sikrer, at vi kun henter data én gang
    }
  }, [fetchData, isFetched]);

  return (
    <div className={styles.categories}>
      {/* Tjekker om der er kategorier at vise */}
      {categories.length > 0 ? (
        <div className={styles.categoryList}>
          {categories.map((category) => (
            <button
              key={category._id} // Unikt ID for hver kategori 
              className={styles.categoryButton}
              onClick={() => CategorySelect(category.name)} // Vælg kategori ved klik
            >
              <img
                src={category.image}
                alt={category.name}
                className={styles.categoryImage}
              />
              <span className={styles.categoryName}>{category.name}</span>
            </button>
          ))}
        </div>
      ) : (
        <p>Ingen kategorier fundet.</p>
      )}
    </div>
  );
};

export default Categories;
