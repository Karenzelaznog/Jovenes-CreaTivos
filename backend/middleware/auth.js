import jwt from 'jsonwebtoken'

// Protege rutas: acepta el token en el encabezado Authorization (o en cookie, por compatibilidad).
export default function requiereAdmin(req, res, next) {
  try {
    const cab = req.headers.authorization || ''
    const token = cab.startsWith('Bearer ') ? cab.slice(7) : req.cookies?.token
    req.admin = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'No autorizado' })
  }
}