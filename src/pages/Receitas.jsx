import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import "./Receitas.css";

export default function Receitas() {
  const { user } = useAuth();

  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState("");
  const [receitas, setReceitas] = useState([]);

  useEffect(() => {
    carregarReceitas();
  }, []);

  async function carregarReceitas() {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("type", "income")
      .eq("user_id", user.id)
      .order("date", { ascending: false });

    if (!error) setReceitas(data || []);
  }

  async function adicionarReceita(e) {
    e.preventDefault();

    if (!descricao.trim() || !valor || !data) return;
    if (!user) {
      alert("Erro: utilizador não autenticado.");
      return;
    }

    const { error } = await supabase.from("transactions").insert([
      {
        description: descricao,
        amount: Number(valor),
        date: data,
        type: "income",
        user_id: user.id,
      },
    ]);

    if (!error) {
      setDescricao("");
      setValor("");
      setData("");
      carregarReceitas();
    }
  }

  async function apagarReceita(id) {
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id);

    if (!error) carregarReceitas();
  }

  return (
    <div className="receitas-page">
      <h1 className="page-title">Receitas</h1>

      <form className="form-premium" onSubmit={adicionarReceita}>
        <label>Descrição</label>
        <input
          type="text"
          placeholder="Ex: Salário, Venda..."
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />

        <label>Valor</label>
        <input
          type="number"
          step="0.01"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          required
        />

        <label>Data</label>
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          required
        />

        <button type="submit">Adicionar Receita</button>
      </form>

      <section className="panel">
        <h2>Lista de Receitas</h2>

        {receitas.length === 0 && (
          <p className="info-text">Ainda não existem receitas.</p>
        )}

        {receitas.length > 0 && (
          <table className="receitas-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {receitas.map((r) => (
                <tr key={r.id}>
                  <td>{new Date(r.date).toLocaleDateString("pt-PT")}</td>
                  <td>{r.description}</td>
                  <td className="value-income">
                    {Number(r.amount).toLocaleString("pt-PT", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => apagarReceita(r.id)}
                    >
                      Apagar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
