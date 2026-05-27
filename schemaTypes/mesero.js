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
            name: 'tenant', // 👈 ESTE ES EL NUEVO JEFE
            title: 'Negocio',
            type: 'string',
            validation: Rule => Rule.required(),
           // readOnly: true,
        }
  ],
}