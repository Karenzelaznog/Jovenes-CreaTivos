import { Router } from 'express'
import db from '../db.js'

const router = Router()

const emailValido = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

// POST /api/contacto -> valida y guarda el mensaje
router.post('/', (req, res) => {
  const { nombre, email, mensaje } = req.body ?? {}
  const errores = {}

  // El backend valida siempre, aunque el frontend ya lo haga
  if (!nombre || nombre.trim().length < 2) errores.nombre = 'Escribe tu nombre'
  if (!email || !emailValido(email.trim())) errores.email = 'Escribe un correo válido'
  if (!mensaje || mensaje.trim().length < 10) errores.mensaje = 'El mensaje debe tener al menos 10 caracteres'
  if (mensaje && mensaje.length > 1000) errores.mensaje = 'El mensaje es muy largo (máximo 1000 caracteres)'

  if (Object.keys(errores).length > 0) {
    return res.status(400).json({ errores })
  }

  db.prepare('INSERT INTO mensajes (nombre, email, mensaje) VALUES (?, ?, ?)')
    .run(nombre.trim(), email.trim(), mensaje.trim())

  res.status(201).json({ ok: true, mensaje: '¡Gracias! Te responderemos pronto.' })
})

export default router
