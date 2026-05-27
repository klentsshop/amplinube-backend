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

async function migrarSeguridad() {
  const TENANT_ID = 'tiendamyg'; 
  const SCHEMA_NAME = 'seguridad';

  try {
    console.log(`🚀 Iniciando migración de llaves maestras: ${SCHEMA_NAME}...`);

    // 2. BUSQUEDA: Documentos de seguridad sin dueño
    const query = `*[_type == "${SCHEMA_NAME}" && !defined(tenant)]`;
    const huerfanos = await client.fetch(query);

    if (huerfanos.length === 0) {
      console.log('✅ No hay llaves huérfanas. La seguridad está blindada.');
      return;
    }

    console.log(`📝 Se encontraron ${huerfanos.length} documentos de PINs. Sellando con "${TENANT_ID}"...`);

    const transaction = client.transaction();

    huerfanos.forEach((doc) => {
      console.log(`🔑 Vinculando Seguridad del Negocio -> Tenant: ${TENANT_ID}`);
      transaction.patch(doc._id, {
        set: { tenant: TENANT_ID },
        setIfMissing: { tenant: TENANT_ID } 
      });
    });

    // 3. EJECUCIÓN
    await transaction.commit({
      visibility: 'async'
    });

    console.log(`\n🎉 ¡MIGRACIÓN EXITOSA! Los PINs ahora responden al tenant "${TENANT_ID}".`);

  } catch (error) {
    console.error('\n🔥 ERROR CRÍTICO EN LA MIGRACIÓN DE SEGURIDAD:');
    console.error(error.message);
  }
}

migrarSeguridad();