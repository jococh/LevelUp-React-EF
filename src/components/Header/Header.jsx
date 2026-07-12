import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./Header.module.css";

function Header() {
  const { usuario, cerrarSesion } = useAuth();

  const navigate = useNavigate();

  const handleCerrarSesion = async () => {
    await cerrarSesion();

    navigate("/");

    alert("Sesión cerrada correctamente.");
  };

  return (
    <header className={styles.header}>
      <div className={styles.marca}>
        <div className={styles.logoContenedor}>
          <img
            src="/imgs/logo-level-up.png"
            alt="Logo de Level Up"
            className={styles.logo}
          />
        </div>

        <p>level up</p>
      </div>

      <div className={styles.usuario}>
        {usuario ? (
          <>
            <span>{usuario.email}</span>

            <Link
              to="/perfil"
              className={styles.botonPerfil}
            >
              Mi perfil
            </Link>

            <button
              type="button"
              onClick={handleCerrarSesion}
              className={styles.botonCerrarSesion}
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className={styles.botonLogin}
          >
            Iniciar sesión
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;