import { useState } from "react";
import styles from "./ContactForm.module.css";
import Overlay from "../overlay/Overlay";

const ContactForm = () => {
  const [formValues, setFormValues] = useState({
    name: "",
    subject: "",
    description: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [submittedName, setSubmittedName] = useState(""); 

  const validateForm = () => {
    const errors = {};
    if (!formValues.name) {
      errors.name = "Navn er påkrævet";
    }
    if (!formValues.subject) {
      errors.subject = "Emne er påkrævet";
    }
    if (!formValues.description) {
      errors.description = "Beskrivelse er påkrævet";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitted(true);
      setSubmittedName(formValues.name); 
      setOverlayVisible(true);

      const messages = JSON.parse(localStorage.getItem("messages")) || [];
      messages.push(formValues);
      localStorage.setItem("messages", JSON.stringify(messages));

      console.log("Form data: ", formValues);


      setFormValues({
        name: "",
        subject: "",
        description: "",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const closeOverlay = () => {
    setOverlayVisible(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Navn</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formValues.name}
            onChange={handleChange}
          />
          {formErrors.name && <p className={styles.error}>{formErrors.name}</p>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="subject">Emne</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formValues.subject}
            onChange={handleChange}
          />
          {formErrors.subject && <p className={styles.error}>{formErrors.subject}</p>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Beskrivelse</label>
          <textarea
            id="description"
            name="description"
            value={formValues.description}
            onChange={handleChange}
          />
          {formErrors.description && (
            <p className={styles.error}>{formErrors.description}</p>
          )}
        </div>

        <button type="submit" className={styles.submitButton}>
          Send
        </button>
      </form>


      <Overlay
        isVisible={isOverlayVisible}
        name={submittedName} 
        onClose={closeOverlay}
        headerText={`Tak for din besked ${submittedName}!`} 
        messageText="Vi vender tilbage hurtigst muligt."
      />
    </>
  );
};

export default ContactForm;
