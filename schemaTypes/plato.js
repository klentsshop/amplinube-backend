export default {
  name: 'plato',
  title: 'Productos',
  type: 'document',
  fields: [
    {
      name: 'nombre',
      title: 'Nombre del Producto',
      type: 'string',
      validation: Rule => Rule.required()
    },
    
    {
      name: 'precio',
      title: 'Precio Venta',
      type: 'number',
      validation: Rule => Rule.required().min(0),
      initialValue: 0
    },
    {
      name: 'precioCosto',
      title: 'Precio Costo',
      type: 'number',
      validation: Rule => Rule.required().min(0)
    },
    {
      name: 'categoria',
      title: 'Categoría',
      description: 'Seleccione una categoría creada en el panel de Categorías',
      type: 'reference',
      to: [{ type: 'categoria' }],
      validation: Rule => Rule.required()
    },
    {
      name: 'imagen',
      title: 'Foto del Producto',
      type: 'image',
      options: { 
        hotspot: true 
      }
    },
    {
      name: 'disponible',
      title: '¿Está Disponible?',
      type: 'boolean',
      initialValue: true,
      description: 'Si se desactiva, el producto no aparecerá en el POS'
    },
    // --- NUEVOS CAMPOS DE INVENTARIO INTEGRADOS CORRECTAMENTE ---
    {
      name: 'controlaInventario',
      title: '¿Controla Inventario?',
      type: 'boolean',
      initialValue: false
    },
    // 🚀 NUEVA LÓGICA: RECETA MULTI-INSUMO
    {
      name: 'recetaInsumos',
      title: 'Producto a Descontar',
      type: 'array',
      hidden: ({ document }) => !document?.controlaInventario,
      description: 'Agregue todos los Productos que se descuentan al venderse',
      of: [
        {
          type: 'object',
          name: 'itemReceta',
          fields: [
            {
              name: 'insumo',
              title: 'Insumo',
              type: 'reference',
              to: [{ type: 'inventario' }]
            },
            {
              name: 'cantidad',
              title: 'Cantidad a descontar',
              type: 'number',
              initialValue: 1
            }
          ],
          preview: {
            select: {
              title: 'insumo.nombre',
              cantidad: 'cantidad'
            },
            prepare({ title, cantidad }) {
              return {
                title: `${title || 'Sin seleccionar'}`,
                subtitle: `Descuenta: ${cantidad} unidades`
              }
            }
          }
        }
      ]
    },
    {
      name: 'insumoVinculado',
      title: 'Insumo del Inventario',
      type: 'reference',
      to: [{ type: 'inventario' }],
      hidden: true
    },
    {
      name: 'cantidadADescontar',
      title: 'Cantidad a descontar',
      type: 'number',
      initialValue: 1,
      hidden: true
    },
    {
     name: 'codigoBalanza',
     title: 'Código de Balanza (PLU)',
     type: 'string',
     description: 'Código de 5 dígitos para la balanza (ej: 00123). Debe coincidir con el configurado en la pesa física.',
     validation: Rule => Rule.max(5).warning('Los códigos de balanza suelen ser de 5 dígitos')
    },
    {
  name: 'barcode',
  title: 'Código de Barras (EAN-13 / Pistola)',
  type: 'string',
  description: 'Escanee aquí el código del producto con la pistola'
},
    {
    name: 'totalVentas',
      title: 'Popularidad (Ventas Totales)',
      type: 'number',
      initialValue: 0,
      description: 'Este número aumenta automáticamente con cada venta y define el orden en el POS'
    },
    {
            name: 'tenant', // 👈 ESTE ES EL NUEVO JEFE
            title: 'Negocio',
            type: 'string',
            validation: Rule => Rule.required(),
           // readOnly: true,
        }
  ],
  preview: {
    select: {
      title: 'nombre',
      subtitle: 'categoria.titulo',
      media: 'imagen'
    }
  }
  
}