import { createClient } from '@sanity/client';
import fs from 'fs';
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

async function migrarInventario() {
    console.log(`📦 [FASE 2] Extrayendo inventario para [${TENANT}]...`);
    const rl = readline.createInterface({ input: fs.createReadStream(DESTELLO), crlfDelay: Infinity });
    let c = 0;

    for await (const line of rl) {
        if (!line.trim()) continue;
        const doc = JSON.parse(line);

        if (doc._type === 'inventario') {
            c++;
            const limpioId = doc._id.replace('drafts.', '');
            const molde = {
                _id: limpioId,
                _type: 'inventario',
                nombre: doc.nombre ? doc.nombre.trim() : 'Insumo sin nombre',
                stockActual: Number(doc.stockActual || 0),
                stockMinimo: Number(doc.stockMinimo || 0),
                barcode: doc.barcode || '',
                codigoBalanza: doc.codigoBalanza || null,
                tenant: TENANT
            };

            try {
                await client.createOrReplace(molde);
                console.log(`  ✅ [${c}] Insumo: ${molde.nombre}`);
            } catch (err) {
                console.error(`  ❌ Error en ${doc.nombre}:`, err.message);
            }
        }
    }
    console.log(`🏁 FASE 2 TERMINADA. Insumos procesados: ${c}\n`);
}
migrarInventario();