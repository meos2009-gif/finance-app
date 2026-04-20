import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./Categorias.css";

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarCategorias();
  }, []);

  async function carregarCategorias() {
    setLoading(true);
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (!error) setCategorias(data || []);
    setLoading(false);
  }

  async function adicionarCategoria(e) {
    e.preventDefault();

    if (!nome.trim()) return;

    const { error } = await supabase
      .from("categories")
      .insert([{ name: nome.trim() }]);

    if (!error) {
      setNome("");
      carregarCategorias();
    }
  }

  async function apagarCategoria(id) {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (!error) carregarCategorias();
  }

  return (
    <div className="categorias-page">
      <h1 className="page-title">Categorias</h1>

      {/* FORMULÁRIO */}
      <form className="form-premium" onSubmit={adicionarCategoria}>
        <label>Nova Categoria</label>
        <input
          type="text"
          placeholder="Ex: Alimentação, Renda, Transportes..."
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />

        <button type="submit">Adicionar Categoria</button>
      </form>

      {/* LISTA */}
      <section className="panel">
        <h2>Lista de Categorias</h2>

        {loading && <p className="info-text">A carregar...</p>}

        {!loading && categorias.length === 0 && (
          <p className="info-text">Ainda não existem categorias.</p>
        )}

        {!loading && categorias.length > 0 && (
          <table className="categorias-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => apagarCategoria(c.id)}
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
