import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3000

// Permite que el frontend (otro puerto) hable con esta API
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
// Permite leer datos JSON que lleguen en las peticiones
app.use(express.json())

// Ruta de prueba para comprobar que la API responde
app.get('/api/salud', (req, res) => {
  res.json({ ok: true, mensaje: 'API de SKINCARY funcionando' })
})

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`)
})