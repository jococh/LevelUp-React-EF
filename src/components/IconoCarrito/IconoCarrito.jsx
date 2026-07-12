import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import styles from "./IconoCarrito.module.css";

function IconoCarrito() {
  const { getCartQuantity } = useCart();

  const cantidadTotal = getCartQuantity();

  return (
    <Link to="/carrito" className={styles.icono}>
      🛒

      {cantidadTotal > 0 && (
        <span className={styles.numero}>
          {cantidadTotal}
        </span>
      )}
    </Link>
  );
}

export default IconoCarrito;