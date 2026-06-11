// schemas/mesero.js
export default {
  name: 'mesero',
  title: 'Vendedores',
  type: 'document',
  fields: [
     
    {
      name: 'nombre',
      title: 'Nombre del Vendedor(a)',
      type: 'string',
      description: 'Escriba el nombre tal cual quiere que aparezca en el POS',
    },
    {
      name: 'activo',
      title: '¿Usuario Activo en el POS?',
      type: 'boolean',
      initialValue: true, // Por defecto, cuando lo crean, entra activo
      description: 'Si se desactiva, perderá el acceso inmediato al sistema visual del POS.'
    },
    {
            name: 'tenant', // 👈 ESTE ES EL NUEVO JEFE
            title: 'Negocio',
            type: 'string',
            validation: Rule => Rule.required(),
           // readOnly: true,
        }
  ],
}