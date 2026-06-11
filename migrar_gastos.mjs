import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import readline from 'readline';

const supabase = createClient('', '');
const TENANT = 'tiendamyg';
const DESTELLO = './data.ndjson';

async function migrarGastosSeguro() {
    console.log(`🚀 [GASTOS] Iniciando migración protegida para: [${TENANT}]...`);
    const rl = readline.createInterface({ input: fs.createReadStream(DESTELLO), crlfDelay: Infinity });
    let batch = [];

    for await (const line of rl) {
        if (!line.trim()) continue;
        const g = JSON.parse(line);

        if (g._type === 'gasto') {
            batch.push({
                id: g._id,
                tenant_id: TENANT,
                descripcion: g.descripcion || 'Sin descripción',
                monto: Number(g.monto || 0).toFixed(2),
                created_at: g.fecha ? new Date(g.fecha).toISOString() : g._createdAt
            });

            if (batch.length >= 20) {
                const { error } = await supabase.from('gastos').insert(batch);
                if (error) console.error(`❌ Error en lote de gastos:`, error.message);
                else console.log("✅ Lote de gastos insertado.");
                batch = [];
            }
        }
    }
    
    if (batch.length > 0) {
        const { error } = await supabase.from('gastos').insert(batch);
        if (error) console.error(`❌ Error en lote final de gastos:`, error.message);
    }
    console.log("✨ MIGRACIÓN DE GASTOS FINALIZADA.");
}

migrarGastosSeguro();