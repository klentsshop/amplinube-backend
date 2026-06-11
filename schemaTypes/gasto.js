// Archivo: talanquera-backend/schemas/gasto.js
export default {
  name: 'gasto',
  title: 'Gastos',
  type: 'document',
  fields: [
     
    { name: 'descripcion', title: '¿En qué se gastó?', type: 'string' },
    { name: 'monto', title: 'Valor', type: 'number' },
    { 
      name: 'fecha', 
      title: 'Fecha', 
      type: 'datetime', 
      initialValue: () => (new Date()).toISOString() 
    },
    {
            name: 'tenant', // 👈 ESTE ES EL NUEVO JEFE
            title: 'Negocio',
            type: 'string',
            validation: Rule => Rule.required(),
           // readOnly: true,
        }
  ],
  // AQUÍ ES DONDE AJUSTAMOS LA VISTA PREVIA
  preview: {
    select: { 
      title: 'descripcion', 
      monto: 'monto',
      fecha: 'fecha' // 1. Seleccionamos la fecha para usarla abajo
    },
    prepare({ title, monto, fecha }) {
      return { 
        // El título principal mostrará: "Carbón - $50.000"
        title: `${title || 'Sin descripción'} - $${Number(monto || 0).toLocaleString('es-CO')}`,
        // El subtítulo mostrará la fecha formateada para Colombia
        subtitle: fecha ? new Date(fecha).toLocaleString('es-CO') : 'Sin fecha'
      }
    }
  }
}