export default {
  name: 'inventario', // 🔒 Se mantiene idéntico para que el POS no enloquezca
  title: 'Inventario / Stock',
  type: 'document',
  fields: [
    // 🛡️ EL ESCUDO MULTI-TENANT: Vital para saber a qué negocio pertenece este insumo
    {
      name: 'tenant',
      title: 'ID del Negocio (Tenant)',
      type: 'string',
      validation: Rule => Rule.required(),
      // Opcional: si usas un usuario administrador global puedes dejarlo visible, 
      // si tus clientes entran a su propio panel, lo puedes ocultar con readOnly o hidden.
    },
    {
      name: 'nombre',
      title: 'Nombre del Producto',
      type: 'string',
      validation: Rule => Rule.required()
    },
    // 🚀 CAMPOS PARA PISTOLA Y BALANZA
    {
      name: 'barcode',
      title: 'Código de Barras (EAN-13 / Pistola)',
      type: 'string',
      description: 'Escanee el código aquí para vincularlo a la pistola'
    },
    {
      name: 'codigoBalanza',
      title: 'Código de Balanza (PLU)',
      type: 'string',
      description: 'Código de 5 dígitos para la balanza',
      validation: Rule => Rule.max(5)
    },
    {
      name: 'unidadMedida',
      title: 'Unidad de Medida',
      type: 'string',
      hidden: true, // 🔒 Se mantiene oculto como lo tenías originalmente
      options: {
        list: [
          { title: 'Unidades', value: 'unidades' },
          { title: 'Kilogramos', value: 'kg' }
        ]
      },
      initialValue: 'unidades'
    },
    {
      name: 'stockMinimo',
      title: 'Alerta Stock Mínimo',
      type: 'number',
      description: 'El POS avisará cuando el stock baje de este número',
      initialValue: 5
    }
    // 🪓 AQUÍ CORTAMOS EL "stockActual": Recuerda que ahora se procesa gratis y veloz en Supabase
  ],
  preview: {
    select: {
      title: 'nombre',
      barcode: 'barcode'
    },
    prepare({ title, barcode }) {
      return {
        title: title?.toUpperCase(),
        subtitle: barcode ? `🔫 Barra: ${barcode}` : '📦 Configurado en Sanity (Stock en Supabase)'
      }
    }
  }
}