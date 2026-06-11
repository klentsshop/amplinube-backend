import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'

// Centralizamos credenciales
const PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID || 'tu_id_real_aqui';
const DATASET = process.env.SANITY_STUDIO_DATASET || 'production';

export default defineConfig({
  name: 'default',
  title: 'Socio POS SaaS Maestro',
  projectId: PROJECT_ID,
  dataset: DATASET,

  plugins: [
    structureTool({
      structure: async (S, context) => {
        const { getClient } = context;
        const client = getClient({ apiVersion: '2023-01-01' });

        // Traemos los negocios registrados
        const negocios = await client.fetch(`*[_type == "negocio"]{nombre, "id": slug.current}`);

        return S.list()
          .title('Panel de Control SaaS')
          .items([
            // 🏢 1. GESTIÓN POR CLIENTE (Estructura Organizada por Local)
            S.listItem()
              .title('📂 Operaciones por Cliente')
              .child(
                S.list()
                  .title('Seleccione Cliente')
                  .items([
                    ...(negocios.length > 0 
                      ? negocios.map((n) =>
                          S.listItem()
                            .title(n.nombre || 'Sin Nombre')
                            .child(
                              S.list()
                                .title(`Gestión: ${n.nombre}`)
                                .items([
                                  S.listItem()
                                    .title('🛒 Ventas')
                                    .child(S.documentList().title('Ventas').filter('_type == "venta" && tenant == $id').params({ id: n.id })),
                                  S.listItem()
                                    .title('📂 Cliente domicilios')
                                    .child(S.documentList().title('cliente').filter('_type == "cliente" && tenant == $id').params({ id: n.id })),
                                    S.listItem()
                                    .title('📂 Orden Activa')
                                    .child(S.documentList().title('Órdenes Activas').filter('_type == "ordenActiva" && tenant == $id').params({ id: n.id })),
                                  S.listItem()
                                    .title('📂 Gastos')
                                    .child(S.documentList().title('Gastos').filter('_type == "gasto" && tenant == $id').params({ id: n.id })),
                                  S.divider(),
                                  S.listItem()
                                    .title('👨‍🍳 Productos')
                                    .child(S.documentList().title('Productos/Platos').filter('_type == "plato" && tenant == $id').params({ id: n.id })),
                                  S.listItem()
                                    .title('📂 Categorías')
                                    .child(S.documentList().title('Categorías').filter('_type == "categoria" && tenant == $id').params({ id: n.id })),
                                  S.listItem()
                                    .title('📦 Inventario')
                                    .child(S.documentList().title('Inventario').filter('_type == "inventario" && tenant == $id').params({ id: n.id })),
                                  S.divider(),
                                  S.listItem()
                                    .title('👥 Meseros')
                                    .child(S.documentList().title('Meseros').filter('_type == "mesero" && tenant == $id').params({ id: n.id })),
                                  S.listItem()
                                    .title('🔐 Pin / Seguridad')
                                    .child(S.documentList().title('Seguridad').filter('_type == "seguridad" && tenant == $id').params({ id: n.id })),
                                ])
                            )
                        )
                      : [
                          // 🛡️ CORRECCIÓN QUIRÚRGICA: Cambiamos S.component() vacío por un S.documentTypeList de ayuda
                          S.listItem()
                            .title('⚠️ Crea un cliente primero')
                            .child(
                              S.documentTypeList('negocio')
                                .title('Registra un cliente abajo en el menú principal')
                            )
                        ])
                  ])
              ),

            S.divider(),

            // ✨ 2. REGISTRO DE NUEVOS CLIENTES (Aquí nace cada local)
            S.documentTypeListItem('negocio')
              .title('✨ REGISTRAR NUEVO CLIENTE'),

            S.divider(),

            // ⚙️ 3. CONFIGURACIÓN DEL SISTEMA (Lo que no es de un cliente específico)
            S.listItem()
              .title('⚙️ Configuración del Sistema')
              .child(
                S.list()
                  .title('Datos Técnicos')
                  .items([
                    ...S.documentTypeListItems().filter(item => 
                      !['venta', 'inventario', 'categoria', 'negocio', 'gasto', 'ordenActiva', 'plato', 'mesero', 'seguridad'].includes(item.getId())
                    )
                  ])
              ),
          ])
      }
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})