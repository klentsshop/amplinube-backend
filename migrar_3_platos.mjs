import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

const client = createClient({
    projectId: 'sgyd5ub4',
    dataset: 'production',
    apiVersion: '2026-06-10',
    token: 'skwItJdVTpo5PJjRp4cRH4blzsMxcJelPGyQumcKJEGuJnRbXKtLaauKmfTmJCK7v4Tp87v8sB58NWxi5KeOw6u23fXFFXcuWPdOmoNVShaJp8Nmi4IYgyBIazrYXRfWi1JxTmX4zQB8ZzzFSKrCeLck2R5BWkTUKI4XiSrlzhG9uN1s7HX3',
    useCdn: false
});

const TENANT = 'lateliercafejacky';
const DESTELLO = './data.ndjson';

// Función para limpiar la ruta de la imagen y obtener la ruta física local real
function obtenerRutaLocalImagen(sanityAssetStr) {
    if (!sanityAssetStr) return null;
    // Ejemplo: image@file://./images/0e1a44b4a823f88fc1e6d7289571686947071c2f-550x550.jpg
    const coincidencia = sanityAssetStr.match(/file:\/\/(\.\/images\/.+)/);
    if (coincidencia && coincidencia[1]) {
        return coincidencia[1]; // Retorna './images/0e1a44b4...'
    }
    return null;
}

async function migrarPlatosConImagenesLocales() {
    console.log(`🚀 [FASE 3] Iniciando inyección estructural y subida de imágenes locales para [${TENANT}]...`);
    const rl = readline.createInterface({ input: fs.createReadStream(DESTELLO), crlfDelay: Infinity });
    let c = 0;

    for await (const line of rl) {
        if (!line.trim()) continue;
        const doc = JSON.parse(line);

        if (doc._type === 'plato') {
            c++;
            const limpioId = doc._id.replace('drafts.', '');
            const nuevaCatRef = doc.categoria?._ref ? doc.categoria._ref.replace('drafts.', '') : null;
            
            let assetRefReal = null;

            // 1. Si el documento tiene información de imagen, la subimos primero de forma física
            if (doc.imagen?._sanityAsset) {
                const rutaRelativa = obtenerRutaLocalImagen(doc.imagen._sanityAsset);
                const rutaAbsoluta = path.resolve(rutaRelativa);

                if (fs.existsSync(rutaAbsoluta)) {
                    try {
                        console.log(`  📸 Subiendo archivo físico de imagen para: ${doc.nombre}...`);
                        const streamImagen = fs.createReadStream(rutaAbsoluta);
                        
                        // Subimos el archivo binario directamente a la API de Sanity Assets
                        const nuevoAsset = await client.assets.upload('image', streamImagen, {
                            filename: path.basename(rutaAbsoluta)
                        });
                        
                        assetRefReal = nuevoAsset._id; // Este ID sí existe de verdad en el nuevo proyecto
                        console.log(`  🔹 Imagen cargada con éxito en el servidor Maestro. ID: ${assetRefReal}`);
                    } catch (uploadErr) {
                        console.warn(`  ⚠️ No se pudo cargar el archivo físico de imagen para ${doc.nombre}:`, uploadErr.message);
                    }
                } else {
                    console.warn(`  ⚠️ Archivo físico de imagen no encontrado en la ruta local: ${rutaRelativa}`);
                }
            }

            // 2. Construimos el documento final de 16 propiedades usando el ID real del nuevo asset
            const molde = {
                _id: limpioId,
                _type: 'plato',
                nombre: doc.nombre ? doc.nombre.trim() : 'Producto sin nombre',
                precio: Number(doc.precio || 0),
                disponible: doc.disponible ?? true,
                totalVentas: Number(doc.totalVentas || 0),
                tenant: TENANT,
                barcode: doc.barcode || '',
                codigoBalanza: doc.codigoBalanza || null,
                controlaInventario: false, 
                recetaInsumos: [],         
                categoria: nuevaCatRef ? {
                    _type: 'reference',
                    _ref: nuevaCatRef
                } : undefined
            };

            // Solo adjuntamos el nodo de imagen si la subida física fue exitosa
            if (assetRefReal) {
                molde.imagen = {
                    _type: 'image',
                    asset: {
                        _type: 'reference',
                        _ref: assetRefReal
                    }
                };
            }

            // 3. Insertamos el plato en la base de datos maestro sin errores de referencia faltante
            try {
                await client.createOrReplace(molde);
                console.log(`  ✅ [${c}] Plato Migrado Completo: ${molde.nombre}`);
            } catch (err) {
                console.error(`  ❌ Error al insertar ${doc.nombre}:`, err.message);
            }
        }
    }
    console.log(`\n🏁 FASE 3 TERMINADA. Total Platos migrados con éxito: ${c}`);
}

migrarPlatosConImagenesLocales();