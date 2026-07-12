import { useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useCart } from "../context/CartContext";
import { db } from "../firebase/config";
import styles from "./Carrito.module.css";

function Carrito() {
  const {
    cart,
    clearCart,
    removeItem,
    actualizarCantidad,
    getCartTotal,
  } = useCart();

  const [codigoIngresado, setCodigoIngresado] =
    useState("");

  const [cuponAplicado, setCuponAplicado] =
    useState(null);

  const [aplicandoCupon, setAplicandoCupon] =
    useState(false);

  const subtotal = getCartTotal();

  const montoDescuento = cuponAplicado
    ? subtotal * cuponAplicado.descuento / 100
    : 0;

  const totalFinal =
    subtotal - montoDescuento;

  const aplicarCupon = async (e) => {
    e.preventDefault();

    const codigoLimpio = codigoIngresado
      .trim()
      .toUpperCase();

    if (!codigoLimpio) {
      alert(
        "Ingresá un código de descuento."
      );

      return;
    }

    try {
      setAplicandoCupon(true);

      const consultaCupon = query(
        collection(db, "cupones"),
        where(
          "codigo",
          "==",
          codigoLimpio
        )
      );

      const respuesta = await getDocs(
        consultaCupon
      );

      if (respuesta.empty) {
        setCuponAplicado(null);

        alert(
          "El cupón ingresado no es válido."
        );

        return;
      }

      const datosCupon =
        respuesta.docs[0].data();

      setCuponAplicado({
        codigo: datosCupon.codigo,
        descuento:
          Number(datosCupon.descuento),
      });

      setCodigoIngresado("");

      alert(
        `Cupón aplicado: ${datosCupon.descuento}% de descuento.`
      );
    } catch (error) {
      console.error(
        "Error al aplicar el cupón:",
        error
      );

      alert(
        "Ocurrió un error al verificar el cupón."
      );
    } finally {
      setAplicandoCupon(false);
    }
  };

  const quitarCupon = () => {
    setCuponAplicado(null);
    setCodigoIngresado("");
  };

  const finalizarCompra = () => {
    alert(
      `¡Gracias por tu compra! Total: $${totalFinal}`
    );

    clearCart();
    setCuponAplicado(null);
  };

  if (cart.length === 0) {
    return (
      <section
        className={styles.carritoVacio}
      >
        <h1>Tu carrito está vacío</h1>

        <p>
          Agregá juegos desde la tienda
          para continuar.
        </p>

        <Link
          to="/productos"
          className={styles.boton}
        >
          Ir a la tienda
        </Link>
      </section>
    );
  }

  return (
    <section className={styles.carrito}>
      <h1>Mi Carrito</h1>

      <div className={styles.contenedor}>
        <div className={styles.tabla}>
          <div
            className={styles.encabezado}
          >
            <p>Producto</p>
            <p>Precio</p>
            <p>Cantidad</p>
            <p>Subtotal</p>
            <p></p>
          </div>

          {cart.map((producto) => (
            <div
              key={producto.firebaseId}
              className={styles.fila}
            >
              <div
                className={styles.producto}
              >
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                />

                <div>
                  <h2>
                    {producto.nombre}
                  </h2>

                  <p>Juego digital</p>
                </div>
              </div>

              <p>
                ${producto.precio}
              </p>

              <div className={styles.controlCantidad}>
                <button
                  type="button"
                  onClick={() =>
                    actualizarCantidad(
                      producto.firebaseId,
                      producto.cantidad - 1
                    )
                  }
                  disabled={producto.cantidad <= 1}
                  aria-label={`Disminuir cantidad de ${producto.nombre}`}
                >
                  −
                </button>

                <span>{producto.cantidad}</span>

                <button
                  type="button"
                  onClick={() =>
                    actualizarCantidad(
                      producto.firebaseId,
                      producto.cantidad + 1
                    )
                  }
                  aria-label={`Aumentar cantidad de ${producto.nombre}`}
                >
                  +
                </button>
              </div>

              <p>
                $
                {producto.precio *
                  producto.cantidad}
              </p>

              <button
                type="button"
                onClick={() =>
                  removeItem(
                    producto.firebaseId
                  )
                }
                className={
                  styles.botonEliminar
                }
                aria-label={`Eliminar ${producto.nombre} del carrito`}
              >
                🗑
              </button>
            </div>
          ))}

          <div
            className={styles.acciones}
          >
            <Link
              to="/productos"
              className={
                styles.botonSecundario
              }
            >
              Seguir comprando
            </Link>

            <button
              type="button"
              onClick={clearCart}
              className={
                styles.botonVaciar
              }
            >
              Vaciar carrito
            </button>
          </div>
        </div>

        <aside
          className={styles.resumen}
        >
          <div
            className={styles.totalBox}
          >
            <h2>
              Resumen de compra
            </h2>

            <form
              onSubmit={aplicarCupon}
              className={
                styles.formularioCupon
              }
            >
              <label
                htmlFor="codigoCupon"
              >
                Código de descuento
              </label>

              <div
                className={
                  styles.cuponControles
                }
              >
                <input
                  type="text"
                  id="codigoCupon"
                  value={codigoIngresado}
                  onChange={(e) =>
                    setCodigoIngresado(
                      e.target.value
                    )
                  }
                  placeholder="Ej: LEVELUP10"
                  disabled={
                    aplicandoCupon
                  }
                />

                <button
                  type="submit"
                  disabled={
                    aplicandoCupon
                  }
                >
                  {aplicandoCupon
                    ? "Aplicando..."
                    : "Aplicar"}
                </button>
              </div>
            </form>

            {cuponAplicado && (
              <div
                className={
                  styles.cuponAplicado
                }
              >
                <p>
                  Cupón{" "}
                  <strong>
                    {
                      cuponAplicado.codigo
                    }
                  </strong>{" "}
                  aplicado
                </p>

                <button
                  type="button"
                  onClick={quitarCupon}
                >
                  Quitar cupón
                </button>
              </div>
            )}

            <div
              className={
                styles.totalLinea
              }
            >
              <span>Subtotal</span>

              <strong>
                ${subtotal}
              </strong>
            </div>

            {cuponAplicado && (
              <div
                className={
                  styles.totalLinea
                }
              >
                <span>
                  Descuento (
                  {
                    cuponAplicado.descuento
                  }
                  %)
                </span>

                <strong>
                  -$
                  {montoDescuento}
                </strong>
              </div>
            )}

            <div
              className={
                styles.totalLinea
              }
            >
              <span>Total</span>

              <strong>
                ${totalFinal}
              </strong>
            </div>

            <button
              type="button"
              onClick={
                finalizarCompra
              }
              className={
                styles.botonPago
              }
            >
              Finalizar compra
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default Carrito;