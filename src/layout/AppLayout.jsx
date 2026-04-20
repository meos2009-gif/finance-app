import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "./AppLayout.css";
import { useState } from "react";

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout">
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
