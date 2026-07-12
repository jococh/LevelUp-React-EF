import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";
import FormularioCarga from "./FormularioCarga";
import styles from "./GestionProductos.module.css";

function GestionProductos() {
    const [productos, setProductos] = useState([]);
    const [productoEditar, setProductoEditar] = useState(null);

    const cargarProductos = async () => {
        try {
            const productosRef = collection(db, "productos");

            const resp = await getDocs(productosRef);

            const listaProductos = resp.docs.map((doc) => ({
                firebaseId: doc.id,
                ...doc.data(),
            }));

            setProductos(listaProductos);

        } catch (error) {
            console.error("Error al cargar productos:", error);
        }
    };

    useEffect(() => {
        cargarProductos();
    }, []);

    const handleDelete = async (firebaseId) => {

        const confirmar = window.confirm(
            "¿Estás seguro de eliminar este producto?"
        );

        if (!confirmar) return;

        try {

            const productoRef = doc(db, "productos", firebaseId);

            await deleteDoc(productoRef);

            alert("Producto eliminado correctamente.");

            cargarProductos();

        } catch (error) {

            console.error(error);

            alert("No se pudo eliminar el producto.");

        }
    };

    return (
        <section className={styles.gestion}>

            <FormularioCarga
                productoEditar={productoEditar}
                cargarProductos={cargarProductos}
                setProductoEditar={setProductoEditar}
            />

            <h2 className={styles.titulo}>
                Productos cargados
            </h2>

            <div className={styles.listaProductos}>

                {productos.length === 0 ? (

                    <p>No hay productos cargados.</p>

                ) : (

                    productos.map((producto) => (

                        <div
                            key={producto.firebaseId}
                            className={styles.cardProducto}
                        >

                            <img
                                src={producto.imagen}
                                alt={producto.nombre}
                                className={styles.imagen}
                            />

                            <h3>{producto.nombre}</h3>

                            <p>
                                <strong>Categoría:</strong>{" "}
                                {producto.categoria}
                            </p>

                            <p>
                                <strong>Precio:</strong> ${producto.precio}
                            </p>

                            <p>
                                <strong>Stock:</strong> {producto.stock}
                            </p>

                            <p>
                                <strong>Destacado:</strong>{" "}
                                {producto.destacado ? "⭐ Sí" : "❌ No"}
                            </p>

                            <div className={styles.botones}>

                                <button
                                    className={styles.editar}
                                    onClick={() =>
                                        setProductoEditar(producto)
                                    }
                                >
                                    Editar
                                </button>

                                <button
                                    className={styles.eliminar}
                                    onClick={() =>
                                        handleDelete(producto.firebaseId)
                                    }
                                >
                                    Eliminar
                                </button>

                            </div>

                        </div>

                    ))

                )}

            </div>

        </section>
    );
}

export default GestionProductos;