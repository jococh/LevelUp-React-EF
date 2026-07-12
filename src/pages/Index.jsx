import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "../firebase/config";
import styles from "./Index.module.css";

function Index() {
  const [productosDestacados, setProductosDestacados] =
    useState([]);

  const [cargando, setCargando] = useState(true);

  const [error, setError] = useState(false);

  useEffect(() => {
    const obtenerProductosDestacados = async () => {
      try {
        setCargando(true);
        setError(false);

        const consultaDestacados = query(
          collection(db, "productos"),
          where("destacado", "==", true)
        );

        const respuesta = await getDocs(
          consultaDestacados
        );

        const listaDestacados =
          respuesta.docs.map((documento) => ({
            firebaseId: documento.id,
            ...documento.data(),
          }));

        setProductosDestacados(
          listaDestacados
        );
      } catch (error) {
        console.error(
          "Error al cargar los productos destacados:",
          error
        );

        setError(true);
      } finally {
        setCargando(false);
      }
    };

    obtenerProductosDestacados();
  }, []);

  return (
    <>
      <section className={styles.hero}>
        <h1>Bienvenido a Level Up</h1>

        <p>
          🚀 ¿Querés agregar un nuevo juego a tu
          colección? Mirá nuestro catálogo y
          encontrá tus próximos favoritos. 🚀
        </p>

        <Link
          to="/productos"
          className={styles.boton}
        >
          Ver Productos
        </Link>
      </section>

      <section className={styles.populares}>
        <h2>Productos destacados:</h2>

        {cargando ? (
          <p>Cargando productos destacados...</p>
        ) : error ? (
          <p>
            No se pudieron cargar los productos
            destacados.
          </p>
        ) : productosDestacados.length === 0 ? (
          <p>
            Todavía no hay productos destacados.
          </p>
        ) : (
          <div
            className={
              styles.popularesContainer
            }
          >
            {productosDestacados.map(
              (producto) => (
                <Link
                  key={producto.firebaseId}
                  to={`/producto/${producto.firebaseId}`}
                  className={
                    styles.popularCard
                  }
                >
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                  />

                  <h3>
                    {producto.nombre}
                  </h3>
                </Link>
              )
            )}
          </div>
        )}
      </section>
    </>
  );
}

export default Index;