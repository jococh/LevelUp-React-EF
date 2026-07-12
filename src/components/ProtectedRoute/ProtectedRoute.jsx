import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ProtectedRoute({ children }) {
  const { usuario, rol, cargando } = useAuth();

  if (cargando) {
    return (
      <h2
        style={{
          color: "#b4dd13",
          background: "black",
          minHeight: "70vh",
          textAlign: "center",
          paddingTop: "100px",
          fontFamily: "Inconsolata",
        }}
      >
        Verificando usuario...
      </h2>
    );
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (rol !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;