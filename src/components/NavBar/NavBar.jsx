import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./NavBar.module.css";
import IconoCarrito from "../IconoCarrito/IconoCarrito";

function NavBar() {
  const { rol } = useAuth();

  return (
    <nav className={styles.nav}>
      <ul className={styles.lista}>
        <li>
          <Link to="/">Inicio</Link>
        </li>

        <li>
          <Link to="/productos">Tienda</Link>
        </li>

        {rol === "admin" && (
          <>
            <li>
              <Link to="/gestion">
                Gestión
              </Link>
            </li>

            <li>
              <Link to="/admin/cupones">
                Cupones
              </Link>
            </li>
          </>
        )}

        <div className={styles.carritoContainer}>
          <IconoCarrito />
        </div>
      </ul>
    </nav>
  );
}

export default NavBar;