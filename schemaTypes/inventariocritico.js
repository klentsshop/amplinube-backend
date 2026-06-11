// Archivo: schemas/inventarioCritico.js (Tu antiguo esquema de inventario mutado)
export default {
  name: 'inventarioCritico',
  title: 'Inventario / Alertas en Tiempo Real',
  type: 'document',
  fields: [
    {
      name: 'tenant',
      title: 'Negocio',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'productosCriticos',
      title: 'Productos en Alerta de Stock',
      description: 'Esta lista se actualiza automáticamente al guardar o comandar pedidos',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'alertaStock',
          fields: [
            { name: 'productoId', title: 'ID de Supabase o Sanity', type: 'string' },
            { name: 'nombre', title: 'Nombre del Producto', type: 'string' },
            { name: 'stockDisponible', title: 'Cantidad Viva', type: 'number' }
          ]
        }
      ]
    },
    {
      name: 'ultimaSincronizacion',
      title: 'Última Sincronización',
      type: 'datetime'
    }
  ],
  preview: {
    select: {
      tenant: 'tenant',
      alertas: 'productosCriticos'
    },
    prepare({ tenant, alertas }) {
      return {
        title: `STOCKS EN VIVO: ${tenant?.toUpperCase()}`,
        subtitle: `Productos calientes en memoria: ${alertas?.length || 0}`
      }
    }
  }
}