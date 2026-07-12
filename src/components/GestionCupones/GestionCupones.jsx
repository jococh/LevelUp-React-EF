import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import styles from "./GestionCupones.module.css";

const estadoInicial = {
  codigo: "",
  descuento: "",
};

function GestionCupones() {
  const [datosForm, setDatosForm] =
    useState(estadoInicial);

  const [cupones, setCupones] = useState([]);

  const [cuponAEditar, setCuponAEditar] =
    useState(null);

  const [cargando, setCargando] =
    useState(true);

  const [guardando, setGuardando] =
    useState(false);

  const [error, setError] =
    useState(false);

  // Obtener cupones de Firestore
  const obtenerCupones = async () => {
    try {
      setCargando(true);
      setError(false);

      const respuesta = await getDocs(
        collection(db, "cupones")
      );

      const listaCupones =
        respuesta.docs.map((documento) => ({
          id: documento.id,
          ...documento.data(),
        }));

      setCupones(listaCupones);
    } catch (error) {
      console.error(
        "Error al obtener los cupones:",
        error
      );

      setError(true);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerCupones();
  }, []);

  // Controlar los inputs
  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setDatosForm({
      ...datosForm,
      [name]: value,
    });
  };

  // Crear o actualizar un cupón
  const manejarEnvio = async (e) => {
    e.preventDefault();

    const codigoLimpio =
      datosForm.codigo
        .trim()
        .toUpperCase();

    const porcentaje =
      Number(datosForm.descuento);

    if (!codigoLimpio) {
      alert(
        "Ingresá un código para el cupón."
      );

      return;
    }

    if (
      porcentaje < 1 ||
      porcentaje > 100
    ) {
      alert(
        "El descuento debe estar entre 1 y 100."
      );

      return;
    }

    try {
      setGuardando(true);

      if (cuponAEditar) {
        const cuponRef = doc(
          db,
          "cupones",
          cuponAEditar.id
        );

        await updateDoc(cuponRef, {
          codigo: codigoLimpio,
          descuento: porcentaje,
        });

        alert(
          "Cupón actualizado correctamente."
        );
      } else {
        await addDoc(
          collection(db, "cupones"),
          {
            codigo: codigoLimpio,
            descuento: porcentaje,
          }
        );

        alert(
          "Cupón creado correctamente."
        );
      }

      setDatosForm(estadoInicial);

      setCuponAEditar(null);

      await obtenerCupones();
    } catch (error) {
      console.error(
        "Error al guardar el cupón:",
        error
      );

      alert(
        "Ocurrió un error al guardar el cupón."
      );
    } finally {
      setGuardando(false);
    }
  };

  // Cargar el cupón en el formulario
  const editarCupon = (cupon) => {
    setCuponAEditar(cupon);

    setDatosForm({
      codigo: cupon.codigo,
      descuento: cupon.descuento,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Cancelar la edición
  const cancelarEdicion = () => {
    setCuponAEditar(null);

    setDatosForm(estadoInicial);
  };

  // Eliminar un cupón
  const eliminarCupon = async (id) => {
    const confirmar = window.confirm(
      "¿Estás seguro de eliminar este cupón?"
    );

    if (!confirmar) {
      return;
    }

    try {
      await deleteDoc(
        doc(db, "cupones", id)
      );

      if (cuponAEditar?.id === id) {
        cancelarEdicion();
      }

      alert(
        "Cupón eliminado correctamente."
      );

      await obtenerCupones();
    } catch (error) {
      console.error(
        "Error al eliminar el cupón:",
        error
      );

      alert(
        "No se pudo eliminar el cupón."
      );
    }
  };

  return (
  <section className={styles.gestion}>
    <div
      className={
        styles.contenedorFormulario
      }
    >
      <h1>
        {cuponAEditar
          ? "Editar cupón"
          : "Crear cupón"}
      </h1>

      <form
        onSubmit={manejarEnvio}
        className={styles.formulario}
      >
        <label htmlFor="codigo">
          Código
        </label>

        <input
          type="text"
          id="codigo"
          name="codigo"
          value={datosForm.codigo}
          onChange={manejarCambio}
          placeholder="Ej: LEVELUP10"
          required
        />

        <label htmlFor="descuento">
          Porcentaje de descuento
        </label>

        <input
          type="number"
          id="descuento"
          name="descuento"
          value={datosForm.descuento}
          onChange={manejarCambio}
          placeholder="Ej: 10"
          min="1"
          max="100"
          required
        />

        <div
          className={
            styles.botonesFormulario
          }
        >
          <button
            type="submit"
            disabled={guardando}
            className={
              styles.botonGuardar
            }
          >
            {guardando
              ? "Guardando..."
              : cuponAEditar
                ? "Guardar cambios"
                : "Crear cupón"}
          </button>

          {cuponAEditar && (
            <button
              type="button"
              onClick={
                cancelarEdicion
              }
              disabled={guardando}
              className={
                styles.botonCancelar
              }
            >
              Cancelar edición
            </button>
          )}
        </div>
      </form>
    </div>

    <h2 className={styles.tituloLista}>
      Cupones cargados
    </h2>

    {cargando ? (
      <p className={styles.estado}>
        Cargando cupones...
      </p>
    ) : error ? (
      <p
        className={`${styles.estado} ${styles.error}`}
      >
        Ocurrió un error al cargar
        los cupones.
      </p>
    ) : cupones.length === 0 ? (
      <p className={styles.estado}>
        No hay cupones cargados.
      </p>
    ) : (
      <div
        className={styles.listaCupones}
      >
        {cupones.map((cupon) => (
          <article
            key={cupon.id}
            className={
              styles.cardCupon
            }
          >
            <h3
              className={styles.codigo}
            >
              {cupon.codigo}
            </h3>

            <p
              className={
                styles.descuento
              }
            >
              <strong>
                Descuento:
              </strong>{" "}
              {cupon.descuento}%
            </p>

            <div
              className={
                styles.botonesCard
              }
            >
              <button
                type="button"
                onClick={() =>
                  editarCupon(cupon)
                }
                className={
                  styles.botonEditar
                }
              >
                Editar
              </button>

              <button
                type="button"
                onClick={() =>
                  eliminarCupon(
                    cupon.id
                  )
                }
                className={
                  styles.botonEliminar
                }
              >
                Eliminar
              </button>
            </div>
          </article>
        ))}
      </div>
    )}
  </section>
);
}

export default GestionCupones;