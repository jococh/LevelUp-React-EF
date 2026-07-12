import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Index from "./pages/Index";
import Productos from "./pages/Productos";
import ProductoDetalle from "./pages/ProductoDetalle";
import Carrito from "./pages/Carrito";
import GestionProductos from "./pages/GestionProductos";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Registro from "./pages/Registro";
import Perfil from "./pages/Perfil";
import GestionCupones from "./components/GestionCupones/GestionCupones";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Index />} />
          <Route path="productos" element={<Productos />} />
          <Route path="producto/:id" element={<ProductoDetalle />} />
          <Route path="carrito" element={<Carrito />} />
          <Route
            path="gestion"
            element={
              <ProtectedRoute>
                <GestionProductos />
              </ProtectedRoute>
            }
          />
          <Route path="login" element={<Login />} />
          <Route path="registro" element={<Registro />} />
          <Route path="perfil" element={<Perfil />} />
          <Route
            path="admin/cupones"
            element={
              <ProtectedRoute>
                <GestionCupones />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;