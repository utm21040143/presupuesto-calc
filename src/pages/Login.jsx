import React, { useState } from "react";
import { authServices } from "@/services/authService";
import "@/App.css";

const Login = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginWithGoogle = async () => {
    try {
      const userData = await authServices.signInWithGoogle();
      setUser(userData);
      setError(null);
    } catch (err) {
      setError("Error al iniciar sesión con Google: " + err.message); // Muestra el mensaje de error
      console.error("Error:", err);
    }
  };

  const handleRegisterWithEmail = async () => {
    try {
      const userData = await authServices.registerWithEmail(email, password);
      setUser(userData);
      setError(null);
      console.log("User created successfully", userData);
    } catch (error) {
      setError("Error al crear usuario: " + error.message); // Muestra el mensaje de error
      console.error("Error creating user:", error);
    }
  };

  const handleLoginWithEmail = async (e) => {
    e.preventDefault();
    try {
      const userData = await authServices.loginWithEmail(email, password);
      setUser(userData);
      setError(null);
    } catch (err) {
      setError("Error al iniciar sesión: " + err.message); // Muestra el mensaje de error
      console.error("Error:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await authServices.signOut();
      setUser(null);
    } catch (err) {
      setError("Error al cerrar sesión: " + err.message); // Muestra el mensaje de error
      console.error("Error:", err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img src="/logo.png" alt="Logo" className="login-logo" />
          <h2>Bienvenido</h2>
          <p>Inicia sesión para continuar</p>
        </div>
        {user ? (
          <>
            <img src={user.photoURL} alt="Avatar" className="user-avatar" />
            <h3>{user.displayName}</h3>
            <button className="btn-logout" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            {error && <p className="error-text">{error}</p>}
            <form onSubmit={handleLoginWithEmail} className="login-form">
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit" className="btn-login">
                Iniciar sesión
              </button>
              <button className="btn-login" onClick={handleRegisterWithEmail}>
                Registrar usuario
              </button>
            </form>
            <button className="btn-login google-login" onClick={handleLoginWithGoogle}>
              Iniciar sesión con Google
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
