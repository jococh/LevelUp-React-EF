import { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [rol, setRol] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    const cancelarObservador = onAuthStateChanged(
      auth,
      async (usuarioFirebase) => {
        setCargando(true);

        if (usuarioFirebase) {
          setUsuario(usuarioFirebase);

          try {
            const usuarioRef = doc(
              db,
              "usuarios",
              usuarioFirebase.uid
            );

            const usuarioDoc = await getDoc(usuarioRef);

            if (usuarioDoc.exists()) {
              const datosUsuario = usuarioDoc.data();

              setRol(datosUsuario.rol);

              console.log(
                "Rol del usuario:",
                datosUsuario.rol
              );
            } else {
              console.log(
                "El usuario no tiene un documento en Firestore."
              );

              setRol(null);
            }
          } catch (error) {
            console.error(
              "Error al obtener el rol:",
              error
            );

            setRol(null);
          }
        } else {
          setUsuario(null);
          setRol(null);
        }

        setCargando(false);
      }
    );

    return () => cancelarObservador();
  }, []);

  const cerrarSesion = async () => {
    const auth = getAuth();

    try {
      await signOut(auth);

      console.log(
        "Sesión cerrada correctamente."
      );
    } catch (error) {
      console.error(
        "Error al cerrar sesión:",
        error
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        rol,
        cargando,
        cerrarSesion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}