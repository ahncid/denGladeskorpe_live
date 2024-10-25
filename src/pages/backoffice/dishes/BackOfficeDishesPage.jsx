import { useState, useEffect } from 'react';
import { serverPath } from '../../../services/settings';
import styles from './BackOfficeDishesPage.module.css';
import { Link } from 'react-router-dom';

const BackOfficeDishesPage = () => {
  const [dishes, setDishes] = useState([]);
  const [editingDishId, setEditingDishId] = useState(null); 
  const [formValues, setFormValues] = useState({
    title: "",
    priceNormal: "",
    priceFamily: "",
    ingredients: "",
    category: "",
    file: null
  });

  useEffect(() => {
    fetchDishes();
  }, []);

  const fetchDishes = async () => {
    try {
      const response = await fetch(`${serverPath}/dishes`);
      if (response.ok) {
        const data = await response.json();
        setDishes(data.data);
      } else {
        console.error('Fejl ved hentning af retter:', response.statusText);
      }
    } catch (error) {
      console.error('Netværksfejl:', error);
    }
  };

  const handleDelete = async (dishId) => {
    try {
      const response = await fetch(`${serverPath}/dish/${dishId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDishes(dishes.filter((dish) => dish._id !== dishId));
      } else {
        console.error('Fejl ved sletning af ret:', response.statusText);
      }
    } catch (error) {
      console.error('Netværksfejl:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', formValues.title);


    formData.append('price', JSON.stringify({
      normal: formValues.priceNormal,
      family: formValues.priceFamily || undefined, 
    }));

    formData.append('ingredients', formValues.ingredients);
    formData.append('category', formValues.category);
    if (formValues.file) {
      formData.append('file', formValues.file);
    }

    let response;
    if (editingDishId) {

      formData.append('id', editingDishId);
      response = await fetch(`${serverPath}/dish`, {
        method: 'PUT',
        body: formData,
      });
    } else {
   
      response = await fetch(`${serverPath}/dish`, {
        method: 'POST',
        body: formData,
      });
    }

    if (response.ok) {
      console.log("Ret oprettet/opdateret succesfuldt");
      setFormValues({ title: "", priceNormal: "", priceFamily: "", ingredients: "", category: "", file: null });
      setEditingDishId(null);
      fetchDishes();
    } else {
      console.error('Fejl ved opdatering/oprettelse af ret:', await response.text());
    }
  };

  const handleEdit = (dish) => {
    setFormValues({
      title: dish.title,
      priceNormal: dish.price.normal,
      priceFamily: dish.price.family || "",
      ingredients: dish.ingredients.join(", "),
      category: dish.category,
      file: null
    });
    setEditingDishId(dish._id); 
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setFormValues({
        ...formValues,
        file: files[0],
      });
    } else {
      setFormValues({
        ...formValues,
        [name]: value,
      });
    }
  };

  return (
    <div className={styles.container}>
      <h2>Backoffice Retter</h2>
      <div>
        <Link to="/" className={styles.backLink}>← Back to Frontend</Link>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link to="/backoffice/employees" className={styles.navLink}>Administrer Employees</Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/backoffice/messages" className={styles.navLink}>Administrer Messages</Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/backoffice/orders" className={styles.navLink}>Administrer Orders</Link>
          </li>
        </ul>
      </div>
     
      <h2>Opret ny Ret</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="title"
          placeholder="Titel"
          value={formValues.title}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="priceNormal"
          placeholder="Normal Pris"
          value={formValues.priceNormal}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="priceFamily"
          placeholder="Familie Pris"
          value={formValues.priceFamily}
          onChange={handleChange}
        />
        <input
          type="text"
          name="ingredients"
          placeholder="Ingredienser (komma adskilt)"
          value={formValues.ingredients}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Kategori"
          value={formValues.category}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          name="file"
          onChange={handleChange}
        />
        <button type="submit">
          Opret Ret
        </button>
      </form>

     
      <h2>Eksisterende Retter</h2>
      <ul>
        {Array.isArray(dishes) && dishes.length > 0 ? (
          dishes.map((dish) => (
            <li key={dish._id} className={styles.dishItem}>
              <h3>{dish.title}</h3>
              <p>Pris: Normal {dish.price.normal},- {dish.price.family && `| Familie ${dish.price.family},-`}</p>
              <p>Kategori: {dish.category}</p>
              <p>Ingredienser: {dish.ingredients.join(", ")}</p>
              <img src={dish.image} alt={dish.title} className={styles.dishImage} />
            <div className={styles.buttonContainer}>  <button onClick={() => handleEdit(dish)}>Rediger</button>
              <button onClick={() => handleDelete(dish._id)}>Slet</button></div>

              {/* Formular til opdatering af den specifikke ret */}
              {editingDishId === dish._id && (
                <form onSubmit={handleSubmit} className={styles.updateForm}>
                  <input
                    type="text"
                    name="title"
                    placeholder="Titel"
                    value={formValues.title}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="number"
                    name="priceNormal"
                    placeholder="Normal Pris"
                    value={formValues.priceNormal}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="number"
                    name="priceFamily"
                    placeholder="Familie Pris"
                    value={formValues.priceFamily}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="ingredients"
                    placeholder="Ingredienser (komma adskilt)"
                    value={formValues.ingredients}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="text"
                    name="category"
                    placeholder="Kategori"
                    value={formValues.category}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="file"
                    name="file"
                    onChange={handleChange}
                  />
                  <button type="submit">
                    Opdater Ret
                  </button>
                </form>
              )}
            </li>
          ))
        ) : (
          <p>Ingen retter fundet.</p>
        )}
      </ul>
    </div>
  );
};

export default BackOfficeDishesPage;
