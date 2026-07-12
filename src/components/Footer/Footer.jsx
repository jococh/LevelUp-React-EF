import { useEffect, useState } from "react";
import styles from "./Footer.module.css";

function Footer() {
  const [equipo, setEquipo] = useState([]);

  useEffect(() => {
    fetch("/data/nosotros.json")
      .then((response) => response.json())
      .then((data) => {
        setEquipo(data);
      });
  }, []);

  return (
    <footer className={styles.footer}>
      <div className={styles.contenedor}>
        <section className={styles.infoEmpresa}>
          <h2>level up</h2>

          <p>
            Tienda online de videojuegos físicos. Sumamos títulos
            clásicos y actuales para que amplíes tu colección gamer.
          </p>
        </section>

        <section className={styles.equipo}>
          <h3>Nuestro equipo</h3>

          <div className={styles.cards}>
            {equipo.map((persona) => (
              <article key={persona.id} className={styles.card}>
                <h4>{persona.nombre}</h4>
                <p>{persona.puesto}</p>
                <small>{persona.email}</small>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className={styles.linea}></div>

      <p className={styles.copy}>
        © 2026 Level Up - Todos los derechos reservados.
      </p>
    </footer>
  );
}

export default Footer;