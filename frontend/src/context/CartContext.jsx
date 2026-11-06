import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
export const useCart = () => useContext(CartContext)

// Carrito global. Se guarda en localStorage para no perderlo al recargar.
export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('skincary_carrito')) || [] }
    catch { return [] }
  })

  useEffect(() => {
    try { localStorage.setItem('skincary_carrito', JSON.stringify(items)) } catch { /* sin storage */ }
  }, [items])

  const agregar = (p) =>
    setItems((prev) => {
      const existe = prev.find((i) => i.id === p.id)
      if (existe) return prev.map((i) => (i.id === p.id ? { ...i, cantidad: i.cantidad + 1 } : i))
      return [...prev, { id: p.id, nombre: p.nombre, precio: p.precio, imagen: p.imagen, cantidad: 1 }]
    })

  const sumar = (id) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, cantidad: i.cantidad + 1 } : i)))

  const restar = (id) =>
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, cantidad: i.cantidad - 1 } : i)).filter((i) => i.cantidad > 0)
    )

  const quitar = (id) => setItems((prev) => prev.filter((i) => i.id !== id))
  const vaciar = () => setItems([])

  const total = useMemo(() => items.reduce((s, i) => s + i.precio * i.cantidad, 0), [items])
  const cantidad = useMemo(() => items.reduce((s, i) => s + i.cantidad, 0), [items])

  return (
    <CartContext.Provider value={{ items, agregar, sumar, restar, quitar, vaciar, total, cantidad }}>
      {children}
    </CartContext.Provider>
  )
}