import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (
    producto,
    cantidad = 1
  ) => {
    const productoEnCarrito = cart.find(
      (item) =>
        item.firebaseId ===
        producto.firebaseId
    );

    if (productoEnCarrito) {
      const carritoActualizado = cart.map(
        (item) =>
          item.firebaseId ===
          producto.firebaseId
            ? {
                ...item,
                cantidad:
                  item.cantidad +
                  cantidad,
              }
            : item
      );

      setCart(carritoActualizado);
    } else {
      setCart([
        ...cart,
        {
          ...producto,
          cantidad,
        },
      ]);
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const removeItem = (firebaseId) => {
    const carritoActualizado =
      cart.filter(
        (item) =>
          item.firebaseId !==
          firebaseId
      );

    setCart(carritoActualizado);
  };

  const actualizarCantidad = (
    firebaseId,
    nuevaCantidad
  ) => {
    if (nuevaCantidad < 1) {
      return;
    }

    setCart((carritoActual) =>
      carritoActual.map((item) =>
        item.firebaseId === firebaseId
          ? {
              ...item,
              cantidad: nuevaCantidad,
            }
          : item
      )
    );
  };

  const getCartQuantity = () => {
    return cart.reduce(
      (total, item) =>
        total + item.cantidad,
      0
    );
  };

  const getCartTotal = () => {
    return cart.reduce(
      (total, item) =>
        total +
        item.precio *
          item.cantidad,
      0
    );
  };

  const getCantidadActual = (
    firebaseId
  ) => {
    const item = cart.find(
      (item) =>
        item.firebaseId === firebaseId
    );

    return item
      ? item.cantidad
      : 0;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        clearCart,
        removeItem,
        actualizarCantidad,
        getCartQuantity,
        getCartTotal,
        getCantidadActual,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}