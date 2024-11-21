import { useState, useEffect } from "react";
import styles from "./BackOfficeMessagesPage.module.css";
import { Link } from "react-router-dom";

const BackOfficeMessagesPage = () => {
  // State til at gemme beskeder
  const [messages, setMessages] = useState([]);

  // useEffect til at hente beskeder fra localStorage, når komponenten indlæses
  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem("messages")) || []; // Henter og parser beskeder fra localStorage
    setMessages(storedMessages); // Opdaterer state med de hentede beskeder
  }, []);

  // Funktion til at slette en besked baseret på dens indeks
  const deleteMessage = (indexToDelete) => {
    // Filtrerer beskederne og fjerner den valgte besked
    const updatedMessages = messages.filter((_, index) => index !== indexToDelete);
    setMessages(updatedMessages); // Opdaterer state med den nye liste af beskeder
    localStorage.setItem("messages", JSON.stringify(updatedMessages)); // Opdaterer localStorage med de nye beskeder
  };

  return (
    <div className={styles.BackOfficeMessagesContainer}>
      <h2>Backoffice Beskeder</h2>
      <div>
        {/* Link tilbage til forsiden */}
        <Link to="/" className={styles.backLink}>← Back to Frontend</Link>
        <ul className={styles.navList}>
          {/* Navigation til andre backoffice-sider */}
          <li className={styles.navItem}>
            <Link to="/backoffice/employees" className={styles.navLink}>Administrer Employees</Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/backoffice/dishes" className={styles.navLink}>Administrer Dishes</Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/backoffice/orders" className={styles.navLink}>Administrer Orders</Link>
          </li>
        </ul>
      </div>
      {/* Viser beskeder, hvis der er nogle */}
      {messages.length > 0 ? (
        <ul>
          {/* Mapper over beskederne og viser dem */}
          {messages.map((message, index) => (
            <li key={index} className={styles.messageItem}>
              <h3>Emne: {message.subject}</h3>
              <p className={styles.messageDetails}>
                <strong>Afsender:</strong> {message.name}
              </p>
              <p className={styles.messageDetails}>
                <strong>Besked:</strong> {message.description}
              </p>
              {/* Knap til at slette beskeden */}
              <button
                onClick={() => deleteMessage(index)}
                className={styles.deleteButton}
              >
                Slet
              </button>
            </li>
          ))}
        </ul>
      ) : (
        // Viser besked, hvis der ikke er nogen beskeder
        <p className={styles.noMessagesMessage}>Ingen beskeder endnu.</p>
      )}
    </div>
  );
};

export default BackOfficeMessagesPage;
