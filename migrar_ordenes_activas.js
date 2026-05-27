import { createClient } from '@sanity/client';

// 1. CONFIGURACIÓN DE PODER
const client = createClient({
  projectId: 'lwtq1hqr', 
  dataset: 'production',
  useCdn: false,
  token: 'sk2e7P9hj2u5DVBNlmr4sq598hZmyZZq9kOnB1myY9xDrJgxwDuMsgJ1HUqHflNVyrLXR5arwYFvOdCkuDpJ5oqQZrwXhkx3pUsExoGwNARecYHq5ej2UKx6IczG2JjE6eiNiGdFj9H5AdBjTM6HKeyGj2eaOU4kLOU0e4CMJ0IFlWQtDywc',
  apiVersion: '2024-05-17',
  perspective: 'raw',
});

async function migrarOrdenesActivas() {
  const TENANT_ID = 'tiendamyg'; 
  const SCHEMA_NAME = 'ordenActiva';

  try {
    console.log(`🚀 Iniciando migración de mesas abiertas: ${SCHEMA_NAME}...`);

    // 2. BUSQUEDA: Órdenes activas que no tienen el campo tenant
    const query = `*[_type == "${SCHEMA_NAME}" && !defined(tenant)]`;
    const listaHuerfana = await client.fetch(query);

    if (listaHuerfana.length === 0) {
      console.log('✅ No hay órdenes activas huérfanas.');
      return;
    }

    console.log(`📝 Se encontraron ${listaHuerfana.length} mesas abiertas. Sellando con "${TENANT_ID}"...`);

    const transaction = client.transaction();

    listaHuerfana.forEach((doc) => {
      console.log(`🍴 Vinculando Orden: [${doc.mesa}] - Atendido por: ${doc.mesero || 'Sin asignar'} -> ${TENANT_ID}`);
      
      transaction.patch(doc._id, {
        set: { tenant: TENANT_ID },
        setIfMissing: { tenant: TENANT_ID } 
      });
    });

    // 3. EJECUCIÓN ATÓMICA
    // Usamos autoGenerateArrayKeys porque las órdenes contienen arrays complejos de platos
    await transaction.commit({
      autoGenerateArrayKeys: true,
      visibility: 'async'
    });

    console.log(`\n🎉 ¡MIGRACIÓN EXITOSA! Las mesas actuales ya pertenecen a "${TENANT_ID}".`);

  } catch (error) {
    console.error('\n🔥 ERROR CRÍTICO EN LA MIGRACIÓN DE ÓRDENES:');
    console.error(error.message);
  }
}

migrarOrdenesActivas();