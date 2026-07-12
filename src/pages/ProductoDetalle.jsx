import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import styles from "./ProductoDetalle.module.css";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

function ProductoDetalle() {
  const { id } = useParams();

  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [cantidad, setCantidad] = useState(1);

  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    setError(false);

    const productoRef = doc(db, "productos", id);

    getDoc(productoRef)
      .then((resp) => {
        if (resp.exists()) {
          setProducto({
            firebaseId: resp.id,
            ...resp.data(),
          });
        } else {
          setProducto(null);
        }
      })
      .catch((error) => {
        console.error("Error al cargar el detalle del producto:", error);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleAgregarCarrito = () => {
    addToCart(producto, 1);
    alert(`${producto.nombre} se agregó al carrito`);
  };

  if (loading) {
    return (
      <section className={styles.detalle}>
        <h2>Cargando detalle del producto...</h2>
      </section>
    );
  }

  const aumentarCantidad = () => {
    if (cantidad < producto.stock) {
      setCantidad(cantidad + 1);
    }
  };

  const disminuirCantidad = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1);
    }
  };

  if (error) {
    return (
      <section className={styles.detalle}>
        <h2>Ocurrió un error al cargar el producto</h2>
        <Link to="/productos" className={styles.volver}>
          Volver a productos
        </Link>
      </section>
    );
  }

  if (!producto) {
    return (
      <section className={styles.detalle}>
        <h2>Producto no encontrado</h2>
        <Link to="/productos" className={styles.volver}>
          Volver a productos
        </Link>
      </section>
    );
  }

  return (
    <section className={styles.detalle}>
      <div className={styles.card}>
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className={styles.imagen}
        />

        <div className={styles.info}>
          <h1>{producto.nombre}</h1>

          <p>{producto.descripcion}</p>

          <h2>${producto.precio}</h2>

          <div className={styles.contador}>
            <button
              type="button"
              onClick={disminuirCantidad}
              disabled={cantidad === 1}
            >
              −
            </button>

            <span>{cantidad}</span>

            <button
              type="button"
              onClick={aumentarCantidad}
              disabled={cantidad >= producto.stock}
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={() => addToCart(producto, cantidad)}
            className={styles.botonCarrito}
          >
            Agregar al carrito
          </button>

          <Link to="/productos" className={styles.volver}>
            ← Volver a productos
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ProductoDetalle;