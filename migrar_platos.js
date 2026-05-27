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

async function migrarPlatos() {
  const TENANT_ID = 'tiendamyg'; 
  const SCHEMA_NAME = 'plato';

  try {
    console.log(`🚀 Iniciando migración para el corazón del POS: ${SCHEMA_NAME}...`);

    // 2. BUSQUEDA: Platos sin el campo tenant
    const query = `*[_type == "${SCHEMA_NAME}" && !defined(tenant)]`;
    const listaHuerfana = await client.fetch(query);

    if (listaHuerfana.length === 0) {
      console.log('✅ No hay platos huérfanos. El menú está blindado.');
      return;
    }

    console.log(`📝 Se encontraron ${listaHuerfana.length} platos/productos. Sellando con "${TENANT_ID}"...`);

    const transaction = client.transaction();

    listaHuerfana.forEach((doc) => {
      console.log(`🔗 Marcando Producto: [${doc.nombre}] -> Precio: $${doc.precio}`);
      transaction.patch(doc._id, {
        set: { tenant: TENANT_ID },
        setIfMissing: { tenant: TENANT_ID } 
      });
    });

    // 3. EJECUCIÓN
    await transaction.commit({
      autoGenerateArrayKeys: true, 
      visibility: 'async'
    });

    console.log(`\n🎉 ¡MIGRACIÓN EXITOSA! ${listaHuerfana.length} productos listos.`);

  } catch (error) {
    console.error('\n🔥 ERROR CRÍTICO EN LA MIGRACIÓN DE PLATOS:');
    console.error(error.message);
  }
}

migrarPlatos();