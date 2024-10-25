import styles from "./Overlay.module.css";

const Overlay = ({ 
  isVisible, 
  name, 
  onClose, 
  headerText, 
  messageText 
}) => {
  if (!isVisible) return null;

  const handleOverlayClick = (e) => {
    if (e.target.className.includes('overlay')) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.overlayBackground}></div>
      <div className={styles.overlayContent}>
        <p className={styles.headerText}>{headerText}</p>
        <p>{messageText}</p>
      </div>
    </div>
  );
};

export default Overlay;
