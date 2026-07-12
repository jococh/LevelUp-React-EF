import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Auth.module.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const auth = getAuth();

        try {
            const userCredential =
                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            console.log(
                "Usuario logueado:",
                userCredential.user
            );

            alert("¡Inicio de sesión exitoso!");

            navigate("/");
        } catch (error) {
            console.error(
                "Error al iniciar sesión:",
                error.code,
                error.message
            );

            alert(
                "El correo o la contraseña son incorrectos."
            );
        }
    };

    return (
        <section className={styles.authPagina}>
            <div className={styles.authCard}>
                <h1>Iniciar sesión</h1>

                <form
                    className={styles.formulario}
                    onSubmit={handleLogin}
                >
                    <label htmlFor="email">
                        Correo electrónico
                    </label>

                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        placeholder="Ingresá tu correo"
                        required
                    />

                    <label htmlFor="password">
                        Contraseña
                    </label>

                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        placeholder="Ingresá tu contraseña"
                        required
                    />

                    <button
                        type="submit"
                        className={styles.boton}
                    >
                        Ingresar
                    </button>

                    <p className={styles.enlace}>
                        ¿No tenés una cuenta?{" "}
                        <Link to="/registro">
                            Crear cuenta
                        </Link>
                    </p>
                </form>
            </div>
        </section>
    );
}

export default Login;