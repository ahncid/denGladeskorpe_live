import styles from "./Header.module.css";

const DynamicHeader = ({ backgroundImage, dynamicWord }) => {
  return (
    <header
    className={styles.header}
    style={{
      backgroundImage: `url(${import.meta.env.BASE_URL}${backgroundImage})`
    }}
  >
  
    
      <h1 className={styles.title}>
        <span className={styles.small}>Den</span> <span className={styles.large}>glade</span><span className={styles.medium}>{dynamicWord}</span>
      </h1>
    </header>
  );
};

export default DynamicHeader;
