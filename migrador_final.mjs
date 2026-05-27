import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';

const client = createClient({
  projectId: 'iw0bo8ft',
  dataset: 'production',
  useCdn: false,
  token: 'skdqB1R4tAY0eF8jk7Mg2iQTVrBXYWqL7QJr37KBmdEH8jceilcOLk9yVKFbWA1Gq8YY1I2PPNWui0C91VaX17gdO2hjzy3dSpO1HsZXI91cb1cbtlBVDXwzAGcTcEBXBZvbDIFFuLS3gY3CnCspU5FFqmRykK8YViFHodZmYci47vq1SlZf',
  apiVersion: '2024-05-11',
});

const CHAT_FILE = './chat.txt';
const IMGS_DIR = './fotos_wa';

// FUNCIÓN DINÁMICA: Busca el ID real por el NOMBRE de la categoría
async function obtenerCategoriaId(nombreProducto) {
  const n = nombreProducto.toLowerCase();
  let nombreCategoria = "BEBIDAS"; // Por defecto

  if (n.includes('papas') || n.includes('margarita') || n.includes('doritos') || n.includes('detodito') || n.includes('paquete')) {
    nombreCategoria = "PAQUETES";
  }

  try {
    // Buscamos en Sanity el documento que tenga ese título exactamente
    const query = `*[_type == "categoria" && (titulo == $cat || nombre == $cat)][0]._id`;
    const idEncontrado = await client.fetch(query, { cat: nombreCategoria });
    
    if (!idEncontrado) {
      console.error(`⚠️  ATENCIÓN: No encontré la categoría "${nombreCategoria}" en Sanity. Revisa que esté publicada.`);
      return null;
    }
    return idEncontrado;
  } catch (error) {
    return null;
  }
}

async function migrar() {
  if (!fs.existsSync(CHAT_FILE)) return console.error("❌ No encuentro el archivo chat.txt");
  
  const contenido = fs.readFileSync(CHAT_FILE, 'utf-8');
  const bloques = contenido.split(/\d{1,2}\/\d{1,2}\/\d{2,4},/);

  console.log("🚀 Iniciando migración INTELIGENTE...");

  for (let i = 0; i < bloques.length; i++) {
    const texto = bloques[i];
    if (!texto) continue;

    const matchImagen = texto.match(/IMG-\d+-WA\d+\.jpg/);
    
    if (matchImagen) {
        const nombreArchivo = matchImagen[0];
        const textoLimpio = texto.replace(nombreArchivo, '').replace(/\(archivo adjunto\)/gi, '').replace(/.*-.*:/, '').trim();
        
        const matchPrecio = textoLimpio.match(/(\d{1,3}([.,]\d{3})*)/);
        let precio = 0;
        if (matchPrecio) {
            precio = parseInt(matchPrecio[0].replace(/[.,]/g, ''));
            if (precio < 1000 && precio > 0) precio *= 1000; 
        }

        let nombreRaw = textoLimpio.split(matchPrecio ? matchPrecio[0] : '____')[0].replace(/[:,\-]/g, '').trim();
        if (nombreRaw.length < 3) nombreRaw = textoLimpio.replace(/[0-9.,]/g, '').replace(/[:\-]/g, '').trim();

        // 1. OBTENER ID REAL
        const catId = await obtenerCategoriaId(nombreRaw);
        if (!catId) continue; // Si no hay categoría, saltamos para no dar error

        const rutaFoto = path.join(IMGS_DIR, nombreArchivo);

        if (fs.existsSync(rutaFoto)) {
            try {
                console.log(`📸 Subiendo: ${nombreRaw}...`);
                const asset = await client.assets.upload('image', fs.createReadStream(rutaFoto));
                
                await client.create({
                    _type: 'plato',
                    nombre: nombreRaw,
                    precio: precio,
                    disponible: true,
                    categoria: { _type: 'reference', _ref: catId },
                    imagen: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
                });
                console.log(`✅ ${nombreRaw} subido.`);
            } catch (err) {
                console.error(`❌ Error en ${nombreRaw}:`, err.message);
            }
        }
    }
  }
  console.log("🏁 MIGRACIÓN TERMINADA.");
}

migrar();