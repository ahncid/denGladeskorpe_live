import { useState, useEffect } from 'react';
import useBasket from '../../components/Basket/Basket';
import styles from './BasketPage.module.css';
import DynamicHeader from '../../components/common/Header/Header';
import SubHeaderHeadline from '../../components/common/Subheader/SubHeaderHeadline';
import Overlay from '../../components/overlay/Overlay';
import { serverPath } from '../../services/settings';

const BasketPage = () => {
  const { basket, removeFromBasket, clearBasket } = useBasket(); 
  const [totalPrice, setTotalPrice] = useState(0);
  const [comment, setComment] = useState('');
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [customerName, setCustomerName] = useState('');

  useEffect(() => {
    const total = basket.reduce((acc, item) => {
      const itemPrice = item.price || 0;
      const itemQuantity = item.quantity || 0;
      return acc + itemPrice * itemQuantity;
    }, 0);
    setTotalPrice(total);
  }, [basket]);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleNameChange = (e) => {
    setCustomerName(e.target.value);
  };

  const handleSubmitOrder = async () => {
    const orderData = {
      dishes: basket.map(item => ({
        dish: item.id,
        amount: item.quantity,
        size: item.size,
        extraIngredients: item.extras || [],
      })),
      comment: comment,
      totalPrice: totalPrice,
    };

    const response = await fetch(`${serverPath}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (response.ok) {
      setIsOverlayVisible(true);
      setComment('');
      clearBasket(); 
    }
  };

  const closeOverlay = () => {
    setIsOverlayVisible(false);
  };

  return (
    <div className={styles.basketPage}>
      <DynamicHeader backgroundImage="/headerImg.png" dynamicWord="skorpe" />
      <SubHeaderHeadline title="Bestilling" />
      {basket.length === 0 ? (
        <p>Kurven er tom.</p>
      ) : (
        <div className={styles.basketItems}>
          {basket.map((item, index) => (
            <div key={index} className={styles.basketItem}>
              <div className={styles.basketItemHeader}>
                <div className={styles.pizzaDetails}>
                  <h2 className={styles.pizzaTitle}>
                    {item.quantity}x
                    <img src={item.image} alt={item.title} className={styles.pizzaImage} />
                    {item.title}
                  </h2>
                </div>
              </div>

              {item.extras && item.extras.length > 0 && (
                <h5 className={styles.pizzaExtras}>
                  <span className={styles.underlined}>Ekstra:</span> <span>{item.extras.join(", ")}</span>
                </h5>
              )}

              <h5 className={styles.pizzaSize}>
                <span className={styles.underlined}>Størrelse:</span> <span>{item.size}</span>
              </h5>

              <h5 className={styles.pizzaPrice}>
                <span className={styles.underlined}>Pris:</span> <span>{item.price * item.quantity},-</span>
              </h5>

              <button
                className={styles.deleteButton}
                onClick={() => removeFromBasket(item.id, item.size, item.extras)}
              >
                Slet
              </button>
            </div>
          ))}
        </div>
      )}

      {basket.length > 0 && (
        <div className={styles.orderContainer}>
          <div className={styles.totalPrice}>
            <h3>I alt: {totalPrice},-</h3>
          </div>

          <input
            type="text"
            placeholder="Dit navn"
            value={customerName}
            onChange={handleNameChange}
            className={styles.customerNameInput}
          />

          <textarea
            className={styles.commentBox}
            placeholder="Kommentarer til ordren"
            value={comment}
            onChange={handleCommentChange}
          />

          <button className={styles.submitOrderButton} onClick={handleSubmitOrder}>
            Afgiv ordre
          </button>
        </div>
      )}

      <Overlay
        isVisible={isOverlayVisible}
        name={customerName}
        onClose={closeOverlay}
        headerText={`Tak for din bestilling, ${customerName}!`}
        messageText=""
      />
    </div>
  );
};

export default BasketPage;
