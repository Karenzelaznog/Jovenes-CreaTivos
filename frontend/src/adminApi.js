import { API_URL } from './config.js'

const CLAVE = 'skincary_token'

// El token se guarda solo mientras la pestaña esté abierta (sessionStorage)
export const guardarToken = (t) => { try { sessionStorage.setItem(CLAVE, t) } catch { /* sin storage */ } }
export const borrarToken = () => { try { sessionStorage.removeItem(CLAVE) } catch { /* sin storage */ } }
const leerToken = () => { try { return sessionStorage.getItem(CLAVE) } catch { return null } }

// Llamada a la API que envía el token del admin.
export async function pedir(ruta, { metodo = 'GET', cuerpo } = {}) {
  const headers = {}
  if (cuerpo) headers['Content-Type'] = 'application/json'
  const token = leerToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_URL}${ruta}`, {
    method: metodo,
    headers,
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