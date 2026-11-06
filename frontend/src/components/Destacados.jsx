export default function Destacados({ elegirCategoria }) {
  return (
    <section id="destacados" className="destacados">
      <h2>Nuestras colecciones</h2>
      <div className="destacados-grid">
        <article className="destacado basic">
          <span className="etiqueta basic">BASIC</span>
          <h3>Colección BASIC</h3>
          <p>Esenciales de rutina con detalles azul cielo. Suaves, simples y accesibles.</p>
          <button className="btn btn-principal" onClick={() => elegirCategoria('skincare', 'basic')}>
            Ver BASIC
          </button>
        </article>

        <article className="destacado premium">
          <span className="etiqueta premium">PREMIUM</span>
          <h3>Colección PREMIUM</h3>
          <p>Fórmulas avanzadas con detalles azul hielo y plateados para un cuidado extra.</p>
          <button className="btn btn-principal" onClick={() => elegirCategoria('skincare', 'premium')}>
            Ver PREMIUM
          </button>
        </article>

        <article className="destacado accesorios">
          <span className="etiqueta acc">ACCESSORIES</span>
          <h3>Accesorios y combos</h3>
          <p>Cosmetiqueras, bandas, toallas, kits y colecciones para tu ritual de cuidado.</p>
          <button className="btn btn-principal" onClick={() => elegirCategoria('accesorios', '')}>
            Ver accesorios
          </button>
        </article>
      </div>
    </section>
  )
}