
import DynamicHeader from "../../components/common/Header/Header";
import SubHeader from "../../components/common/Subheader/SubHeader";
import styles from "./ContactPage.module.css";
import ContactForm from "../../components/contact/ContactForm";

const ContactPage = () => {
  return (
    <div className={styles.employeeContainer}>
     <DynamicHeader 
        backgroundImage="/headerImg.png" 
        dynamicWord="skorpe"  
      />
       <SubHeader
        title="Har du spørgsmål eller ønsker du at bestille din favoritpizza?" 
        paragraph={`Udfyld formularen herunder, så vender vi hurtigt tilbage til dig. Vi glæder os til at høre fra dig!`}
      />
 <ContactForm />
    </div>
  );
};

export default ContactPage;
