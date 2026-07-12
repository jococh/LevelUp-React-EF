import { useEffect, useState } from "react";
import Item from "../Item/Item";
import { collection, getDocs} from "firebase/firestore";
import { db } from "../../firebase/config";
import styles from "./ItemListContainer.module.css";

function ItemListContainer() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const productosCollection = collection(
      db,
      "productos"
    );

    getDocs(productosCollection)
      .then((resp) => {
        const listaProductos = resp.docs.map(
          (documento) => ({
            firebaseId: documento.id,
            ...documento.data(),
          })
        );

        setProductos(listaProductos);
      })
      .catch((error) => {
        console.error(
          "Error al cargar los productos:",
          error
        );

        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className={styles.estado}>
        <div
          className={styles.spinner}
          aria-hidden="true"
        ></div>

        <h2>Cargando productos...</h2>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.estado}>
        <h2 className={styles.error}>
          Ocurrió un error al cargar los productos.
        </h2>

        <p>
          Intentá actualizar la página.
        </p>
      </section>
    );
  }

  return (
    <section className="productos">
      {productos.map((producto) => (
        <Item
          key={producto.firebaseId}
          producto={producto}
        />
      ))}
    </section>
  );
}

export default ItemListContainer;