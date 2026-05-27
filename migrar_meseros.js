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

async function migrarMeseros() {
  const TENANT_ID = 'tiendamyg'; 
  const SCHEMA_NAME = 'mesero'; // Mantenemos el nombre técnico del esquema

  try {
    console.log(`🚀 Iniciando migración de personal: ${SCHEMA_NAME}...`);

    // 2. BUSQUEDA: Documentos sin dueño
    const query = `*[_type == "${SCHEMA_NAME}" && !defined(tenant)]`;
    const listaHuerfana = await client.fetch(query);

    if (listaHuerfana.length === 0) {
      console.log('✅ No hay meseros/vendedores huérfanos. El personal está blindado.');
      return;
    }

    console.log(`📝 Se encontraron ${listaHuerfana.length} vendedores sin dueño. Sellando con "${TENANT_ID}"...`);

    const transaction = client.transaction();

    listaHuerfana.forEach((doc) => {
      console.log(`👤 Vinculando Personal: [${doc.nombre}] -> ${TENANT_ID}`);
      
      transaction.patch(doc._id, {
        set: { tenant: TENANT_ID },
        setIfMissing: { tenant: TENANT_ID } 
      });
    });

    // 3. EJECUCIÓN
    await transaction.commit({
      visibility: 'async'
    });

    console.log(`\n🎉 ¡MIGRACIÓN EXITOSA! Vendedores integrados al sistema Multitenant.`);

  } catch (error) {
    console.error('\n🔥 ERROR CRÍTICO EN LA MIGRACIÓN DE MESEROS:');
    console.error(error.message);
  }
}

migrarMeseros();