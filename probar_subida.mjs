import { createClient } from '@sanity/client';
import axios from 'axios';

const client = createClient({
  projectId: 'o3qk2etl',
  dataset: 'production',
  useCdn: false,
  token: 'skWPEMr30b9VeQ3LkVDKT9SJg9HYLOUXBFruc4GH5zvFFOVsPijBxaLF3mjATt3x9Ea4uUb4qwjX4paVYpgoWdqzVSlsmNY1wlBtmQIeGOOWuc5S4c2QtSAYnfgUpqel6C9xqwvZlNLyr1ANpRAMAkGBbVn8a1URrcG1U32uc9QPt0GSIm0N',
  apiVersion: '2024-03-01',
});

const productosPrueba = [
  { barcode: '7702011166050', nombre: 'Bombombun tajin', categoria: 'DULCES', precio: 1600 },
  { barcode: '7702535010327', nombre: 'Agua brisa', categoria: 'GASEOSAS', precio: 1600 },
  { barcode: '7702535034507', nombre: 'Suero Flashlyte', categoria: 'GASEOSAS', precio: 6500 }
];

async function buscarImagenMercadoLibre(barcode) {
  try {
    // Buscamos el producto en la API pública de Mercado Libre Colombia
    const url = `https://api.mercadolibre.com/sites/MCO/search?q=${barcode}`;
    const response = await axios.get(url);
    
    if (response.data.results && response.data.results.length > 0) {
      // Retornamos la imagen del primer resultado encontrado
      return response.data.results[0].thumbnail.replace("-I.jpg", "-O.jpg"); // Cambiamos a alta resolución
    }
  } catch (e) {
    return null;
  }
  return null;
}

async function subirASanity(url, nombre) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');

    // Filtro de seguridad por si acaso
    if (buffer.length < 5000) return null;

    const asset = await client.assets.upload('image', buffer, { filename: `${nombre}.jpg` });
    return { _type: 'image', asset: { _type: "reference", _ref: asset._id } };
  } catch (e) { return null; }
}

async function ejecutar() {
  console.log('🛍️ Buscando en Mercado Libre (Sin Labiales)...');
  
  for (const prod of productosPrueba) {
    console.log(`🔍 Buscando: ${prod.nombre}...`);
    
    const urlFoto = await buscarImagenMercadoLibre(prod.barcode);
    
    const queryCat = `*[_type == "categoria" && (titulo == $nombre || nombre == $nombre)][0]._id`;
    const catId = await client.fetch(queryCat, { nombre: prod.categoria });

    if (!catId) {
      console.log(`❌ Categoría "${prod.categoria}" no encontrada.`);
      continue;
    }

    const imagenAsset = urlFoto ? await subirASanity(urlFoto, prod.nombre) : null;

    try {
      await client.create({
        _type: 'plato',
        nombre: prod.nombre,
        precio: prod.precio,
        barcode: prod.barcode,
        disponible: true,
        categoria: { _type: 'reference', _ref: catId },
        imagen: imagenAsset || undefined
      });
      console.log(imagenAsset ? `✅ ${prod.nombre} subido con FOTO DE ML.` : `⚠️ ${prod.nombre} sin foto.`);
    } catch (err) {
      console.error(`❌ Error: ${err.message}`);
    }
  }
}

ejecutar();