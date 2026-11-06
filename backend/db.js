import { DatabaseSync } from 'node:sqlite'

export const db = new DatabaseSync('skincary.sqlite')

// tipo: 'skincare' o 'accesorio' | linea: la versión del producto
// coleccion: 'skincary' o 'cinnamoroll'
db.exec(`
  CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    precio INTEGER NOT NULL,
    categoria TEXT NOT NULL,
    tipo TEXT NOT NULL DEFAULT 'skincare',
    linea TEXT,
    coleccion TEXT NOT NULL DEFAULT 'skincary',
    resultado TEXT,
    ingredientes TEXT,
    imagen TEXT
  )
`)
// Mensajes que llegan desde el formulario de contacto
db.exec(`
  CREATE TABLE IF NOT EXISTS mensajes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL,
    mensaje TEXT NOT NULL,
    fecha TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`)
export default db