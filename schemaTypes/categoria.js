export default {
  name: 'categoria',
  title: 'Categorías',
  type: 'document',
  fields: [
    {
      name: 'titulo',
      title: 'Nombre de la Categoría',
      type: 'string',
      description: 'Ejemplo: 🥩 Carnes / Abarrotes',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Valor Interno (ID)',
      type: 'slug',
      description: 'Haz clic en "Generate". Ejemplo: carnes',
      options: { source: 'titulo', maxLength: 96 },
      validation: Rule => Rule.required()
    },
    {
      name: 'orden',
      title: 'Orden de Aparición',
      type: 'number',
      description: '1 para el primero, 2 para el segundo, etc.'
    },
    {
  name: 'seImprime',
  title: '¿Se envía a Impresión?',
  description: 'Si se desactiva, esta categoría no será Impresa.',
  type: 'boolean',
  initialValue: true // Por defecto que todas impriman
  },
  {
            name: 'tenant', // 👈 ESTE ES EL NUEVO JEFE
            title: 'Negocio',
            type: 'string',
            validation: Rule => Rule.required(),
           // readOnly: true,
        },
  ],
  preview: {
    select: {
      title: 'titulo',      // Esto hace que en la lista aparezca "Bebidas"
      subtitle: 'tenant'    // Esto pone "demo" chiquito abajo
    }
  }
}