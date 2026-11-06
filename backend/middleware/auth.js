import jwt from 'jsonwebtoken'

// Protege rutas: exige cookie con token válido; si no, responde 401.
export default function requiereAdmin(req, res, next) {
  try {
    req.admin = jwt.verify(req.cookies.token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'No autorizado' })
  }
}