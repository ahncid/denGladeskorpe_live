
import styles from "./SubHeader.module.css"; 

const SubHeader = ({ title, paragraph }) => {
  return (
    <div className={styles.subHeader}>
      <h2>{title}</h2>
      <p>{paragraph}</p>
    </div>
  );
};

export default SubHeader;
