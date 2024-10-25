import  { useEffect } from "react";
import useTinyFetch from "../../hooks/tinyFetch.hook";
import styles from "./EmployeeList.module.css";

const EmployeeList = () => {
  const { data: employees, fetchData } = useTinyFetch();

  useEffect(() => {
    fetchData("/employees"); 
  }, [fetchData]);

  return (
    <div className={styles.employeeContainer}>
      {employees.length > 0 ? (
        <div className={styles.employeeGrid}>
          {employees.map((employee) => (
            <div key={employee._id} className={styles.employeeCard}>
              <img src={employee.image} alt={employee.name} className={styles.employeeImage} />
              <h3>{employee.name}</h3>
              <p>{employee.position}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Ingen medarbejdere fundet.</p>
      )}
    </div>
  );
};

export default EmployeeList;
