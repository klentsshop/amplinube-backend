import { createClient } from '@sanity/client';

// 🔌 CONEXIÓN CON TU PROYECTO NUEVO
const client = createClient({
  projectId: 'sgyd5ub4', // Tu ID de proyecto nuevo que vimos en consola
  dataset: 'production',
  useCdn: false,
  // 🔑 Usa tu token de escritura del nuevo proyecto
  token: process.env.SANITY_API_TOKEN || 'skwItJdVTpo5PJjRp4cRH4blzsMxcJelPGyQumcKJEGuJnRbXKtLaauKmfTmJCK7v4Tp87v8sB58NWxi5KeOw6u23fXFFXcuWPdOmoNVShaJp8Nmi4IYgyBIazrYXRfWi1JxTmX4zQB8ZzzFSKrCeLck2R5BWkTUKI4XiSrlzhG9uN1s7HX3', 
  apiVersion: '2024-08-01',
});

async function inyectarTenantMasivo() {
  const TARGET_TENANT = 'leosalsamentaria'; // El ID del negocio de destino
  
  console.log(`🔍 Buscando productos que no tengan asignado un tenant...`);

  try {
    // 📡 1. Traemos los documentos tipo "plato" que NO tengan el campo tenant configurado
    const platosSinTenant = await client.fetch(
      `*[_type == "plato" && !defined(tenant)][]._id`
    );

    const total = platosSinTenant.length;
    console.log(`📦 Se encontraron ${total} productos huérfanos sin tenant.`);

    if (total === 0) {
      console.log("🏁 ¡No hay productos por actualizar! Todo está al día.");
      return;
    }

    console.log(`⚡ Iniciando actualización masiva en ráfagas de seguridad...`);

    // 🔨 2. Procesamos en lotes (chunks) de 100 en 100 para no saturar la API de Sanity
    const tamañoLote = 100;
    for (let i = 0; i < total; i += tamañoLote) {
      const loteActual = platosSinTenant.slice(i, i + tamañoLote);
      
      // Creamos una transacción mutuable
      const transaccion = client.transaction();
      
      loteActual.forEach(id => {
        // Le agregamos el campo tenant con el valor 'leosalsamentaria'
        transaccion.patch(id, {
          set: { tenant: TARGET_TENANT }
        });
      });

      // Ejecutamos los cambios en la nube
      await transaccion.commit();
      console.log(`✅ Lote procesado: ${Math.min(i + tamañoLote, total)} / ${total} productos parchados.`);
    }

    console.log(`🏁 MIGRACIÓN EXITOSA. Los ${total} productos ahora le pertenecen a "${TARGET_TENANT}".`);

  } catch (error) {
    console.error("❌ Error crítico durante la inyección:", error.message);
  }
}

inyectarTenantMasivo();