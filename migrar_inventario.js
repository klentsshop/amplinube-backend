import { createClient } from '@sanity/client';

// 1. CONFIGURACIÓN DE PODER (Verificada)
const client = createClient({
  projectId: 'lwtq1hqr', 
  dataset: 'production',
  useCdn: false,
  token: 'sk2e7P9hj2u5DVBNlmr4sq598hZmyZZq9kOnB1myY9xDrJgxwDuMsgJ1HUqHflNVyrLXR5arwYFvOdCkuDpJ5oqQZrwXhkx3pUsExoGwNARecYHq5ej2UKx6IczG2JjE6eiNiGdFj9H5AdBjTM6HKeyGj2eaOU4kLOU0e4CMJ0IFlWQtDywc',
  apiVersion: '2024-05-17',
  perspective: 'raw',
});

async function migrarInventario() {
  const TENANT_ID = 'tiendamyg'; 
  const SCHEMA_NAME = 'inventario';

  try {
    console.log(`🚀 Iniciando migración de existencias: ${SCHEMA_NAME}...`);

    // 2. BUSQUEDA: Insumos que no tienen dueño definido
    const query = `*[_type == "${SCHEMA_NAME}" && !defined(tenant)]`;
    const listaHuerfana = await client.fetch(query);

    if (listaHuerfana.length === 0) {
      console.log('✅ No hay insumos huérfanos. El stock está blindado.');
      return;
    }

    console.log(`📝 Se encontraron ${listaHuerfana.length} insumos en bodega. Sellando con "${TENANT_ID}"...`);

    const transaction = client.transaction();

    listaHuerfana.forEach((doc) => {
      console.log(`📦 Vinculando Insumo: [${doc.nombre}] -> Stock Actual: ${doc.stockActual} -> ${TENANT_ID}`);
      
      transaction.patch(doc._id, {
        set: { tenant: TENANT_ID },
        setIfMissing: { tenant: TENANT_ID } 
      });
    });

    // 3. EJECUCIÓN ATÓMICA
    await transaction.commit({
      visibility: 'async'
    });

    console.log(`\n🎉 ¡MIGRACIÓN EXITOSA! Inventario integrado al sistema Multitenant.`);

  } catch (error) {
    console.error('\n🔥 ERROR CRÍTICO EN LA MIGRACIÓN DE INVENTARIO:');
    console.error(error.message);
  }
}

migrarInventario();