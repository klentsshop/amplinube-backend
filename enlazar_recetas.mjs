import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'iw0bo8ft',
  dataset: 'production',
  useCdn: false,
  token: 'skdqB1R4tAY0eF8jk7Mg2iQTVrBXYWqL7QJr37KBmdEH8jceilcOLk9yVKFbWA1Gq8YY1I2PPNWui0C91VaX17gdO2hjzy3dSpO1HsZXI91cb1cbtlBVDXwzAGcTcEBXBZvbDIFFuLS3gY3CnCspU5FFqmRykK8YViFHodZmYci47vq1SlZf',
  apiVersion: '2024-05-11',
});

async function enlazarPlatosConInventario() {
  console.log("🔗 Iniciando vinculación de recetas...");

  try {
    // 1. Obtenemos todos los platos y todos los registros de inventario
    const platos = await client.fetch('*[_type == "plato"]{_id, nombre}');
    const inventarios = await client.fetch('*[_type == "inventario"]{_id, nombre}');

    for (const plato of platos) {
      // 2. Buscamos el insumo que tenga el mismo nombre que el plato
      const insumoCorrespondiente = inventarios.find(
        inv => inv.nombre.toLowerCase() === plato.nombre.toLowerCase()
      );

      if (insumoCorrespondiente) {
        console.log(`Matching: ${plato.nombre} 🔄 ${insumoCorrespondiente.nombre}`);

        // 3. Actualizamos el plato para activar el inventario y crear la "receta"
        await client
          .patch(plato._id)
          .set({
            controlaInventario: true,
            recetaInsumos: [
              {
                _key: Math.random().toString(36).substring(2, 9), // Sanity requiere una key única en arrays
                _type: 'itemReceta',
                insumo: {
                  _type: 'reference',
                  _ref: insumoCorrespondiente._id
                },
                cantidad: 1
              }
            ]
          })
          .commit();

        console.log(`✅ ${plato.nombre} vinculado correctamente.`);
      } else {
        console.warn(`⚠️ No se encontró insumo para: ${plato.nombre}`);
      }
    }
    console.log("🏁 ¡Vinculación masiva terminada!");
  } catch (err) {
    console.error("❌ Error en el proceso:", err.message);
  }
}

enlazarPlatosConInventario();