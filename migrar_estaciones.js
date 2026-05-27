import { createClient } from '@sanity/client';

// 1. CONFIGURACIÓN DE PODER (Verificada y funcionando)
const client = createClient({
  projectId: 'lwtq1hqr', 
  dataset: 'production',
  useCdn: false,
  token: 'sk2e7P9hj2u5DVBNlmr4sq598hZmyZZq9kOnB1myY9xDrJgxwDuMsgJ1HUqHflNVyrLXR5arwYFvOdCkuDpJ5oqQZrwXhkx3pUsExoGwNARecYHq5ej2UKx6IczG2JjE6eiNiGdFj9H5AdBjTM6HKeyGj2eaOU4kLOU0e4CMJ0IFlWQtDywc',
  apiVersion: '2024-05-17',
  perspective: 'raw',
});

async function migrarEstaciones() {
  const TENANT_ID = 'tiendamyg'; 
  const SCHEMA_NAME = 'estacionPC';

  try {
    console.log(`🚀 Iniciando migración para el schema: ${SCHEMA_NAME}...`);

    // 2. BUSQUEDA: Solo estaciones que no tengan tenant definido
    const query = `*[_type == "${SCHEMA_NAME}" && !defined(tenant)]`;
    const huerfanas = await client.fetch(query);

    if (huerfanas.length === 0) {
      console.log('✅ No hay estaciones huérfanas. Todo está bajo control.');
      return;
    }

    console.log(`📝 Se encontraron ${huerfanas.length} estaciones sin dueño. Sellando...`);

    // 3. TRANSACCIÓN ATÓMICA
    const transaction = client.transaction();

    huerfanas.forEach((doc) => {
      console.log(`🔗 Marcando Estación: [${doc.nombre}] -> Tenant: ${TENANT_ID}`);
      transaction.patch(doc._id, {
        set: { tenant: TENANT_ID },
        setIfMissing: { tenant: TENANT_ID } 
      });
    });

    // 4. EJECUCIÓN
    await transaction.commit({
      autoGenerateArrayKeys: true, // Crucial por el array 'categoriasVinculadas'
      visibility: 'async'
    });

    console.log(`\n🎉 ¡MIGRACIÓN EXITOSA! Estaciones vinculadas a "${TENANT_ID}"`);

  } catch (error) {
    console.error('\n🔥 ERROR CRÍTICO EN LA MIGRACIÓN DE ESTACIONES:');
    console.error(error.message);
  }
}

migrarEstaciones();