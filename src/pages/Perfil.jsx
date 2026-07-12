import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./Auth.module.css";

function Perfil() {
    const {
        usuario,
        rol,
        cargando,
        cerrarSesion,
    } = useAuth();

    if (cargando) {
        return <h2>Cargando perfil...</h2>;
    }

    if (!usuario) {
        return <Navigate to="/login" replace />;
    }

    const handleCerrarSesion = async () => {
        await cerrarSesion();
    };

    return (
        <section className={styles.authPagina}>
            <div className={styles.authCard}>
                <h1>Mi perfil</h1>

                <div className={styles.datosPerfil}>
                    <p>
                        <strong>Correo:</strong>{" "}
                        {usuario.email}
                    </p>

                    <p>
                        <strong>Rol:</strong>{" "}
                        {rol === "admin"
                            ? "Administrador"
                            : "Usuario"}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleCerrarSesion}
                    className={styles.boton}
                >
                    Cerrar sesión
                </button>
            </div>
        </section>
    );
}

export default Perfil;