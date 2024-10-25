import EmployeeList from "../../components/employee/EmployeeList";
import DynamicHeader from "../../components/common/Header/Header";
import SubHeader from "../../components/common/Subheader/SubHeader";
import styles from "./EmployeePage.module.css";

const EmployeePage = () => {
  return (
    <div className={styles.employeeContainer}>
     <DynamicHeader 
        backgroundImage="/headerImg.png" 
        dynamicWord="skorpe"  
      />
       <SubHeader
        title="Personalet hos Den Glade Skorpe" 
        paragraph={`Hos Den Glade Skorpe har vi et dedikeret og venligt personale, der altid går den ekstra mil for at sikre, at kunderne får den bedste oplevelse. Teamet består af erfarne pizzabagere, der med passion tilbereder lækre pizzaer med friske råvarer.`}
      />
     <EmployeeList/>
    </div>
  );
};

export default EmployeePage;
