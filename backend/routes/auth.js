import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'
import requiereAdmin from '../middleware/auth.js'

const router = Router()

// Máximo 10 intentos de login cada 10 minutos por IP (frena adivinar claves)
const intentos = new Map()
function bloqueado(ip) {
  const ahora = Date.now()
  const lista = (intentos.get(ip) || []).filter((t) => ahora - t < 10 * 60 * 1000)
  lista.push(ahora)
  intentos.set(ip, lista)
  return lista.length > 10
}

// POST /api/auth/login  { usuario, clave } -> { ok, token }
router.post('/login', (req, res) => {
  if (bloqueado(req.ip)) {
    return res.status(429).json({ error: 'Demasiados intentos. Espera unos minutos.' })
  }
  const { usuario, clave } = req.body
  const fila = db.prepare('SELECT * FROM usuarios WHERE usuario = ?').get(usuario)

  if (!fila || !bcrypt.compareSync(clave || '', fila.clave_hash)) {
    return res.status(401).json({ error: 'Usuario o contraseña incorrectos' })
  }

  const token = jwt.sign({ id: fila.id }, process.env.JWT_SECRET, { expiresIn: '2h' })
  res.json({ ok: true, token })
})

router.post('/logout', (req, res) => res.json({ ok: true }))

// GET /api/auth/me -> el frontend lo usa para saber si la sesión sigue válida
router.get('/me', requiereAdmin, (req, res) => res.json({ ok: true }))

export default router