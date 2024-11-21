import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import styles from "./SignInPage.module.css";
import { Link } from "react-router-dom";

const SignInPage = () => {
  const { signIn } = useAuth(); // Henter signIn-funktionen fra auth hooket
  const navigate = useNavigate(); // Bruges til at navigere brugeren efter login
  const [email, setEmail] = useState(""); // State til at gemme brugerens email
  const [password, setPassword] = useState(""); // State til at gemme brugerens password
  const [error, setError] = useState(null); // State til at gemme fejlbeskeder

  // Funktion til at håndtere indsendelse af login-formularen
  const handleSubmit = async (e) => {
    e.preventDefault(); // Forhindrer standard formularindsendelse
    try {
      const user = await signIn(email, password); // Forsøger at logge brugeren ind med email og password
      if (user) {
        navigate("/backoffice"); // Hvis login er succesfuldt, omdirigerer til backoffice
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
          onChange={(e) => setEmail(e.target.value)} // Opdaterer email state ved ændring
          required
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Opdaterer password state ved ændring
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

