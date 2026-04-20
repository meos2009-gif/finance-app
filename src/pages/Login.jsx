import { useState } from "react";
import { supabase } from "../supabaseClient";
import "./Auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) setError("Credenciais inválidas.");
    else window.location.href = "/dashboard";
  }

  return (
    <div className="auth-page">
      <h1 className="auth-title">Login</h1>

      <form className="auth-form" onSubmit={handleLogin}>
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        {error && <p className="auth-error">{error}</p>}

        <button type="submit">Entrar</button>
      </form>

      <p className="auth-link">
        Ainda não tens conta? <a href="/register">Registar</a>
      </p>
    </div>
  );
}
