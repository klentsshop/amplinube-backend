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

async function migrarCategorias() {
    console.log(`🗂️ [FASE 1] Extrayendo categorías para [${TENANT}]...`);
    const rl = readline.createInterface({ input: fs.createReadStream(DESTELLO), crlfDelay: Infinity });
    let c = 0;

    for await (const line of rl) {
        if (!line.trim()) continue;
        const doc = JSON.parse(line);

        if (doc._type === 'categoria') {
            c++;
            const limpioId = doc._id.replace('drafts.', '');
            const molde = {
                _id: limpioId,
                _type: 'categoria',
                titulo: doc.titulo || 'SIN TITULO',
                seImprime: doc.seImprime ?? true,
                slug: doc.slug || { _type: 'slug', current: (doc.titulo || 'cat').toLowerCase().replace(/\s+/g, '-') },
                tenant: TENANT
            };

            try {
                await client.createOrReplace(molde);
                console.log(`  ✅ [${c}] Categoría: ${molde.titulo}`);
            } catch (err) {
                console.error(`  ❌ Error en ${doc.titulo}:`, err.message);
            }
        }
    }
    console.log(`🏁 FASE 1 TERMINADA. Categorías procesadas: ${c}\n`);
}
migrarCategorias();