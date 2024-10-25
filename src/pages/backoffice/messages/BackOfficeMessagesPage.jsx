import { useState, useEffect } from "react";
import styles from "./BackOfficeMessagesPage.module.css";
import { Link } from "react-router-dom";

const BackOfficeMessagesPage = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem("messages")) || [];
    setMessages(storedMessages);
  }, []);

  const deleteMessage = (indexToDelete) => {
    const updatedMessages = messages.filter((_, index) => index !== indexToDelete);
    setMessages(updatedMessages);
    localStorage.setItem("messages", JSON.stringify(updatedMessages));
  };

  return (
    <div className={styles.BackOfficeMessagesContainer}>
      <h2>Backoffice Beskeder</h2>
      <div>
        <Link to="/" className={styles.backLink}>← Back to Frontend</Link>
        <ul className={styles.navList}>
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
      {messages.length > 0 ? (
        <ul>
          {messages.map((message, index) => (
            <li key={index} className={styles.messageItem}>
              <h3>Emne: {message.subject}</h3>
              <p className={styles.messageDetails}>
                <strong>Afsender:</strong> {message.name}
              </p>
              <p className={styles.messageDetails}>
                <strong>Besked:</strong> {message.description}
              </p>
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
        <p className={styles.noMessagesMessage}>Ingen beskeder endnu.</p>
      )}
    </div>
  );
};

export default BackOfficeMessagesPage;
