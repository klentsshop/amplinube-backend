export default {
  name: 'inventario',
  title: 'Inventario / Stock',
  type: 'document',
  fields: [
    {
      name: 'nombre',
      title: 'Nombre del Producto',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'stockActual',
      title: 'Existencias Actuales',
      description: 'Cantidad disponible (en Kilos o Unidades)',
      type: 'number',
      initialValue: 0,
      validation: Rule => Rule.min(0)
    },
    // 🚀 CAMPOS PARA PISTOLA Y BALANZA (Visibles para poder cargar el código)
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
      stock: 'stockActual'
    },
    prepare({ title, stock }) {
      return {
        title: title?.toUpperCase(),
        subtitle: `Stock Disponible: ${stock}` // Simplificado sin unidades
      }
    }
  }
}