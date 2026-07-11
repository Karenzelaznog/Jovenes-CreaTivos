# LOGICA DE NEGOCIO: SKINCARY

## DESCRIPCION
¿Qué será SkinKary?
SkinKary es una tienda online de skincare creada en Colombia, enfocada
en rutinas simples y efectivas para todo tipo de piel. Nacemos de la
idea de que cuidar tu piel no tiene que ser complicado ni costoso.
Encuentras productos seleccionados con ingredientes naturales y
fórmulas que sí funcionan. Cada producto está pensado para piel
latina, clima húmedo, sol fuerte y vida real.

## FLUJO PRINCIPAL
1. El usuario ingresa a la tienda y explora el catálogo [busca por
   categoría: protección, limpieza o hidratación]
2. El sistema verifica si el producto es apto para las necesidades
   de piel del usuario [tipo de piel, objetivo de cuidado]
3. Si sí: [el usuario agrega el producto al carrito, el sistema
   calcula el total y confirma disponibilidad de stock]
4. Si no: [el sistema descarta la sugerencia y recomienda un
   producto alternativo según la necesidad indicada]

## PSEUDOCODIGO
si [producto es apto para la necesidad de piel]
    Mostrar [detalle del producto + botón agregar al carrito]
Si no
    Mostrar [producto alternativo recomendado]