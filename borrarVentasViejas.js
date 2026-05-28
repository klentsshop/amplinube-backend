import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'sgyd5ub4', // Tu ID de proyecto nuevo
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN || 'skwItJdVTpo5PJjRp4cRH4blzsMxcJelPGyQumcKJEGuJnRbXKtLaauKmfTmJCK7v4Tp87v8sB58NWxi5KeOw6u23fXFFXcuWPdOmoNVShaJp8Nmi4IYgyBIazrYXRfWi1JxTmX4zQB8ZzzFSKrCeLck2R5BWkTUKI4XiSrlzhG9uN1s7HX3', 
  apiVersion: '2024-08-01',
});

async function limpiezaContableMasiva() {
  // 📋 Agregamos todos los tipos de esquema que guardan historial monetario viejo
  // 'gasto' para tus egresos y 'caja' o 'cierre' si manejabas flujos de caja viejos
  const TIPOS_A_BORRAR = ['gasto', 'caja', 'cierreDia']; 

  console.log(`🔍 Buscando registros contables antiguos (gastos/cajas) sin tenant...`);

  try {
    // 📡 Buscamos documentos de estos tipos que NO tengan la propiedad tenant definida
    const registrosViejos = await client.fetch(
      `*[_type in $tipos && !defined(tenant)]._id`,
      { tipos: TIPOS_A_BORRAR }
    );

    const total = registrosViejos.length;
    console.log(`📦 Se encontraron ${total} registros contables huérfanos en el limbo.`);

    if (total === 0) {
      console.log("🏁 ¡Limpieza contable al día! No quedan gastos ni cajas del pasado.");
      return;
    }

    console.log(`🗑️ Iniciando purga de egresos e historial...`);

    // Procesamos en bloques de 100 por seguridad de la API
    const tamañoLote = 100;
    for (let i = 0; i < total; i += tamañoLote) {
      const loteActual = registrosViejos.slice(i, i + tamañoLote);
      const transaccion = client.transaction();
      
      loteActual.forEach(id => {
        transaccion.delete(id); // Borrado definitivo
      });

      await transaccion.commit();
      console.log(`🧹 Eliminados: ${Math.min(i + tamañoLote, total)} / ${total} registros viejos.`);
    }

    console.log(`🏁 BASE DE DATOS PURIFICADA. Se eliminaron los gastos del pasado con éxito.`);

  } catch (error) {
    console.error("❌ Error durante la eliminación de gastos:", error.message);
  }
}

limpiezaContableMasiva();