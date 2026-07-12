import { useState } from "react";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import styles from "./Auth.module.css";

function Registro() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmarPassword, setConfirmarPassword] =
        useState("");

    const navigate = useNavigate();

    const handleRegistro = async (e) => {
        e.preventDefault();

        if (password !== confirmarPassword) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        try {
            const auth = getAuth();

            const credencialUsuario =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            const usuarioCreado = credencialUsuario.user;

            await setDoc(
                doc(db, "usuarios", usuarioCreado.uid),
                {
                    email: usuarioCreado.email,
                    rol: "user",
                }
            );

            alert("Usuario registrado correctamente.");

            navigate("/");
        } catch (error) {
            console.error(
                "Error al registrar el usuario:",
                error.code,
                error.message
            );

            if (error.code === "auth/email-already-in-use") {
                alert("Ya existe una cuenta con ese correo.");
            } else if (error.code === "auth/weak-password") {
                alert(
                    "La contraseña debe tener al menos 6 caracteres."
                );
            } else if (error.code === "auth/invalid-email") {
                alert("El correo electrónico no es válido.");
            } else {
                alert("No se pudo registrar el usuario.");
            }
        }
    };

    return (
        <section className={styles.authPagina}>
            <div className={styles.authCard}>
                <h1>Crear cuenta</h1>

                <form
                    className={styles.formulario}
                    onSubmit={handleRegistro}
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
                        placeholder="Mínimo 6 caracteres"
                        minLength="6"
                        required
                    />

                    <label htmlFor="confirmarPassword">
                        Confirmar contraseña
                    </label>

                    <input
                        type="password"
                        id="confirmarPassword"
                        value={confirmarPassword}
                        onChange={(e) =>
                            setConfirmarPassword(e.target.value)
                        }
                        placeholder="Repetí la contraseña"
                        minLength="6"
                        required
                    />

                    <button
                        type="submit"
                        className={styles.boton}
                    >
                        Registrarme
                    </button>
                </form>
            </div>
        </section>
    );
}

export default Registro;