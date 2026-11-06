import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'

const router = Router()

// POST /api/auth/login  { usuario, clave }
router.post('/login', (req, res) => {
  const { usuario, clave } = req.body
  const fila = db.prepare('SELECT * FROM usuarios WHERE usuario = ?').get(usuario)

  if (!fila || !bcrypt.compareSync(clave || '', fila.clave_hash)) {
    return res.status(401).json({ error: 'Usuario o contraseña incorrectos' })
  }

  const token = jwt.sign({ id: fila.id }, process.env.JWT_SECRET, { expiresIn: '2h' })
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',   // en producción con dominios distintos: 'none' + secure: true
    secure: false,
    maxAge: 2 * 60 * 60 * 1000,
  })
  res.json({ ok: true })
})

router.post('/logout', (req, res) => {
  res.clearCookie('token')
  res.json({ ok: true })
})

// GET /api/auth/me -> el frontend lo usa para saber si hay sesión
router.get('/me', (req, res) => {
  try {
    jwt.verify(req.cookies.token, process.env.JWT_SECRET)
    res.json({ ok: true })
  } catch {
    res.status(401).json({ ok: false })
  }
})

export default router