
import styles from "./SubHeaderHeadline.module.css"; 

const SubHeaderHeadline = ({ title }) => {
  return (
    <div className={styles.subHeader}>
      <h2>{title}</h2>
    </div>
  );
};

export default SubHeaderHeadline;
