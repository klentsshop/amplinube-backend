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

async function migrarGastos() {
  const TENANT_ID = 'tiendamyg'; 
  const SCHEMA_NAME = 'gasto';

  try {
    console.log(`🚀 Iniciando migración para el registro de egresos: ${SCHEMA_NAME}...`);

    // 2. BUSQUEDA: Gastos que no tienen dueño definido
    const query = `*[_type == "${SCHEMA_NAME}" && !defined(tenant)]`;
    const listaHuerfana = await client.fetch(query);

    if (listaHuerfana.length === 0) {
      console.log('✅ No hay gastos huérfanos. El historial financiero está blindado.');
      return;
    }

    console.log(`📝 Se encontraron ${listaHuerfana.length} registros de gastos. Sellando con "${TENANT_ID}"...`);

    const transaction = client.transaction();

    listaHuerfana.forEach((doc) => {
      // Formateamos el monto para el log (como lo hace tu preview)
      const montoFormateado = Number(doc.monto || 0).toLocaleString('es-CO');
      console.log(`🔗 Vinculando Gasto: [${doc.descripcion || 'Sin descripción'}] -> $${montoFormateado} -> ${TENANT_ID}`);
      
      transaction.patch(doc._id, {
        set: { tenant: TENANT_ID },
        setIfMissing: { tenant: TENANT_ID } 
      });
    });

    // 3. EJECUCIÓN ATÓMICA
    await transaction.commit({
      visibility: 'async'
    });

    console.log(`\n🎉 ¡MIGRACIÓN EXITOSA! Gastos integrados al sistema Multitenant.`);

  } catch (error) {
    console.error('\n🔥 ERROR CRÍTICO EN LA MIGRACIÓN DE GASTOS:');
    console.error(error.message);
  }
}

migrarGastos();