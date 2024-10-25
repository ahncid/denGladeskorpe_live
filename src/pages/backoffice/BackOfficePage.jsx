import { Link } from 'react-router-dom';
import styles from "../backoffice/BackOfficePage.module.css";
import { useAuth } from "../../hooks/useAuth"; 

function BackOfficePage() {
  const { signOut } = useAuth(); 

  return (
    <div className={styles.BackOfficeContainer}>
      <h2 className={styles.backOfficeTitle}>Backoffice</h2>

    
      <div>
        <Link to="/" className={styles.backLink}>← Back to Frontend</Link>
      </div>

    
      <div>
        <button onClick={signOut} className={styles.logOutButton}>Log Ud</button>
      </div>

      <p>Vælg for at administrere:</p>
      <nav>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link to="/backoffice/employees" className={styles.navLink}>Administrer Employees</Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/backoffice/dishes" className={styles.navLink}>Administrer Dishes</Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/backoffice/messages" className={styles.navLink}>Administrer Messages</Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/backoffice/orders" className={styles.navLink}>Administrer Orders</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default BackOfficePage;
