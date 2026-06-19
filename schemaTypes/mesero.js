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
    // 🛡️ NUEVO MAPA DE PERMISOS GRANULARES INTEGRADOS:
    {
      name: 'verReporte',
      title: 'Permiso: Ver Reportes (Cierre de Día)',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'verAdmin',
      title: 'Permiso: Acceso a Panel Administrativo',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'puedeCargarGasto',
      title: 'Permiso: Registrar Gastos de Caja',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'verVentas',
      title: 'Permiso: Ver Historial de Ventas',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'verInventario',
      title: 'Permiso: Ver Stock / Inventario',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'puedeCobrar',
      title: 'Permiso: Procesar Pagos y Cerrar Cuentas',
      type: 'boolean',
      initialValue: false,
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