import styles from "./footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>

<img src={`${import.meta.env.BASE_URL}logo.png`} alt="Logo" className={styles.logo} />


   
      <div className={styles.info}>
        <p>Email: gladskorpe@pizzaglad.dk</p>
        <p>Tlf: 12345678</p>
        <p>Adresse: Skorpevej 42, 1234 Pizzabyen</p>
      </div>
    </footer>
  );
};

export default Footer;
