import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";
import styles from "./Item.module.css";

function Item({ producto }) {
  const [esFavorito, setEsFavorito] = useState(false);

  const { addToCart, getCantidadActual } = useCart();

  const [cantidad, setCantidad] = useState(1);

  const cantidadActual = getCantidadActual(producto.firebaseId);

  const marcarComoFavorito = () => {
    setEsFavorito(!esFavorito);
  };

  const incrementar = () => {
    if (cantidad < producto.stock) {
      setCantidad(cantidad + 1);
    }
  };

  const decrementar = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(producto, cantidad);
  };

  return (
    <div className={styles.card}>
      <button
        type="button"
        onClick={marcarComoFavorito}
        className={styles.favorito}
        aria-label="Marcar como favorito"
      >
        {esFavorito ? "★" : "☆"}
      </button>

      <img
        src={producto.imagen}
        alt={producto.nombre}
        className={styles.imagen}
      />

      <h3>{producto.nombre}</h3>

      <p className={styles.precio}>
        ${producto.precio}
      </p>

      <p>{producto.descripcion}</p>

      <Link to={`/producto/${producto.firebaseId}`}>
        Ver detalle
      </Link>
      
      <div className={styles.contador}>
        <button type="button" onClick={decrementar}>
          -
        </button>

        <span>{cantidad}</span>

        <button type="button" onClick={incrementar}>
          +
        </button>
      </div>

      <button
        type="button"
        onClick={handleAddToCart}
        className={styles.botonCarrito}
      >
        Agregar al carrito
      </button>

      <p className={styles.cantidadCarrito}>
        Unidades en carrito: {cantidadActual}
      </p>

    </div>
  );
}

export default Item;