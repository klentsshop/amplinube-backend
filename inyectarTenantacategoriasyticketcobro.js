import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'sgyd5ub4', // Tu ID de proyecto nuevo
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN || 'skwItJdVTpo5PJjRp4cRH4blzsMxcJelPGyQumcKJEGuJnRbXKtLaauKmfTmJCK7v4Tp87v8sB58NWxi5KeOw6u23fXFFXcuWPdOmoNVShaJp8Nmi4IYgyBIazrYXRfWi1JxTmX4zQB8ZzzFSKrCeLck2R5BWkTUKI4XiSrlzhG9uN1s7HX3', 
  apiVersion: '2024-08-01',
});

async function arreglarEstructuraMasiva() {
  const TARGET_TENANT = 'leosalsamentaria';
  // 📋 Agrupamos los tipos estructurales que necesitan el tenant para que la interfaz los lea
  const TIPOS_ESTRUCTURALES = ['categoria', 'ticketCobro'];

  console.log(`🔍 Buscando categorías y configuraciones estructurales sin tenant...`);

  try {
    // 📡 Traemos todos los documentos de estos tipos que no tengan tenant definido
    const documentosHuerfanos = await client.fetch(
      `*[_type in $tipos && !defined(tenant)]._id`,
      { tipos: TIPOS_ESTRUCTURALES }
    );

    const total = documentosHuerfanos.length;
    console.log(`📦 Se encontraron ${total} elementos estructurales sin asignar.`);

    if (total === 0) {
      console.log("🏁 ¡Todo en orden! Las categorías y tickets ya tienen dueño.");
      return;
    }

    console.log(`⚡ Inyectando tenant "${TARGET_TENANT}" a la estructura...`);

    // Procesamos en lotes de 100
    const tamañoLote = 100;
    for (let i = 0; i < total; i += tamañoLote) {
      const loteActual = documentosHuerfanos.slice(i, i + tamañoLote);
      const transaccion = client.transaction();
      
      loteActual.forEach(id => {
        transaccion.patch(id, {
          set: { tenant: TARGET_TENANT }
        });
      });

      await transaccion.commit();
      console.log(`✅ Lote procesado: ${Math.min(i + tamañoLote, total)} / ${total} elementos alineados.`);
    }

    console.log(`🏁 ESTRUCTURA COMPLETA. Ahora las categorías y formatos de ticket le pertenecen a "${TARGET_TENANT}".`);

  } catch (error) {
    console.error("❌ Error durante la alineación de estructura:", error.message);
  }
}

arreglarEstructuraMasiva();