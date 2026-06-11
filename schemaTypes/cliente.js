export default {
    name: 'cliente',
    title: 'Directorio de Clientes',
    type: 'document',
    fields: [
        {
            name: 'tenant',
            title: 'ID del Comercio (Tenant)',
            type: 'string',
            validation: Rule => Rule.required()
        },
        {
            name: 'nombre',
            title: 'Nombre Completo',
            type: 'string',
            validation: Rule => Rule.required()
        },
        {
            name: 'telefono',
            title: 'Número Telefónico / Celular',
            type: 'string',
            validation: Rule => Rule.required()
        },
        {
            name: 'direccion',
            title: 'Dirección de Entrega',
            type: 'string',
            validation: Rule => Rule.required()
        }
    ],
    index: [
        { name: 'tenant_phone', fields: ['tenant', 'telefono'] }
    ]
}