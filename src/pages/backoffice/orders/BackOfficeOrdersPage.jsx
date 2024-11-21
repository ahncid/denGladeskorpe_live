import { useState, useEffect } from 'react';
import { serverPath } from '../../../services/settings';
import styles from './BackOfficeOrdersPage.module.css';
import { Link } from 'react-router-dom';

const BackOfficeOrdersPage = () => {
  // State til at gemme ordreliste hentet fra serveren
  const [orders, setOrders] = useState([]);
  // State til at gemme information om retter, hvor hver ret kan tilgås via dens _id
  const [dishesMap, setDishesMap] = useState({});

  // useEffect kører kun én gang ved komponentens første indlæsning
  useEffect(() => {
    // Asynkron funktion til at hente ordredata fra serveren
    const fetchOrders = async () => {
      const response = await fetch(`${serverPath}/orders`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.data); // Opdaterer orders-state med de hentede ordrer
      }
    };

    // Asynkron funktion til at hente retter fra serveren
    const fetchDishes = async () => {
      const response = await fetch(`${serverPath}/dishes`);
      if (response.ok) {
        const data = await response.json();
        // Reducer retterne til et objekt, hvor _id bruges som nøgle for at lette opslag
        const dishMap = data.data.reduce((map, dish) => {
          map[dish._id] = dish;
          return map;
        }, {});
        setDishesMap(dishMap); // Opdaterer dishesMap-state
      }
    };

    fetchOrders(); // Henter ordreliste
    fetchDishes(); // Henter retter
  }, []); // Tom afhængighedsliste sikrer, at denne kun kører én gang (ved mount)

  // Funktion til at slette en ordre
  const deleteOrder = async (orderId) => {
    const response = await fetch(`${serverPath}/order/${orderId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      // Filtrerer ordrerne og fjerner den slettede ordre
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
    }
  };

  // Funktion til at markere en ordre som afsendt
  const markAsShipped = async (orderId) => {
    try {
      // Sender en PUT-anmodning til serveren for at opdatere ordrestatus til 'afsendt'
      const response = await fetch(`${serverPath}/order`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: orderId,
          shipped: true,
        }),
      });
  
      if (response.ok) {
        // Hvis opdatering lykkes, opdateres order state lokalt
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, shipped: true } : order
          )
        );
      } else {
        console.error("Kunne ikke opdatere ordrestatus");
      }
    } catch (error) {
      console.error("Netværksfejl:", error); 
    }
  };

  return (
    <div className={styles.orderContainer}>
      <h2>Backoffice Orders</h2>
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
            <Link to="/backoffice/dishes" className={styles.navLink}>Administrer Dishes</Link>
          </li>
        </ul>
      </div>
     
      {orders.length > 0 ? (
        <ul>
          {orders.map((order, index) => (
            <li key={order._id} className={styles.orderItem}>
              <h3>Ordre #{index + 1}</h3>
              <p className={styles.orderDetails}>
                <strong>Kommentar:</strong> {order.comment}
              </p>
              <p className={styles.orderDetails}>
                <strong>Dato:</strong> {new Date(order.created).toLocaleString()}
              </p>
              <p className={styles.orderDetails}>
                <strong>Total pris:</strong> {order.totalPrice},-
              </p>
              <p className={styles.orderDetails}>
                <strong>Afsendt:</strong> {order.shipped ? "Ja" : "Nej"}
              </p>

              <h4>Varer:</h4>
              <ul>
                {order.dishes.map((dishItem, itemIndex) => {
                  const dishDetails = dishesMap[dishItem.dish];
                  return (
                    <li key={itemIndex}>
                      <p>
                        <strong>{dishItem.amount} x {dishDetails ? dishDetails.title : 'Ukendt ret'}</strong>
                      </p>
                      <p>Størrelse: {dishItem.size}</p>
                      {dishItem.extraIngredients && dishItem.extraIngredients.length > 0 && (
                        <p>Ekstra: {dishItem.extraIngredients.join(', ')}</p>
                      )}
                    </li>
                  );
                })}
              </ul>
              <button onClick={() => markAsShipped(order._id)}>Send ordre</button>
              <button onClick={() => deleteOrder(order._id)} className={styles.deleteButton}>
                Slet ordre
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.noOrdersMessage}>Ingen ordrer endnu.</p>
      )}
    </div>
  );
};

export default BackOfficeOrdersPage;
