import { useState, useEffect, useRef } from "react";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import styles from "./FormularioCarga.module.css";

function FormularioCarga({
    productoEditar,
    cargarProductos,
    setProductoEditar,
}) {
    const [producto, setProducto] = useState({
        nombre: "",
        precio: "",
        stock: "",
        categoria: "",
        descripcion: "",
        imagen: "",
        destacado: false,
    });

    const [imagenFile, setImagenFile] = useState(null);
    const [imagenPreview, setImagenPreview] = useState("");
    const [guardando, setGuardando] = useState(false);
    const tituloRef = useRef(null);

    useEffect(() => {
        if (productoEditar) {
            setProducto({
                nombre: productoEditar.nombre,
                precio: productoEditar.precio,
                stock: productoEditar.stock,
                categoria: productoEditar.categoria,
                descripcion: productoEditar.descripcion,
                imagen: productoEditar.imagen,
                destacado: productoEditar.destacado,
            });

            setImagenPreview(productoEditar.imagen);
            setImagenFile(null);
        }
    }, [productoEditar]);

    useEffect(() => {
        if (productoEditar) {
            tituloRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }, [productoEditar]);

    const manejarCambio = (e) => {
        const { name, value } = e.target;

        setProducto({
            ...producto,
            [name]: value,
        });
    };

    const manejarImagen = (e) => {
        const archivo = e.target.files[0];

        if (!archivo) return;

        setImagenFile(archivo);
        setImagenPreview(URL.createObjectURL(archivo));
    };

    const limpiarFormulario = () => {
        setProducto({
            nombre: "",
            precio: "",
            stock: "",
            categoria: "",
            descripcion: "",
            imagen: "",
            destacado: false,
        });

        setImagenFile(null);
        setImagenPreview("");

        if (setProductoEditar) {
            setProductoEditar(null);
        }
    };

    const subirImagen = async () => {
        if (!imagenFile) {
            return producto.imagen;
        }

        const apiKey = "d1ed5a9035594b69c4f6070bc3d94006";

        const formData = new FormData();
        formData.append("image", imagenFile);

        const respuesta = await fetch(
            `https://api.imgbb.com/1/upload?key=${apiKey}`,
            {
                method: "POST",
                body: formData,
            }
        );

        const datos = await respuesta.json();

        if (!datos.success) {
            throw new Error("No se pudo subir la imagen.");
        }

        return datos.data.url;
    };

    const crearProducto = async () => {
        const urlImagen = await subirImagen();

        const nuevoProducto = {
            ...producto,
            precio: Number(producto.precio),
            stock: Number(producto.stock),
            imagen: urlImagen,
        };

        const productosCollection = collection(db, "productos");

        await addDoc(productosCollection, nuevoProducto);
    };

    const actualizarProducto = async () => {
        const urlImagen = await subirImagen();

        const productoActualizado = {
            ...producto,
            precio: Number(producto.precio),
            stock: Number(producto.stock),
            imagen: urlImagen,
        };

        const productoRef = doc(
            db,
            "productos",
            productoEditar.firebaseId
        );

        await updateDoc(productoRef, productoActualizado);
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();

        if (Number(producto.stock) < 0) {
            alert("El stock no puede ser menor que 0.");
            return;
        }

        if (Number(producto.precio) <= 0) {
            alert("El precio debe ser mayor que 0.");
            return;
        }

        try {
            setGuardando(true);

            if (productoEditar) {
                await actualizarProducto();

                alert("Producto actualizado correctamente.");
            } else {
                await crearProducto();

                alert("Producto cargado correctamente.");
            }

            limpiarFormulario();

            if (cargarProductos) {
                await cargarProductos();
            }
        } catch (error) {
            console.error(
                "Error al guardar el producto:",
                error
            );

            alert(
                "Ocurrió un error al guardar el producto."
            );
        } finally {
            setGuardando(false);
        }
    };

    return (
        <section className={styles.cargarProducto}>
            <h1 ref={tituloRef}>
                {productoEditar ? "Editar producto" : "Cargar producto"}
            </h1>

            <form
                className={styles.formulario}
                onSubmit={manejarEnvio}
            >
                <label>Nombre del producto</label>

                <input
                    type="text"
                    name="nombre"
                    value={producto.nombre}
                    onChange={manejarCambio}
                    required
                />

                <label>Precio</label>

                <input
                    type="number"
                    name="precio"
                    value={producto.precio}
                    onChange={manejarCambio}
                    min="1"
                    step="1"
                    required
                />

                <label>Stock</label>

                <input
                    type="number"
                    name="stock"
                    value={producto.stock}
                    onChange={manejarCambio}
                    min="0"
                    step="1"
                    required
                />

                <label>Categoría</label>

                <select
                    name="categoria"
                    value={producto.categoria}
                    onChange={manejarCambio}
                    required
                >
                    <option value="">Seleccioná una categoría</option>
                    <option value="PlayStation">PlayStation</option>
                    <option value="Xbox">Xbox</option>
                    <option value="Nintendo">Nintendo</option>
                    <option value="PC">PC</option>
                </select>

                <label className={styles.checkbox}>
                    <input
                        type="checkbox"
                        checked={producto.destacado}
                        onChange={(e) =>
                            setProducto({
                                ...producto,
                                destacado: e.target.checked,
                            })
                        }
                    />
                    Producto destacado
                </label>

                <label>Descripción</label>

                <textarea
                    name="descripcion"
                    value={producto.descripcion}
                    onChange={manejarCambio}
                    rows="5"
                    required
                />

                <label>Imagen</label>

                <input
                    type="file"
                    accept="image/*"
                    onChange={manejarImagen}
                />

                {imagenPreview && (
                    <div className={styles.preview}>
                        <p>Vista previa</p>

                        <img
                            src={imagenPreview}
                            alt="Vista previa"
                        />
                    </div>
                )}

                <button
                    type="submit"
                    disabled={guardando}
                >
                    {guardando ? (
                        <>
                            <span className={styles.spinnerBoton}></span>

                            {productoEditar
                                ? "Guardando cambios..."
                                : "Cargando producto..."}
                        </>
                    ) : productoEditar ? (
                        "Guardar cambios"
                    ) : (
                        "Cargar producto"
                    )}
                </button>
            </form>
        </section>
    );
}

export default FormularioCarga;