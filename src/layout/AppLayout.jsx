import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "./AppLayout.css";
import { useState } from "react";

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout">

      {/* OVERLAY — só aparece no mobile quando o menu está aberto */}
      {sidebarOpen && (
        <div
          className="overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar 
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(false)}
      />

      <div className="main-area">
        <Navbar onToggleSidebar={() => setSidebarOpen(true)} />

        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
