import { useState, useEffect } from "react";
import { serverPath } from "../../../services/settings";
import styles from "./BackOfficeEmployeePage.module.css";
import { Link } from 'react-router-dom';


const BackOfficeEmployeePage = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null); 
  const [newEmployee, setNewEmployee] = useState({ name: "", position: "", image: null }); 
  const [previewImage, setPreviewImage] = useState(null); 
  const [editPreviewImage, setEditPreviewImage] = useState(null); 


  useEffect(() => {
    fetchEmployees(); 
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${serverPath}/employees`);
      const result = await response.json();
      setEmployees(result.data);
    } catch (err) {
      setError("Failed to fetch employees");
    }
  };


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewEmployee({ ...newEmployee, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const createEmployee = async () => {
    const formData = new FormData();
    formData.append('name', newEmployee.name);
    formData.append('position', newEmployee.position);
    formData.append('file', newEmployee.image);
  
    try {
      const response = await fetch(`${serverPath}/employee`, {
        method: "POST",
        body: formData,
      });
      const addedEmployee = await response.json();
  
      setEmployees([...employees, addedEmployee.data]); 
  
      setNewEmployee({ name: "", position: "", image: null });
      setPreviewImage(null); 
    } catch (err) {
      setError("Failed to create employee");
    }
  };

 
  const handleEditImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditingEmployee({ ...editingEmployee, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditPreviewImage(reader.result); 
      };
      reader.readAsDataURL(file);
    }
  };


  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setEditPreviewImage(employee.image); 
  };


  const saveUpdatedEmployee = async () => {
    const formData = new FormData();
    formData.append('id', editingEmployee._id);
    formData.append('name', editingEmployee.name);
    formData.append('position', editingEmployee.position);
    formData.append('file', editingEmployee.image);

    try {
      const response = await fetch(`${serverPath}/employee/`, {
        method: "PUT",
        body: formData,
      });
      const updatedEmployee = await response.json();

    
      setEmployees(prevEmployees =>
        prevEmployees.map(emp => emp._id === editingEmployee._id ? updatedEmployee.data : emp)
      );
      setEditingEmployee(null); 
    } catch (err) {
      setError("Failed to update employee");
    }
  };


  const deleteEmployee = async (id) => {
    try {
      await fetch(`${serverPath}/employee/${id}`, { method: "DELETE" });
      setEmployees(employees.filter(emp => emp._id !== id));
    } catch (err) {
      setError("Failed to delete employee");
    }
  };

  return (
    <div className={styles.backOfficeContainer}>
      <h2>Backoffice - Medarbejdere</h2>

      <div>
        <Link to="/" className={styles.backLink}>← Back to Frontend</Link>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link to="/backoffice/dishes" className={styles.navLink}>Administrer Dishes</Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/backoffice/messages" className={styles.navLink}>Administrer Messages</Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/backoffice/orders" className={styles.navLink}>Administrer Orders</Link>
          </li>
        </ul>
      </div>


      <div>
        <h2>Opret medarbejder</h2>
        <input
          type="text"
          placeholder="Navn"
          value={newEmployee.name}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, name: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Position"
          value={newEmployee.position}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, position: e.target.value })
          }
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />
        {previewImage && <img src={previewImage} alt="Preview" className={styles.previewImage} />}
        <button onClick={createEmployee}>Opret</button>
      </div>

      {/* Liste af medarbejdere */}
      {employees.length > 0 ? (
        <div className={styles.employeeGrid}>
          {employees.map((employee) => (
            <div key={employee._id} className={styles.employeeCard}>
              <img src={employee.image} alt={employee.name} />
              {editingEmployee && editingEmployee._id === employee._id ? (
                <div>
                  <input
                    type="text"
                    value={editingEmployee.name}
                    onChange={(e) =>
                      setEditingEmployee({ ...editingEmployee, name: e.target.value })
                    }
                    placeholder="Navn"
                  />
                  <input
                    type="text"
                    value={editingEmployee.position}
                    onChange={(e) =>
                      setEditingEmployee({ ...editingEmployee, position: e.target.value })
                    }
                    placeholder="Position"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageUpload}
                  />
                  {editPreviewImage && (
                    <img src={editPreviewImage} alt="Edit Preview" className={styles.previewImage} />
                  )}
                  <button onClick={saveUpdatedEmployee}>Gem</button>
                  <button onClick={() => setEditingEmployee(null)}>Annuller</button>
                </div>
              ) : (
                <div>
                  <h3>{employee.name}</h3>
                  <p>{employee.position}</p>
                  <button onClick={() => handleEditEmployee(employee)}>Opdater</button>
                  <button onClick={() => deleteEmployee(employee._id)}>Slet</button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>Ingen medarbejdere fundet.</p>
      )}
    </div>
  );
};

export default BackOfficeEmployeePage;
