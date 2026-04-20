import "./Navbar.css";

export default function Navbar({ onToggleSidebar }) {
  return (
    <header className="navbar">
      <button className="menu-button" onClick={onToggleSidebar}>
        ☰
      </button>

      <h1 className="navbar-title">Gestão Financeira</h1>
    </header>
  );
}
