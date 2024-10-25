import { useState, useEffect } from 'react';
import { serverPath } from '../../../services/settings';
import styles from './BackOfficeOrdersPage.module.css';
import { Link } from 'react-router-dom';

const BackOfficeOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [dishesMap, setDishesMap] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch(`${serverPath}/orders`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.data);
      }
    };

    const fetchDishes = async () => {
      const response = await fetch(`${serverPath}/dishes`);
      if (response.ok) {
        const data = await response.json();
        const dishMap = data.data.reduce((map, dish) => {
          map[dish._id] = dish;
          return map;
        }, {});
        setDishesMap(dishMap);
      }
    };

    fetchOrders();
    fetchDishes();
  }, []);

  const deleteOrder = async (orderId) => {
    const response = await fetch(`${serverPath}/order/${orderId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
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
