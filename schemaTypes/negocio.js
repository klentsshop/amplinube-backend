export default {
  name: 'negocio',
  title: 'Negocios Registrados',
  type: 'document',
  fields: [
    { name: 'nombre', title: 'Nombre del Negocio', type: 'string' },
    { name: 'slug', title: 'Identificador (Tenant ID)', type: 'slug', options: { source: 'nombre' } },
    { name: 'logo', title: 'Logo', type: 'image' },
    { name: 'colorPrincipal', title: 'Color de Marca', type: 'string' },
  ]
}