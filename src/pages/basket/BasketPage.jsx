import { useState, useEffect } from 'react';
import useBasket from '../../components/Basket/Basket';
import styles from './BasketPage.module.css';
import DynamicHeader from '../../components/common/Header/Header';
import SubHeaderHeadline from '../../components/common/Subheader/SubHeaderHeadline';
import Overlay from '../../components/overlay/Overlay';
import { serverPath } from '../../services/settings';

const BasketPage = () => {
  const { basket, removeFromBasket, clearBasket } = useBasket(); // Henter kurv, samt funktioner til at fjerne varer fra kurven og tømme kurven
  const [totalPrice, setTotalPrice] = useState(0); // Holder den samlede pris for varer i kurven
  const [comment, setComment] = useState(''); // Holder eventuelle kommentarer til ordren
  const [isOverlayVisible, setIsOverlayVisible] = useState(false); // Styrer visningen af overlayet, som vises efter en ordre er afgivet
  const [customerName, setCustomerName] = useState(''); // Holder kundens navn for ordren

  // Beregner totalprisen for kurven hver gang indholdet af kurven ændres
  useEffect(() => {
    const total = basket.reduce((acc, item) => {
      const itemPrice = item.price || 0; // Bruger prisen på varen, eller 0 hvis den ikke er defineret
      const itemQuantity = item.quantity || 0; // Bruger antal af varen, eller 0 hvis det ikke er defineret
      return acc + itemPrice * itemQuantity; // Lægger prisen for denne vare til det samlede beløb
    }, 0);
    setTotalPrice(total); // Opdaterer totalprisen
  }, [basket]); // Kører hver gang 'basket' ændrer sig

  // Opdaterer kommentaren til ordren baseret på inputfeltets ændringer
  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  // Opdaterer kundens navn baseret på inputfeltets ændringer
  const handleNameChange = (e) => {
    setCustomerName(e.target.value);
  };

  // Håndterer afgivelse af ordren
  const handleSubmitOrder = async () => {
    const orderData = {
      dishes: basket.map(item => ({
        dish: item.id, // ID på retten
        amount: item.quantity, // Antal af denne ret
        size: item.size, // Størrelsen på retten
        extraIngredients: item.extras || [], // Eventuelle ekstra ingredienser
      })),
      comment: comment, // Kommentarer til ordren
      totalPrice: totalPrice, // Den samlede pris for ordren
    };

    // Sender ordren til serveren
    const response = await fetch(`${serverPath}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData), // Konverterer data til JSON før afsendelse
    });

    // Hvis ordren blev sendt korrekt, vises overlayet og kurven ryddes
    if (response.ok) {
      setIsOverlayVisible(true);
      setComment(''); // Nulstiller kommentaren
      clearBasket(); // Tømmer kurven
    }
  };

  // Lukker overlayet
  const closeOverlay = () => {
    setIsOverlayVisible(false);
  };

  return (
    <div className={styles.basketPage}>
      <DynamicHeader backgroundImage="headerImg.png" dynamicWord="skorpe" />
      <SubHeaderHeadline title="Bestilling" />
      {basket.length === 0 ? (
        <p>Kurven er tom.</p> // Viser en besked hvis kurven er tom
      ) : (
        <div className={styles.basketItems}>
          {basket.map((item, index) => (
            <div key={index} className={styles.basketItem}>
              <div className={styles.basketItemHeader}>
                <div className={styles.pizzaDetails}>
                  <h2 className={styles.pizzaTitle}>
                    {item.quantity}x {/* Viser antal af varen */}
                    <img src={item.image} alt={item.title} className={styles.pizzaImage} /> {/* Billede af varen */}
                    {item.title} {/* Titel/navn på varen */}
                  </h2>
                </div>
              </div>

              {item.extras && item.extras.length > 0 && (
                <h5 className={styles.pizzaExtras}>
                  <span className={styles.underlined}>Ekstra:</span> <span>{item.extras.join(", ")}</span> {/* Viser ekstra ingredienser */}
                </h5>
              )}

              <h5 className={styles.pizzaSize}>
                <span className={styles.underlined}>Størrelse:</span> <span>{item.size}</span> {/* Viser størrelsen */}
              </h5>

              <h5 className={styles.pizzaPrice}>
                <span className={styles.underlined}>Pris:</span> <span>{item.price * item.quantity},-</span> {/* Viser prisen */}
              </h5>

              <button
                className={styles.deleteButton}
                onClick={() => removeFromBasket(item.id, item.size, item.extras)} // Knap til at fjerne varen fra kurven
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
            <h3>I alt: {totalPrice},-</h3> {/* Viser totalprisen for alle varer i kurven */}
          </div>

          <input
            type="text"
            placeholder="Dit navn"
            value={customerName}
            onChange={handleNameChange}
            className={styles.customerNameInput} // Inputfelt til kundens navn
          />

          <textarea
            className={styles.commentBox}
            placeholder="Kommentarer til ordren"
            value={comment}
            onChange={handleCommentChange} // Textarea til at skrive kommentarer til ordren
          />

          <button className={styles.submitOrderButton} onClick={handleSubmitOrder}>
            Afgiv ordre {/* Knap til at afgive ordren */}
          </button>
        </div>
      )}

      <Overlay
        isVisible={isOverlayVisible}
        name={customerName}
        onClose={closeOverlay} // Viser overlay når ordren er sendt
        headerText={`Tak for din bestilling, ${customerName}!`}
        messageText=""
      />
    </div>
  );
};

export default BasketPage;
