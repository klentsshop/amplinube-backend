export default {
  name: 'negocio',
  title: 'Negocios Registrados',
  type: 'document',
  fields: [
    // 🏢 Datos de Identidad Principal
    { name: 'nombre', title: 'Nombre del Negocio', type: 'string' },
    { name: 'slug', title: 'Identificador (Tenant ID)', type: 'slug', options: { source: 'nombre' } },
    { name: 'nit', title: 'NIT / RUT', type: 'string' },
    { name: 'direccion', title: 'Dirección Física', type: 'string' },
    { name: 'telefono', title: 'Teléfono de Contacto', type: 'string' },
    
    // 🎨 Identidad Visual (Para que el POS cambie de color según el cliente)
    { name: 'colordark', title: 'Color de Marca (Ej: #000A6F)', type: 'string', initialValue: '#000A6F' },
  ]
}