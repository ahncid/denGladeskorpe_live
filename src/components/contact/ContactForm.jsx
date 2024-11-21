import { useState } from "react";
import styles from "./ContactForm.module.css";
import Overlay from "../overlay/Overlay";

// Definerer ContactForm-komponenten
const ContactForm = () => {
  // State til at gemme inputværdierne for navn, emne og beskrivelse
  const [formValues, setFormValues] = useState({
    name: "",
    subject: "",
    description: "",
  });

  // State til at gemme fejlbeskeder for validering af formularen
  const [formErrors, setFormErrors] = useState({});
  // State til at gemme, om formularen er blevet sendt
  const [isSubmitted, setIsSubmitted] = useState(false);
  // State til at styre, om overlayet skal være synligt
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  // State til at gemme navnet på den person, der har sendt formularen, for at vise det i overlayet
  const [submittedName, setSubmittedName] = useState(""); 

  // Funktion til at validere formularen
  const validateForm = () => {
    const errors = {};
    // Tjekker, om navn er udfyldt
    if (!formValues.name) {
      errors.name = "Navn er påkrævet";
    }
    // Tjekker, om emne er udfyldt
    if (!formValues.subject) {
      errors.subject = "Emne er påkrævet";
    }
    // Tjekker, om beskrivelse er udfyldt
    if (!formValues.description) {
      errors.description = "Beskrivelse er påkrævet";
    }
    // Gemmer eventuelle fejl i state
    setFormErrors(errors);
    // Returnerer true, hvis der ikke er nogen fejl, hvilket betyder, at formularen er gyldig
    return Object.keys(errors).length === 0;
  };

  // Funktion, der håndterer formularens indsendelse
  const handleSubmit = (e) => {
    e.preventDefault(); // Forhindrer standard formular-indsendelsesadfærd (sideopdatering)
    if (validateForm()) {
      // Hvis formularen er gyldig, fortsæt
      setIsSubmitted(true); // Sætter isSubmitted til true
      setSubmittedName(formValues.name); // Gemmer navnet på den person, der har sendt beskeden
      setOverlayVisible(true); // Viser overlayet

      // Henter tidligere beskeder fra localStorage eller initialiserer til en tom liste
      const messages = JSON.parse(localStorage.getItem("messages")) || [];
      // Tilføjer den nye besked til listen
      messages.push(formValues);
      // Gemmer den opdaterede liste tilbage til localStorage
      localStorage.setItem("messages", JSON.stringify(messages));

      console.log("Form data: ", formValues); // Udskriver formularens data til konsollen

      // Nulstiller formularens inputværdier
      setFormValues({
        name: "",
        subject: "",
        description: "",
      });
    }
  };

  // Funktion, der håndterer ændringer i inputfelterne
  const handleChange = (e) => {
    const { name, value } = e.target; // Henter navnet og værdien af det ændrede inputfelt
    // Opdaterer formValues med den nye værdi for det givne inputfelt
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  // Funktion til at lukke overlayet
  const closeOverlay = () => {
    setOverlayVisible(false); // Skjuler overlayet
  };

  return (
    <>
      {/* Formular til indsendelse af kontaktbesked */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Navn</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formValues.name}
            onChange={handleChange} // Kalder handleChange ved ændring i inputfeltet
          />
          {formErrors.name && <p className={styles.error}>{formErrors.name}</p>} {/* Viser fejlbesked for navn */}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="subject">Emne</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formValues.subject}
            onChange={handleChange} // Kalder handleChange ved ændring i inputfeltet
          />
          {formErrors.subject && <p className={styles.error}>{formErrors.subject}</p>} {/* Viser fejlbesked for emne */}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Beskrivelse</label>
          <textarea
            id="description"
            name="description"
            value={formValues.description}
            onChange={handleChange} // Kalder handleChange ved ændring i tekstområdet
          />
          {formErrors.description && (
            <p className={styles.error}>{formErrors.description}</p>
          )} {/* Viser fejlbesked for beskrivelse */}
        </div>

        <button type="submit" className={styles.submitButton}>
          Send
        </button>
      </form>

      {/* Overlay til visning af besked ved succesfuld indsendelse */}
      <Overlay
        isVisible={isOverlayVisible} // Viser overlayet baseret på isOverlayVisible
        name={submittedName} 
        onClose={closeOverlay} 
        headerText={`Tak for din besked ${submittedName}!`} 
        messageText="Vi vender tilbage hurtigst muligt."
      />
    </>
  );
};

export default ContactForm;
