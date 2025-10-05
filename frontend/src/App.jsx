import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import AddEvent from "./pages/AddEvent";
import EditEvent from "./pages/EditEvent";
import Login from "./pages/Login"; // ⬅️ importa sua página de login
import "./App.css";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota protegida para Home */}
        <Route
          path="/"
          element={
              <Home />
          }
        />

        {/* Rota protegida para Adicionar Evento */}
        <Route
          path="/add"
          element={
            <PrivateRoute>
              <AddEvent />
            </PrivateRoute>
          }
        />

        {/* Rota protegida para Editar Evento */}
        <Route
          path="/edit/:id"
          element={
            <PrivateRoute>
              <EditEvent />
            </PrivateRoute>
          }
        />

        {/* Rota pública de login */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
