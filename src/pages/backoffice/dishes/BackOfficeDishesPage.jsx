import { useState, useEffect } from 'react';
import { serverPath } from '../../../services/settings';
import styles from './BackOfficeDishesPage.module.css';
import { Link } from 'react-router-dom';

const BackOfficeDishesPage = () => {
  // State til at gemme retter
  const [dishes, setDishes] = useState([]);
  // State til at holde ID på den ret, der redigeres
  const [editingDishId, setEditingDishId] = useState(null); 
  // State til at holde inputværdier for formularen (både til oprettelse og redigering)
  const [formValues, setFormValues] = useState({
    title: "",
    priceNormal: "",
    priceFamily: "",
    ingredients: "",
    category: "",
    file: null
  });

  // Henter retter, når komponenten indlæses
  useEffect(() => {
    fetchDishes();
  }, []);

  // Funktion til at hente retter fra serveren
  const fetchDishes = async () => {
    try {
      const response = await fetch(`${serverPath}/dishes`);
      if (response.ok) {
        const data = await response.json();
        setDishes(data.data); // Opdaterer state med hentede retter
      } else {
        console.error('Fejl ved hentning af retter:', response.statusText);
      }
    } catch (error) {
      console.error('Netværksfejl:', error);
    }
  };

  // Funktion til at slette en ret
  const handleDelete = async (dishId) => {
    try {
      const response = await fetch(`${serverPath}/dish/${dishId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDishes(dishes.filter((dish) => dish._id !== dishId)); // Fjerner slettet ret fra listen
      } else {
        console.error('Fejl ved sletning af ret:', response.statusText);
      }
    } catch (error) {
      console.error('Netværksfejl:', error);
    }
  };

  // Funktion til at oprette eller opdatere en ret
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Opretter formData til at sende via API-kaldet
    const formData = new FormData();
    formData.append('title', formValues.title);

    // Tilføjer priser til formData som JSON-struktur
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
      // Hvis der redigeres en eksisterende ret, sendes en PUT-anmodning
      formData.append('id', editingDishId);
      response = await fetch(`${serverPath}/dish`, {
        method: 'PUT',
        body: formData,
      });
    } else {
      // Hvis der oprettes en ny ret, sendes en POST-anmodning
      response = await fetch(`${serverPath}/dish`, {
        method: 'POST',
        body: formData,
      });
    }

    if (response.ok) {
      console.log("Ret oprettet/opdateret succesfuldt");
      // Nulstiller formularens værdier efter oprettelse/opdatering
      setFormValues({ title: "", priceNormal: "", priceFamily: "", ingredients: "", category: "", file: null });
      setEditingDishId(null); // Afslutter redigeringstilstand
      fetchDishes(); // Henter opdateret liste af retter
    } else {
      console.error('Fejl ved opdatering/oprettelse af ret:', await response.text());
    }
  };

  // Sætter state til redigering af en specifik ret
  const handleEdit = (dish) => {
    setFormValues({
      title: dish.title,
      priceNormal: dish.price.normal,
      priceFamily: dish.price.family || "",
      ingredients: dish.ingredients.join(", "), // Konverterer array til komma-separeret streng
      category: dish.category,
      file: null
    });
    setEditingDishId(dish._id); // Gemmer ID for den ret, der redigeres
  };

  // Opdaterer formValues baseret på ændringer i inputfelterne
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setFormValues({
        ...formValues,
        file: files[0], // Gemmer det valgte filobjekt
      });
    } else {
      setFormValues({
        ...formValues,
        [name]: value, // Opdaterer værdien af det specifikke inputfelt
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
              <div className={styles.buttonContainer}>
                <button onClick={() => handleEdit(dish)}>Rediger</button>
                <button onClick={() => handleDelete(dish._id)}>Slet</button>
              </div>

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
