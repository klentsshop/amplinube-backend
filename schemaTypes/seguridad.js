// En tu carpeta de esquemas de Sanity
export default {
  name: 'seguridad',
  title: 'Seguridad y PINs',
  type: 'document',
  __experimental_actions: ['update', 'publish'], // Solo permite editar, no crear varios
  fields: [
    {
      name: 'pinCajero',
      title: 'PIN de Cajero (Habilitar Cobro)',
      type: 'string',
      validation: Rule => Rule.required().min(4).max(6)
    },
    {
      name: 'pinAdmin',
      title: 'PIN de Administrador (Reportes)',
      type: 'string',
      validation: Rule => Rule.required().min(4).max(6)
    },
    {
            name: 'tenant', // 👈 ESTE ES EL NUEVO JEFE
            title: 'Negocio',
            type: 'string',
            validation: Rule => Rule.required(),
           // readOnly: true,
        }
  ]
}