import { useState } from "react";
import { supabase } from "../supabaseClient";
import "./Auth.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    setMsg("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) setMsg("Erro ao criar conta.");
    else setMsg("Conta criada! Verifica o teu email.");
  }

  return (
    <div className="auth-page">
      <h1 className="auth-title">Registo</h1>

      <form className="auth-form" onSubmit={handleRegister}>
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        {msg && <p className="auth-ok">{msg}</p>}

        <button type="submit">Criar conta</button>
      </form>

      <p className="auth-link">
        Já tens conta? <a href="/login">Entrar</a>
      </p>
    </div>
  );
}
