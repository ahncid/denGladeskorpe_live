import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./navigation.module.css";
import { icons } from "../../../services/icons";
import useBasket from "../../Basket/Basket"; 

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getTotalItems, basket } = useBasket();
  const [totalItems, setTotalItems] = useState(0);


  useEffect(() => {
    setTotalItems(getTotalItems());
  }, [basket]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className={`${styles.navigation} ${isMenuOpen ? styles.menuOpen : ""}`}>
      {/* Logo til venstre */}
      <div className={styles.leftIcon}>
        <Link to="/">
        <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Logo" className={styles.logo} />
        </Link>
      </div>

      {/* Kurv-ikon ved siden af burger-menuen */}
      <div className={styles.rightIcons}>
        <div className={styles.basketIcon}>
          <Link to="/basket">
            <img
              src="/basket_icon.png"
              alt="Basket"
              className={styles.basketImage}
            />
            {totalItems > 0 && (
              <span className={styles.basketCount}>{totalItems}</span>
            )}
          </Link>
        </div>

        {/* Burger menu */}
        <div className={styles.burgerMenu} onClick={toggleMenu}>
          {isMenuOpen ? icons["Times"] : icons["Bars"]}
        </div>
      </div>

      {/* Dropdown menu */}
      {isMenuOpen && (
        <div className={styles.dropdownMenu}>
          <NavLink to="/" className={styles.menuItem} onClick={toggleMenu}>
            Forside
          </NavLink>
          <NavLink to="/employees" className={styles.menuItem} onClick={toggleMenu}>
            Personalet
          </NavLink>
          <NavLink to="/contact" className={styles.menuItem} onClick={toggleMenu}>
            Kontakt
          </NavLink>
          <NavLink to="/basket" className={styles.menuItem} onClick={toggleMenu}>
            Kurv
          </NavLink>
          <NavLink to="/backoffice" className={styles.menuItem} onClick={toggleMenu}>
            Backoffice
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default Navigation;
