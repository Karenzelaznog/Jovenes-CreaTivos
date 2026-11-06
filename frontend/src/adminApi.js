import { API_URL } from './config.js'

// Llamada a la API que envía la cookie de sesión del admin.
export async function pedir(ruta, { metodo = 'GET', cuerpo } = {}) {
  const res = await fetch(`${API_URL}${ruta}`, {
    method: metodo,
    credentials: 'include',
    headers: cuerpo ? { 'Content-Type': 'application/json' } : undefined,
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  })
  const datos = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(datos.error || 'Error en la solicitud')
    err.status = res.status
    throw err
  }
  return datos
}