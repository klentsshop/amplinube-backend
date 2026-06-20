// Archivo: backend/purga.js
import { createClient } from '@sanity/client';

// 🛡️ Inicialización directa con las credenciales de tu proyecto para no depender de carpetas locales
const client = createClient({
  projectId: '',
  dataset: 'production',
  apiVersion: '2024-08-01',
  token: ''
});

async function purgaTransaccionalMasiva() {
    try {
        console.log("📡 Conectando directamente con la API de Sanity...");
        
        const query = `*[_type in ['venta', 'ticketCobro']]._id`;
        const ids = await client.fetch(query);

        if (!ids || ids.length === 0) {
            console.log("✅ ¡Ecosistema impecable! No quedan documentos de tipo 'venta' o 'ticketCobro'.");
            return;
        }

        console.log(`🗑️ Se detectaron ${ids.length} documentos. Preparando transacción única destructiva...`);

        const transaccion = client.transaction();
        ids.forEach(id => {
            transaccion.delete(id);
        });

        console.log("⚡ Enviando commit atómico a Sanity (Costo: 1 Request de mutación)...");
        await transaccion.commit();

        console.log(`🎉 ¡Éxito rotundo! Se eliminaron los ${ids.length} documentos de un solo golpe.`);

    } catch (error) {
        console.error("🔥 Error crítico durante la purga masiva:", error.message);
        console.log("\n💡 Nota: Si el error es de permisos, asegúrate de que tu terminal tenga cargado el Token de Sanity con permisos de escritura.");
    }
}

purgaTransaccionalMasiva();