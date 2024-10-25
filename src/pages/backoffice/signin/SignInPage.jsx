import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import styles from "./SignInPage.module.css";
import { Link } from "react-router-dom";


const SignInPage = () => {
  const { signIn } = useAuth(); 
  const navigate = useNavigate(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await signIn(email, password);
      if (user) {
    
        navigate("/backoffice");
      }
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className={styles.SignInContainer}>
      <h2>Sign In to BackOffice</h2>
   
      <form onSubmit={handleSubmit}>
     
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        {error && <p>{error}</p>}
        <button type="submit">Sign In</button>
      </form>
      <Link to="/" className={styles.backLink}>← Back to Frontend</Link>
    </div>
  );
};

export default SignInPage;
