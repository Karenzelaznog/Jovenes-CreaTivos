import { API_URL } from './config.js'

// Pide productos al backend con los filtros activos.
export async function getProductos(filtros) {
  const params = new URLSearchParams()
  Object.entries(filtros).forEach(([k, v]) => {
    if (v !== '' && v !== null && v !== undefined) params.set(k, v)
  })
  const res = await fetch(`${API_URL}/api/productos?${params}`)
  if (!res.ok) throw new Error('No pudimos cargar los productos')
  return res.json()
}