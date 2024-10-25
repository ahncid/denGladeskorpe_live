import { useEffect, useState } from "react";
import useTinyFetch from "../../hooks/tinyFetch.hook";
import styles from "./Category.module.css";

const Categories = ({ CategorySelect }) => {
  const { data: categories, fetchData } = useTinyFetch();
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    if (!isFetched) {
      fetchData("/categories");
      setIsFetched(true);
    }
  }, [fetchData, isFetched]);

  return (
    <div className={styles.categories}>
      {categories.length > 0 ? (
        <div className={styles.categoryList}>
          {categories.map((category) => (
            <button
              key={category._id}
              className={styles.categoryButton}
              onClick={() => CategorySelect(category.name)}
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
