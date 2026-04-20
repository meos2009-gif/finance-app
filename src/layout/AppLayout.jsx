import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "./AppLayout.css";
import { useState } from "react";

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`layout ${sidebarOpen ? "sidebar-open" : ""}`}>
      
      {/* OVERLAY ESCURO (MOBILE) */}
      {sidebarOpen && (
        <div
          className="menu-overlay active"
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
