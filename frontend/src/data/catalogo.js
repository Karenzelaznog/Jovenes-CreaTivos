const skincare = [
  ['01', 'Escudo Diario SPF 50', 68000, 'Protector solar facial. Envase blanco con detalles azul cielo.'],
  ['02', 'CinnaShield Ultra SPF 50+', 89000, 'Protector solar facial. Azul hielo con detalles plateados.'],
  ['03', 'Espuma Suave Limpiadora', 52000, 'Limpiador facial en espuma. Envase blanco y azul pastel.'],
  ['04', 'CinnaCloud Deep Clean', 72000, 'Limpiador facial premium con detalles plateados.'],
  ['05', 'Hidratante Ligero 24H', 59000, 'Crema hidratante facial. Envase blanco con azul cielo.'],
  ['06', 'CinnaCloud Hydro Barrier', 82000, 'Hidratante facial premium. Envase blanco y azul hielo.'],
  ['07', 'CinnaSoft Rice Scrub', 45000, 'Exfoliante facial de arroz. Envase pequeño y elegante.'],
  ['08', 'CinnaGlow Renewal', 69000, 'Exfoliante facial premium. Envase elegante.'],
  ['09', 'CinnaMilk Soft Mask', 39000, 'Mascarilla facial suave. Envase blanco con azul pastel.'],
  ['10', 'CinnaDream Hydro Mask', 58000, 'Mascarilla facial hidratante. Presentación premium.'],
  ['11', 'CinnaBright Vitamin Serum', 55000, 'Sérum facial con vitaminas. Frasco con gotero.'],
  ['12', 'CinnaBright Radiance Pro', 85000, 'Sérum facial premium. Gotero con detalles plateados.'],
  ['13', 'CinnaFresh Balance Toner', 42000, 'Tónico facial. Botella blanca y azul cielo.'],
  ['14', 'CinnaBalance Niacin Toner', 65000, 'Tónico facial premium. Botella elegante.'],
  ['15', 'CinnaEyes Soft Cream', 48000, 'Crema para el contorno de ojos. Envase pequeño y delicado.'],
  ['16', 'CinnaEyes Revive Peptide', 75000, 'Tratamiento premium para contorno de ojos.'],
  ['17', 'CinnaPure Clay Mask', 43000, 'Mascarilla de arcilla. Envase tipo tarro.'],
  ['18', 'CinnaPure Detox Complex', 62000, 'Mascarilla facial premium. Envase azul hielo.'],
  ['19', 'CinnaLips Sweet Balm', 25000, 'Bálsamo labial. Envase pequeño, bonito y práctico.'],
  ['20', 'CinnaLips Repair Butter', 39000, 'Bálsamo labial reparador. Presentación premium.'],
]

const accesorios = [
  ['01', 'SkinnaRoll Cloud Pouch', 35000, 'Cosmetiquera pequeña con diseño de nube.'],
  ['02', 'CinnaSkin Dream Band', 22000, 'Banda para recoger el cabello durante la rutina facial.'],
  ['03', 'SkinCinna Soft Scrunchie', 15000, 'Coletero de tela suave.'],
  ['04', 'CinnaRoll Beauty Case', 48000, 'Cosmetiquera de mayor tamaño.'],
  ['05', 'CinnaCloud Wristies', 18000, 'Muñequeras para que el agua no baje por los brazos al lavarte la cara.'],
  ['06', 'SkinnaRoll Face Towel', 20000, 'Toalla facial suave.'],
  ['07', 'CinnaMirror Glow', 19000, 'Espejo compacto.'],
  ['08', 'SkinCinna Mask Brush', 16000, 'Brocha para aplicar mascarillas.'],
  ['09', 'CinnaCloud Hair Clip', 17000, 'Pinza para el cabello.'],
  ['10', 'SkinnaRoll Travel Drops', 28000, 'Envases pequeños para llevar tus productos en viajes.'],
  ['11', 'CinnaSoft Beauty Sponge', 14000, 'Esponja suave de belleza.'],
  ['12', 'SkinCinna Hair Cloud', 29000, 'Toalla tipo turbante para el cabello.'],
  ['13', 'CinnaGlow Organizer', 32000, 'Organizador de productos de belleza.'],
  ['14', 'SkinnaRoll Sleep Mask', 24000, 'Antifaz suave para dormir.'],
  ['15', 'CinnaSkin Spa Gloves', 21000, 'Guantes suaves para rutinas de cuidado personal.'],
  ['16', 'CinnaSkin Spa Day Set', 38000, 'Combo: banda para el cabello y muñequeras.'],
  ['17', 'SkinnaRoll Travel Beauty Kit', 55000, 'Kit: cosmetiquera pequeña, toalla facial y coletero.'],
  ['18', 'CinnaGlow Facial Ritual', 39000, 'Kit: brocha para mascarillas, espejo compacto y esponja.'],
  ['19', 'CinnaCloud Hair Care Duo', 43000, 'Dúo: turbante para el cabello y pinza.'],
  ['20', 'SkinnaRoll Dream Collection', 69000, 'Colección: cosmetiquera grande, antifaz y organizador pequeño.'],
]

const crearProducto = ([numero, nombre, precio, descripcion], categoria) => ({
  id: `catalogo-${categoria}-${numero}`,
  numero,
  categoria,
  coleccion: categoria === 'skincare' ? (Number(numero) % 2 ? 'basic' : 'premium') : null,
  nombre,
  precio,
  descripcion,
  imagen: `/img/${categoria === 'skincare' ? 'skincare' : 'accesorio'}-${numero}.jpg`,
  disponible: 1,
})

const catalogo = [
  ...skincare.map((producto) => crearProducto(producto, 'skincare')),
  ...accesorios.map((producto) => crearProducto(producto, 'accesorios')),
]

export function filtrarCatalogo(filtros) {
  const q = filtros.q?.trim().toLocaleLowerCase('es-CO') ?? ''

  return catalogo.filter((producto) => {
    const coincideTexto = !q || `${producto.nombre} ${producto.descripcion}`.toLocaleLowerCase('es-CO').includes(q)
    const coincideCategoria = !filtros.categoria || producto.categoria === filtros.categoria
    const coincideColeccion = !filtros.coleccion || producto.coleccion === filtros.coleccion
    const coincideMinimo = !filtros.min || producto.precio >= Number(filtros.min)
    const coincideMaximo = !filtros.max || producto.precio <= Number(filtros.max)

    return coincideTexto && coincideCategoria && coincideColeccion && coincideMinimo && coincideMaximo
  })
}
