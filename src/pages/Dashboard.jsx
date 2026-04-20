import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./Dashboard.css";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({
    income: 0,
    expense: 0,
    balance: 0,
  });

  const [categoryStats, setCategoryStats] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        console.error(error);
        setError("Erro ao carregar dados do Supabase.");
        setLoading(false);
        return;
      }

      if (!data) {
        setLoading(false);
        return;
      }

      // TIPOS
      const INCOME_TYPE = "income";
      const EXPENSE_TYPE = "expense";

      let income = 0;
      let expense = 0;

      data.forEach((t) => {
        if (t.type === INCOME_TYPE) {
          income += Number(t.amount) || 0;
        } else if (t.type === EXPENSE_TYPE) {
          expense += Number(t.amount) || 0;
        }
      });

      const balance = income - expense;

      setTotals({
        income,
        expense,
        balance,
      });

      // ============================
      //   CÁLCULO POR CATEGORIA
      // ============================

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const expenses = data.filter((t) => t.type === EXPENSE_TYPE);

      // despesas do mês
      const monthExpenses = expenses.filter((t) => {
        const d = new Date(t.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });

      // despesas do ano
      const yearExpenses = expenses.filter((t) => {
        const d = new Date(t.date);
        return d.getFullYear() === currentYear;
      });

      const categories = {};

      monthExpenses.forEach((t) => {
        const cat = t.category || "Sem categoria";
        if (!categories[cat]) categories[cat] = { month: 0, year: 0 };
        categories[cat].month += Number(t.amount);
      });

      yearExpenses.forEach((t) => {
        const cat = t.category || "Sem categoria";
        if (!categories[cat]) categories[cat] = { month: 0, year: 0 };
        categories[cat].year += Number(t.amount);
      });

      const monthTotal = monthExpenses.reduce(
        (sum, t) => sum + Number(t.amount),
        0
      );

      const stats = Object.keys(categories).map((cat) => ({
        category: cat,
        monthTotal: categories[cat].month,
        yearTotal: categories[cat].year,
        percent:
          monthTotal > 0 ? (categories[cat].month / monthTotal) * 100 : 0,
      }));

      setCategoryStats(stats);

      setLoading(false);
    }

    loadData();
  }, []);

  return (
    <div className="dashboard-page">
      <h1 className="page-title">Dashboard</h1>

      {loading && <p className="info-text">A carregar dados...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        <>
          {/* CARDS SUPERIORES */}
          <section className="cards-grid">
            <div className="card card-income">
              <h2>Receitas</h2>
              <p className="card-value">
                {totals.income.toLocaleString("pt-PT", {
                  style: "currency",
                  currency: "EUR",
                })}
              </p>
            </div>

            <div className="card card-expense">
              <h2>Despesas</h2>
              <p className="card-value">
                {totals.expense.toLocaleString("pt-PT", {
                  style: "currency",
                  currency: "EUR",
                })}
              </p>
            </div>

            <div className="card card-balance">
              <h2>Saldo</h2>
              <p className="card-value">
                {totals.balance.toLocaleString("pt-PT", {
                  style: "currency",
                  currency: "EUR",
                })}
              </p>
            </div>
          </section>

          {/* QUADRO POR CATEGORIA */}
          <section className="panel">
            <h2>Despesas por Categoria (Mensal)</h2>

            {categoryStats.length === 0 && (
              <p className="info-text">Ainda não existem despesas este mês.</p>
            )}

            {categoryStats.length > 0 && (
              <table className="category-table">
                <thead>
                  <tr>
                    <th>Categoria</th>
                    <th>Total Mensal</th>
                    <th>Total Anual</th>
                    <th>% do Mês</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryStats.map((c) => (
                    <tr key={c.category}>
                      <td>{c.category}</td>
                      <td className="value-expense">
                        {c.monthTotal.toLocaleString("pt-PT", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </td>
                      <td className="value-expense">
                        {c.yearTotal.toLocaleString("pt-PT", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </td>
                      <td>{c.percent.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </>
      )}
    </div>
  );
}
