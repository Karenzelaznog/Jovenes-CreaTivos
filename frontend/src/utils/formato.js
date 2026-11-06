// Precio en pesos colombianos: 68000 -> "$68.000 COP"
export const cop = (n) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })
    .format(n)
    .replace(/\s/g, '') + ' COP'

// Ruta de imagen compatible con GitHub Pages (base de Vite)
export const rutaImagen = (img) =>
  import.meta.env.BASE_URL + (img || '/img/placeholder.svg').replace(/^\//, '')

export const irA = (id) =>
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })