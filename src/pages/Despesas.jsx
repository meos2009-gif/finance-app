import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import "./Despesas.css";

export default function Despesas() {
  const { user } = useAuth();

  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState("");
  const [categoria, setCategoria] = useState("");
  const [empresas, setEmpresas] = useState([]); // vem das descrições
  const [categorias, setCategorias] = useState([]);
  const [despesas, setDespesas] = useState([]);

  useEffect(() => {
    if (!user) return;

    carregarCategorias();
    carregarDespesas();
  }, [user]);

  async function carregarCategorias() {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (!error) setCategorias(data || []);
  }

  async function carregarDespesas() {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("type", "expense")
      .eq("user_id", user.id)
      .order("date", { ascending: false });

    if (!error) {
      setDespesas(data || []);

      // construir lista de "empresas" a partir das descrições
      const nomesUnicos = Array.from(
        new Set((data || []).map((d) => d.description).filter(Boolean))
      );
      setEmpresas(nomesUnicos);
    }
  }

  function getCategoriaNome(id) {
    const cat = categorias.find((c) => c.id === id);
    return cat ? cat.name : "—";
  }

  async function adicionarDespesa(e) {
    e.preventDefault();

    if (!descricao.trim() || !valor || !data) return;
    if (!user) {
      alert("Erro: utilizador não autenticado.");
      return;
    }

    const { error } = await supabase.from("transactions").insert([
      {
        description: descricao, // aqui fica o nome da “empresa”
        amount: Number(valor),
        date: data,
        type: "expense",
        category_id: categoria,
        user_id: user.id,
      },
    ]);

    if (!error) {
      setDescricao("");
      setValor("");
      setData("");
      setCategoria("");
      carregarDespesas(); // volta a construir a lista de empresas
    }
  }

  async function apagarDespesa(id) {
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id);

    if (!error) carregarDespesas();
  }

  return (
    <div className="despesas-page">
      <h1 className="page-title">Despesas</h1>

      <form className="form-premium" onSubmit={adicionarDespesa}>
        <label>Descrição / Empresa</label>
        <input
          list="lista-empresas"
          type="text"
          placeholder="Ex: Mercadona, Pingo Doce..."
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />
        <datalist id="lista-empresas">
          {empresas.map((nome) => (
            <option key={nome} value={nome} />
          ))}
        </datalist>

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

        <label>Categoria</label>
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          required
        >
          <option value="">Selecione...</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <button type="submit">Adicionar Despesa</button>
      </form>

      <section className="panel">
        <h2>Lista de Despesas</h2>

        {despesas.length === 0 && (
          <p className="info-text">Ainda não existem despesas.</p>
        )}

        {despesas.length > 0 && (
          <table className="despesas-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Valor</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {despesas.map((d) => (
                <tr key={d.id}>
                  <td>{new Date(d.date).toLocaleDateString("pt-PT")}</td>
                  <td>{d.description}</td>
                  <td>{getCategoriaNome(d.category_id)}</td>
                  <td className="value-expense">
                    {Number(d.amount).toLocaleString("pt-PT", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => apagarDespesa(d.id)}
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
