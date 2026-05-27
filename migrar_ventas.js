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

async function migrarVentas() {
  const TENANT_ID = 'tiendamyg'; 
  const SCHEMA_NAME = 'venta';

  try {
    console.log(`🚀 Iniciando migración del histórico de ventas: ${SCHEMA_NAME}...`);

    // 2. BUSQUEDA: Ventas que no tienen el campo tenant
    const query = `*[_type == "${SCHEMA_NAME}" && !defined(tenant)]`;
    const listaHuerfana = await client.fetch(query);

    if (listaHuerfana.length === 0) {
      console.log('✅ El histórico de ventas ya está completamente migrado.');
      return;
    }

    console.log(`📝 Se encontraron ${listaHuerfana.length} ventas pasadas. Sellando con "${TENANT_ID}"...`);

    const transaction = client.transaction();

    listaHuerfana.forEach((doc) => {
      const montoFinal = (Number(doc.totalPagado) || 0) + (Number(doc.propinaRecaudada) || 0);
      console.log(`💰 Sellando Venta: [Folio: ${doc.folio || 'N/A'}] - Total: $${montoFinal.toLocaleString('es-CO')} -> ${TENANT_ID}`);
      
      transaction.patch(doc._id, {
        set: { tenant: TENANT_ID },
        setIfMissing: { tenant: TENANT_ID } 
      });
    });

    // 3. EJECUCIÓN ATÓMICA
    // Usamos autoGenerateArrayKeys por los detalles de pago y platos vendidos
    await transaction.commit({
      autoGenerateArrayKeys: true,
      visibility: 'async'
    });

    console.log(`\n🎉 ¡MIGRACIÓN EXITOSA! El historial de ventas ahora pertenece a "${TENANT_ID}".`);

  } catch (error) {
    console.error('\n🔥 ERROR CRÍTICO EN LA MIGRACIÓN DE VENTAS:');
    console.error(error.message);
  }
}

migrarVentas();