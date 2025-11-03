import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import AddEvent from "./pages/AddEvent";
import EditEvent from "./pages/EditEvent";
import EditGroup from "./pages/EditGroup";
import Login from "./pages/Login";
import AddGroup from "./pages/AddGroup";
import "./App.css";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router basename="/event-gallery">
      <Routes>
        <Route path="" element={<Home />} />

        {/* Rota protegida para Adicionar Evento */}
        <Route
          path="/add-event"
          element={
            <PrivateRoute>
              <AddEvent />
            </PrivateRoute>
          }
        />

        {/* Rota protegida para Adição de Grupo */}
        <Route
          path="/add-group"
          element={
            <PrivateRoute>
              <AddGroup />
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

        {/* Rota protegida para Editar Grupo */}
        <Route
          path="/edit-group/:id"
          element={
            <PrivateRoute>
              <EditGroup />
            </PrivateRoute>
          }
        />

        {/* Rota pública de login */}
        <Route path="/login" element={<Login />} />

        {/* Rota para abertura de eventos */}
        <Route path="/evento/:id" element={<Home />} />

        {/* Rota curinga para redirecionamento para a Home */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
