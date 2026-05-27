import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'iw0bo8ft',
  dataset: 'production',
  useCdn: false,
  token: 'skdqB1R4tAY0eF8jk7Mg2iQTVrBXYWqL7QJr37KBmdEH8jceilcOLk9yVKFbWA1Gq8YY1I2PPNWui0C91VaX17gdO2hjzy3dSpO1HsZXI91cb1cbtlBVDXwzAGcTcEBXBZvbDIFFuLS3gY3CnCspU5FFqmRykK8YViFHodZmYci47vq1SlZf',
  apiVersion: '2024-05-11',
});

async function sincronizarInventario() {
  console.log("🔍 Leyendo productos cargados desde Sanity...");
  
  try {
    // 1. Traemos los platos que ya subiste con el migrador de WhatsApp
    const platos = await client.fetch(`*[_type == "plato"]{nombre}`);
    
    console.log(`📦 Encontrados ${platos.length} productos. Creando registros de Stock...`);

    for (const plato of platos) {
      try {
        // 2. Creamos el documento de inventario con tus campos exactos
        await client.create({
          _type: 'inventario', 
          nombre: plato.nombre,      // Usamos el nombre del plato en minúsculas/como esté
          stockActual: 1,            // Valor inicial de 1 como pediste
          stockMinimo: 5,            // Valor por defecto según tu schema
          unidadMedida: 'unidades'   // Valor por defecto
        });
        
        console.log(`✅ Inventario listo para: ${plato.nombre}`);
      } catch (err) {
        console.error(`❌ Error con ${plato.nombre}:`, err.message);
      }
    }
    
    console.log("\n🏁 ¡TODO CARGADO! Ahora cada producto tiene un registro en Inventario / Stock.");
    
  } catch (error) {
    console.error("🔴 Error general en la carga:", error.message);
  }
}

sincronizarInventario();