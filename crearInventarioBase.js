import { createClient } from '@sanity/client';

// 🔌 CONEXIÓN CON TU PROYECTO MAESTRO
const client = createClient({
  projectId: 'sgyd5ub4', 
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN || 'skwItJdVTpo5PJjRp4cRH4blzsMxcJelPGyQumcKJEGuJnRbXKtLaauKmfTmJCK7v4Tp87v8sB58NWxi5KeOw6u23fXFFXcuWPdOmoNVShaJp8Nmi4IYgyBIazrYXRfWi1JxTmX4zQB8ZzzFSKrCeLck2R5BWkTUKI4XiSrlzhG9uN1s7HX3', 
  apiVersion: '2024-08-01',
});

async function clonarCatalogoAInventarioCompleto() {
  const TARGET_TENANT = 'leosalsamentaria';

  console.log(`📡 Leyendo el catálogo COMPLETO de productos de "${TARGET_TENANT}"...`);

  try {
    // 🚀 CAMBIO CLAVE: Añadimos [0...5000] para romper el límite de 100 y traer todo de un solo golpe
    const platosExistentes = await client.fetch(
      `*[_type == "plato" && tenant == $tenant][0...5000]{
        nombre,
        barcode,
        codigoBalanza
      }`,
      { tenant: TARGET_TENANT }
    );

    const totalPlatos = platosExistentes.length;
    console.log(`📦 ¡Ahora sí! Se encontraron ${totalPlatos} productos en el catálogo total.`);

    if (totalPlatos === 0) {
      console.log("⚠️ No hay productos registrados para este tenant.");
      return;
    }

    // Verificamos qué hay en el inventario para no duplicar lo que ya se creó en el intento anterior
    console.log(`🔍 Verificando qué productos ya tienen inventario para no duplicarlos...`);
    const inventarioActual = await client.fetch(
      `*[_type == "inventario" && tenant == $tenant].nombre`,
      { tenant: TARGET_TENANT }
    );
    
    const nombresExistentes = new Set(
      inventarioActual.filter(n => typeof n === 'string').map(n => n.toLowerCase().trim())
    );

    console.log(`⚡ Procesando los productos faltantes...`);
    
    // 🔨 PROCESAMIENTO EN TRANSACCIONES POR SEGURIDAD
    // Sanity no permite crear más de 500 documentos en una sola transacción mutacional.
    // Por eso, procesaremos los más de 1,500 restantes en ráfagas seguras de 100 en 100.
    let documentosCreados = 0;
    const tamañoLote = 100;
    
    // Filtramos primero los platos que de verdad necesitan inventario nuevo
    const platosPorCrear = platosExistentes.filter(plato => {
      if (!plato.nombre || typeof plato.nombre !== 'string') return false;
      return !nombresExistentes.has(plato.nombre.trim().toLowerCase());
    });

    console.log(`🧩 Faltan por crear ${platosPorCrear.length} espejos de inventario.`);

    if (platosPorCrear.length === 0) {
      console.log("🏁 ¡Todo al día! Todos los productos ya tienen su espejo en stock.");
      return;
    }

    for (let i = 0; i < platosPorCrear.length; i += tamañoLote) {
      const loteActual = platosPorCrear.slice(i, i + tamañoLote);
      const transaccion = client.transaction();

      loteActual.forEach(plato => {
        const nombreLimpio = plato.nombre.trim();
        
        transaccion.create({
          _type: 'inventario',
          nombre: nombreLimpio,
          stockActual: 1,
          stockMinimo: 0,
          unidadMedida: 'unidades',
          tenant: TARGET_TENANT,
          ...(plato.barcode && typeof plato.barcode === 'string' && { barcode: plato.barcode.trim() }),
          ...(plato.codigoBalanza && typeof plato.codigoBalanza === 'string' && { codigoBalanza: plato.codigoBalanza.trim() })
        });
        documentosCreados++;
      });

      await transaccion.commit();
      console.log(`🚀 Lote subido con éxito. Avance: ${documentosCreados} / ${platosPorCrear.length}`);
    }

    console.log(`🏁 MIGRACIÓN INVENTARIO COMPLETADA. Se añadieron los ${documentosCreados} registros restantes.`);

  } catch (error) {
    console.error("❌ Error crítico en el inventario masivo:", error.message);
  }
}

clonarCatalogoAInventarioCompleto();