import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <nav>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/receitas">Receitas</NavLink>
        <NavLink to="/despesas">Despesas</NavLink>
        <NavLink to="/categorias">Categorias</NavLink>
      </nav>
    </aside>
  );
}
