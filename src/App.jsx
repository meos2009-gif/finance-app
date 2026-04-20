import AppLayout from "./layout/AppLayout";
import { Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Receitas from "./pages/Receitas";
import Despesas from "./pages/Despesas";
import Categorias from "./pages/Categorias";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rotas protegidas */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/receitas"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Receitas />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/despesas"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Despesas />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/categorias"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Categorias />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Redirecionar raiz */}
        <Route path="*" element={<Login />} />
      </Routes>
    </AuthProvider>
  );
}
