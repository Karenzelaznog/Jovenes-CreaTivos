import React, { useEffect, useState } from "react";

const products = [
  {
    id: 1,
    name: "Camisa Oversize Minimal",
    category: "Prendas",
    price: 125000,
    image:
      "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=1000&auto=format&fit=crop",
    description: "Algodón orgánico pesado, corte relajado y acabados artesanales.",
  },
  {
    id: 2,
    name: "Tote Bag Edición Especial",
    category: "Accesorios",
    price: 65000,
    image:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop",
    description: "Lona reforzada de alta densidad con serigrafía exclusiva.",
  },
  {
    id: 3,
    name: "Hoodie Estructurado",
    category: "Prendas",
    price: 185000,
    image:
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop",
    description: "Diseño sin cordones, interior perchado de máxima suavidad.",
  },
  {
    id: 4,
    name: "Gorra Dad Hat Cream",
    category: "Accesorios",
    price: 75000,
    image:
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1000&auto=format&fit=crop",
    description: "Gabardina lavada con hebilla metálica ajustable.",
  },
];

export default function App() {
  const [cart, setCart] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("Todos");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [buyerName, setBuyerName] = useState("");
  const [buyerAddress, setBuyerAddress] = useState("");
  const [copyText, setCopyText] = useState("Copiar");

  const filteredProducts =
    currentFilter === "Todos"
      ? products
      : products.filter((product) => product.category === currentFilter);

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [cart, currentFilter, isCartOpen, isCheckoutOpen, showOrderSuccess]);

  const addToCart = (id) => {
    const product = products.find((item) => item.id === id);
    if (!product) return;
    setCart((prev) => [...prev, product]);
    setIsCartOpen(true);
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, idx) => idx !== index));
  };

  const openCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
    setShowOrderSuccess(false);
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
  };

  const completeOrder = () => {
    if (!buyerName.trim() || !buyerAddress.trim()) {
      alert("Por favor completa tu nombre y dirección de envío.");
      return;
    }

    setShowOrderSuccess(true);
  };

  const resetStore = () => {
    setCart([]);
    setBuyerName("");
    setBuyerAddress("");
    setShowOrderSuccess(false);
    setIsCheckoutOpen(false);
  };

  const copyNequi = async () => {
    try {
      await navigator.clipboard.writeText("3001234567");
    } catch (error) {
      console.error("No se pudo copiar el número de Nequi", error);
    }

    setCopyText("¡Copiado!");
    setTimeout(() => setCopyText("Copiar"), 2000);
  };

  const toggleCart = () => setIsCartOpen((prev) => !prev);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  return (
    <div className="bg-[#FAF8F5] text-[#18181B] font-sans selection:bg-[#E2DDD5] antialiased">
      <nav className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#EFECE6] px-6 md:px-12 py-5 flex items-center justify-between">
        <div className="text-xl font-serif tracking-widest font-medium uppercase">
          Jóvenes CreaTivos
        </div>

        <div className="hidden md:flex items-center space-x-10 text-sm tracking-wide font-light">
          <a href="#inicio" className="hover:opacity-60 transition-opacity">Inicio</a>
          <a href="#nosotros" className="hover:opacity-60 transition-opacity">Nosotros</a>
          <a href="#coleccion" className="hover:opacity-60 transition-opacity">Colección</a>
          <a href="#resenas" className="hover:opacity-60 transition-opacity">Reseñas</a>
        </div>

        <div className="flex items-center space-x-6">
          <button
            type="button"
            onClick={toggleCart}
            className="relative flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity cursor-pointer"
          >
            <i data-lucide="shopping-bag" className="w-5 h-5" />
            <span className="hidden sm:inline">Bolsa</span>
            <span className="absolute -top-2 -right-2 bg-[#18181B] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {cart.length}
            </span>
          </button>
          <button
            type="button"
            onClick={toggleMobileMenu}
            className="md:hidden p-1 cursor-pointer"
          >
            <i data-lucide="menu" className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#FAF8F5] border-b border-[#EFECE6] px-6 py-6 space-y-4 text-center">
          <a href="#inicio" onClick={toggleMobileMenu} className="block text-lg">Inicio</a>
          <a href="#nosotros" onClick={toggleMobileMenu} className="block text-lg">Nosotros</a>
          <a href="#coleccion" onClick={toggleMobileMenu} className="block text-lg">Colección</a>
          <a href="#resenas" onClick={toggleMobileMenu} className="block text-lg">Reseñas</a>
        </div>
      )}

      <section id="inicio" className="px-6 md:px-12 py-20 md:py-32 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs uppercase tracking-[0.2em] text-[#71717A] block">
            Colección Independiente • Envíos Nacionales
          </span>
          <h1 className="text-4xl md:text-6xl font-serif tracking-tight leading-tight font-normal">
            Diseño contemporáneo con identidad propia.
          </h1>
          <p className="text-[#52525B] text-base md:text-lg font-light leading-relaxed max-w-md">
            Prendas y accesorios creados bajo una visión minimalista, priorizando la durabilidad y el detalle estético.
          </p>
          <div className="pt-4">
            <a href="#coleccion" className="bg-[#18181B] text-white px-8 py-4 text-sm tracking-wider uppercase rounded-full hover:bg-[#3F3F46] transition-colors inline-flex items-center gap-2">
              Explorar Colección <i data-lucide="arrow-right" className="w-4 h-4" />
            </a>
          </div>
        </div>
        <div className="relative aspect-[4/5] bg-[#EFECE6] overflow-hidden rounded-2xl shadow-sm">
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop"
            alt="Editorial Hero"
            className="w-full h-full object-cover grayscale-[20%]"
          />
        </div>
      </section>

      <section id="nosotros" className="bg-[#F4F1EA] py-24 px-6 md:px-12 my-12">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <span className="text-xs uppercase tracking-[0.2em] text-[#71717A]">Filosofía</span>
          <h2 className="text-3xl md:text-4xl font-serif">Menos artificio, mayor sustancia.</h2>
          <p className="text-[#52525B] text-base md:text-lg font-light leading-relaxed">
            Jóvenes CreaTivos nace como un espacio de expresión donde cada pieza es tratada como un objeto de diseño único. Trabajamos con tirajes limitados para asegurar acabados impecables y minimizar el desperdicio textil en Colombia.
          </p>
        </div>
      </section>

      <section id="coleccion" className="px-6 md:px-12 py-20 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#71717A] block mb-2">Catálogo</span>
            <h2 className="text-3xl font-serif">Nuestra Selección</h2>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {['Todos', 'Prendas', 'Accesorios'].map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setCurrentFilter(category)}
                className={
                  category === currentFilter
                    ? "px-5 py-2 text-xs uppercase tracking-wider rounded-full transition-all bg-[#18181B] text-white cursor-pointer"
                    : "px-5 py-2 text-xs uppercase tracking-wider rounded-full transition-all bg-[#EFECE6] text-[#52525B] hover:bg-[#E4E1DB] cursor-pointer"
                }
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group flex flex-col">
              <div className="relative aspect-[3/4] bg-[#EFECE6] overflow-hidden rounded-xl mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  type="button"
                  onClick={() => addToCart(product.id)}
                  className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md text-[#18181B] py-3 text-xs uppercase tracking-widest font-medium opacity-0 group-hover:opacity-100 transition-opacity rounded-lg shadow-sm hover:bg-white cursor-pointer"
                >
                  Añadir a la bolsa
                </button>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium">{product.name}</h3>
                  <p className="text-xs text-[#71717A] mt-1">{product.description}</p>
                </div>
                <span className="text-sm font-serif">${product.price.toLocaleString("es-CO")}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="resenas" className="bg-[#F4F1EA] py-24 px-6 md:px-12 my-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs uppercase tracking-[0.2em] text-[#71717A]">Comunidad</span>
            <h2 className="text-3xl font-serif">Lo que dicen nuestros clientes</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                text: '"La calidad de la tela superó mis expectativas. El envío a Medellín fue súper rápido y el pago por Nequi muy fácil."',
                author: "Sofía M.",
                location: "Medellín",
              },
              {
                text: '"El diseño minimalista se nota en cada detalle. La atención al cliente a través del correo fue excelente."',
                author: "Mateo R.",
                location: "Bogotá",
              },
              {
                text: '"Una marca con mucha personalidad. El hoodie se volvió mi prenda favorita para el día a día."',
                author: "Valentina L.",
                location: "Cali",
              },
            ].map((review) => (
              <div key={review.author} className="bg-[#FAF8F5] p-8 rounded-2xl shadow-sm space-y-4">
                <div className="flex text-[#A67C52]">
                  {[...Array(5)].map((_, index) => (
                    <i key={index} data-lucide="star" className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-[#52525B] font-light leading-relaxed">{review.text}</p>
                <div className="text-xs text-[#71717A] tracking-wider uppercase font-medium">
                  {review.author} — <span className="font-light">{review.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#18181B] text-[#FAF8F5] px-6 md:px-12 py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-[#27272A] pb-16">
          <div className="space-y-4">
            <h3 className="font-serif text-lg tracking-wider">Jóvenes CreaTivos</h3>
            <p className="text-xs text-[#A1A1AA] font-light leading-relaxed">
              Diseño y producción independiente en Colombia. Estética depurada y calidad artesanal.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#A1A1AA]">Navegación</h4>
            <ul className="space-y-2 text-sm font-light">
              <li><a href="#inicio" className="hover:opacity-75">Inicio</a></li>
              <li><a href="#nosotros" className="hover:opacity-75">Nosotros</a></li>
              <li><a href="#coleccion" className="hover:opacity-75">Colección</a></li>
              <li><a href="#resenas" className="hover:opacity-75">Reseñas</a></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#A1A1AA]">Métodos de Pago & Envíos</h4>
            <ul className="space-y-2 text-sm font-light text-[#D4D4D8]">
              <li className="font-medium text-white">Nequi / Bancolombia</li>
              <li>Envíos Nacionales asegurados</li>
              <li className="text-xs text-[#A1A1AA] pt-1">Despachos desde Colombia</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#A1A1AA]">Contacto</h4>
            <p className="text-sm font-light text-[#D4D4D8]">¿Dudas con tu pedido?</p>
            <a href="mailto:jakejay271@gmail.com" className="inline-flex items-center gap-2 text-sm underline hover:opacity-75">
              <i data-lucide="mail" className="w-4 h-4" /> jakejay271@gmail.com
            </a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-[#A1A1AA] font-light">
          <p>© {currentYear} Jóvenes CreaTivos. Todos los derechos reservados.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <span>Pagos seguros Nequi</span><span>•</span><span>Envíos a todo el país</span>
          </div>
        </div>
      </footer>

      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md bg-[#FAF8F5] h-full p-6 md:p-8 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-6 border-b border-[#EFECE6]">
              <h3 className="font-serif text-lg">Tu Bolsa ({cart.length})</h3>
              <button type="button" onClick={toggleCart} className="p-1 hover:opacity-65 cursor-pointer">
                <i data-lucide="x" className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-20 text-[#71717A] text-sm">Tu bolsa está vacía.</div>
              ) : (
                cart.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flex gap-4 items-center bg-white p-4 rounded-xl shadow-sm">
                    <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{item.name}</h4>
                      <p className="text-xs text-[#71717A] mt-1">${item.price.toLocaleString("es-CO")}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(index)}
                      className="text-xs text-red-500 hover:underline cursor-pointer"
                    >
                      Eliminar
                    </button>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="border-t border-[#EFECE6] pt-6 space-y-4">
                <div className="flex justify-between items-center text-base font-medium">
                  <span>Total</span>
                  <span className="font-serif text-lg">${cartTotal.toLocaleString("es-CO")}</span>
                </div>
                <button
                  type="button"
                  onClick={openCheckout}
                  className="w-full bg-[#18181B] text-white py-4 text-xs uppercase tracking-widest rounded-xl hover:bg-[#3F3F46] transition-colors font-medium text-center cursor-pointer"
                >
                  Proceder al Pago (Nequi / Bancolombia)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[#FAF8F5] max-w-lg w-full p-8 rounded-3xl shadow-2xl relative space-y-6">
            <button
              type="button"
              onClick={closeCheckout}
              className="absolute top-6 right-6 p-1 hover:opacity-60 cursor-pointer"
            >
              <i data-lucide="x" className="w-5 h-5" />
            </button>

            {!showOrderSuccess ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-[#71717A]">Pasarela de Pago</span>
                  <h3 className="font-serif text-2xl">Transferencia Nequi / Bancolombia</h3>
                  <p className="text-xs text-[#52525B]">
                    Realiza tu pago y envíanos el comprobante a <span className="font-medium">jakejay271@gmail.com</span>
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#EFECE6] space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs text-[#71717A] block uppercase">Nequi / Ahorros Bancolombia</span>
                      <span className="text-lg font-mono font-medium tracking-wide">300 123 4567</span>
                    </div>
                    <button
                      type="button"
                      onClick={copyNequi}
                      className="bg-[#EFECE6] hover:bg-[#E4E1DB] p-3 rounded-xl transition-colors flex items-center gap-2 text-xs font-medium cursor-pointer"
                    >
                      <i data-lucide="copy" className="w-4 h-4" /> {copyText}
                    </button>
                  </div>
                  <div className="pt-3 border-t border-[#EFECE6] text-xs text-[#52525B] flex justify-between">
                    <span>Titular: Jóvenes CreaTivos</span>
                    <span>Total: ${cartTotal.toLocaleString("es-CO")}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#71717A] mb-1">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="Tu nombre"
                      className="w-full bg-white border border-[#EFECE6] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#18181B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#71717A] mb-1">
                      Dirección de Envío (Nacional)
                    </label>
                    <input
                      type="text"
                      value={buyerAddress}
                      onChange={(e) => setBuyerAddress(e.target.value)}
                      placeholder="Ciudad, Dirección, Barrio"
                      className="w-full bg-white border border-[#EFECE6] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#18181B]"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={completeOrder}
                  className="w-full bg-[#18181B] text-white py-4 text-xs uppercase tracking-widest rounded-xl hover:bg-[#3F3F46] transition-colors font-medium cursor-pointer"
                >
                  Confirmar Pago y Notificar
                </button>
              </div>
            ) : (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 bg-[#18181B] text-white rounded-full flex items-center justify-center mx-auto">
                  <i data-lucide="check" className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl">¡Pedido Recibido!</h3>
                <p className="text-sm text-[#52525B] font-light max-w-sm mx-auto">
                  Hemos registrado tu orden. Envía el comprobante de pago a <span className="font-medium">jakejay271@gmail.com</span> junto con tus datos de envío nacional.
                </p>
                <button
                  type="button"
                  onClick={resetStore}
                  className="mt-4 bg-[#18181B] text-white px-8 py-3 text-xs uppercase tracking-widest rounded-xl cursor-pointer"
                >
                  Finalizar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
