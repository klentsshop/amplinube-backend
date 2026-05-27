export default {
    name: 'ordenActiva',
    title: 'Orden Activa',
    type: 'document',
    fields: [
        {
            name: 'mesa',
            title: 'Cliente',
            type: 'string',
            validation: Rule => Rule.required()
        },
        {
            name: 'tipoOrden',
            title: 'Tipo de Servicio',
            type: 'string',
            options: {
                list: [
                    { title: '🏪 Mostrador', value: 'mesa' },
                    { title: '🛵 Domicilio', value: 'domicilio' },
                    { title: '📋 Encargo', value: 'llevar' }
                ],
                layout: 'radio' // Esto lo hace ver como botones de selección rápida
            },
            initialValue: 'mesa'
        },
        {
            name: 'mesero',
            title: 'Atendido por',
            type: 'string',
        },
        {
            name: 'fechaCreacion',
            title: 'Fecha de Creación',
            type: 'datetime',
            initialValue: () => (new Date()).toISOString()
        },
        {
            name: 'platosOrdenados',
            title: 'Orden',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {name: 'nombrePlato', type: 'string', title: 'Producto'},
                        {name: 'cantidad', type: 'number', title: 'Cantidad'},
                        {name: 'precioUnitario', type: 'number', title: 'Precio'},
                        {name: 'subtotal', type: 'number', title: 'Subtotal'},
                        {name: 'comentario', type: 'string', title: 'Notas'},
                        {name: 'categoria', type: 'string', title: 'Categoría'}, // 🆕 VITAL: Para que la APK sepa si el plato le pertenece
                    ]
                }
            ],
            validation: Rule => Rule.required().min(1)
        },
        {
            name: 'estacionesPendientes', // 🆕 CORAZÓN DEL SISTEMA
            title: 'Estaciones que deben imprimir',
            description: 'Lista de estaciones que aún no han impreso esta orden',
            type: 'array',
            of: [{type: 'string'}],
            initialValue: []
        },
        {
            name: 'imprimirSolicitada',
            title: '¿Enviar a Impresión?',
            type: 'boolean',
            initialValue: false
        },
        {
            name: 'imprimirCliente',
            title: '¿Imprimir Ticket Cliente?',
            type: 'boolean',
            initialValue: false
        },
        /* 🆕 SISTEMA DE MARCADORES DINÁMICOS:
           No creamos un campo por cada estación aquí manualmente. 
           La APK creará campos como 'ultimoKeyCOCINA' o 'ultimoKeyBAR' automáticamente vía Patch.
           Sin embargo, dejamos 'ultimoKeyImpreso' como respaldo global.
        */
        {
            name: 'ultimoKeyImpreso',
            title: 'Último ID Global Impreso',
            type: 'string',
            hidden: true 
        },
        {
            name: 'ultimaActualizacion',
            title: 'Última Actualización',
            type: 'datetime',
        },
        
        
        {
            name: 'tenant', // 👈 ESTE ES EL NUEVO JEFE
            title: 'Negocio',
            type: 'string',
            validation: Rule => Rule.required(),
           // readOnly: true,
        }
    ],
    preview: {
        select: {
            title: 'mesa',
            mesero: 'mesero',
            pendientes: 'estacionesPendientes',
            subtitle: 'fechaCreacion'
        },
        prepare(selection) {
            const {title, subtitle, mesero, pendientes} = selection
            const est = pendientes && pendientes.length > 0 ? ` | Pendiente: ${pendientes.join(', ')}` : ' | ✅ Impreso'
            return {
                title: `Orden: ${title} ${mesero ? `(${mesero})` : ''}`,
                subtitle: new Date(subtitle).toLocaleString('es-CO') + est
            }
        }
    }
}// cambio para forzar git