import { createClient } from '@sanity/client';

// 1. CONFIGURACIÓN DE PODER (Verificada)
const client = createClient({
  projectId: 'lwtq1hqr', 
  dataset: 'production',
  useCdn: false,
  token: 'sk2e7P9hj2u5DVBNlmr4sq598hZmyZZq9kOnB1myY9xDrJgxwDuMsgJ1HUqHflNVyrLXR5arwYFvOdCkuDpJ5oqQZrwXhkx3pUsExoGwNARecYHq5ej2UKx6IczG2JjE6eiNiGdFj9H5AdBjTM6HKeyGj2eaOU4kLOU0e4CMJ0IFlWQtDywc',
  apiVersion: '2024-05-17', 
});

async function migrarCategorias() {
  const TENANT_ID = 'tiendamyg'; 
  const SCHEMA_NAME = 'categoria';

  try {
    console.log(`🚀 Iniciando migración para el schema: ${SCHEMA_NAME}...`);

    // 2. BUSQUEDA: Solo documentos que NO tienen el campo tenant
    const query = `*[_type == "${SCHEMA_NAME}" && !defined(tenant)]`;
    const huerfanas = await client.fetch(query);

    if (huerfanas.length === 0) {
      console.log('✅ No hay documentos huérfanos. Proceso finalizado.');
      return;
    }

    console.log(`📝 Se encontraron ${huerfanas.length} documentos. Preparando transacción...`);

    // 3. TRANSACCIÓN ATÓMICA (Todo o nada)
    const transaction = client.transaction();

    huerfanas.forEach((doc) => {
      console.log(`🔗 Vinculando: [${doc.titulo || doc._id}] -> ${TENANT_ID}`);
      transaction.patch(doc._id, {
        set: { tenant: TENANT_ID },
        setIfMissing: { tenant: TENANT_ID } 
      });
    });

    // 4. EJECUCIÓN CON BLINDAJE
    await transaction.commit({
      autoGenerateArrayKeys: true, // 🛡️ Evita errores en arrays si existieran
      visibility: 'async'          // Asegura consistencia
    });

    console.log(`\n🎉 ¡MIGRACIÓN EXITOSA! Documentos marcados como "${TENANT_ID}"`);

  } catch (error) {
    console.error('\n🔥 ERROR CRÍTICO EN LA MIGRACIÓN:');
    console.error(error.message);
    // No usamos process.exit para que el proceso de Node termine naturalmente
  }
}

migrarCategorias();