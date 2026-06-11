export default {
  name: 'estacionPC',
  title: 'Estaciones de Impresión Windows',
  type: 'document',
  fields: [
    {
      name: 'nombre',
      title: 'Nombre de la PC / Estación',
      type: 'string',
      description: 'Ejemplo: Caja Principal o Barra Bar',
      validation: Rule => Rule.required()
    },
    {
      name: 'categoriasVinculadas',
      title: 'Categorías que imprime esta PC',
      description: 'Selecciona las categorías que saldrán por el cable de esta estación',
      type: 'array',
      // 🚀 BISTURÍ: Esto vincula automáticamente con lo que el cliente cree
      of: [
        {
          type: 'reference',
          to: [{ type: 'categoria' }] 
        }
      ]
    },
    {
      name: 'pcFingerprint',
      title: 'ID Único de esta PC',
      type: 'string',
      description: 'Identificador técnico del navegador'
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