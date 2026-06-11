import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import readline from 'readline';

// Configuración Supabase
const supabase = createClient('', 'tu_key_aqui');
const TENANT = 'nuevo_negocio_id'; // <--- CAMBIA ESTO PARA CADA NEGOCIO
const DESTELLO = './data.ndjson';

async function migrarTodo() {
    console.log(`🚀 [INICIANDO] Migración blindada para: [${TENANT}]...`);
    const rl = readline.createInterface({ input: fs.createReadStream(DESTELLO), crlfDelay: Infinity });
    
    for await (const line of rl) {
        if (!line.trim()) continue;
        const doc = JSON.parse(line);

        // 1. MIGRACIÓN DE VENTAS (Upsert: inserta o actualiza)
        if (doc._type === 'venta') {
            const venta = {
                transaccion_id: doc._id,
                tenant_id: TENANT,
                folio: doc.folio || `MIG-${doc._id.slice(-6)}`,
                total_pagado: Number(doc.totalPagado || 0).toFixed(2),
                platos_vendidos: doc.platosVendidosV2 || [],
                detalle_pagos: doc.detallePagos || [],
                fecha_iso: doc.fecha || doc._createdAt,
                fecha_local: doc.fechaLocal || new Date(doc._createdAt).toLocaleString('es-CO'),
                tipo_orden: doc.tipoOrden || 'mesa'
            };

            const { error } = await supabase.from('ventas').upsert(venta, { onConflict: 'transaccion_id' });
            if (error) console.error(`❌ Error venta ${doc._id}:`, error.message);
            else console.log(`✅ Venta procesada: ${doc._id}`);
        }

        // 2. MIGRACIÓN DE GASTOS (Upsert: inserta o actualiza)
        if (doc._type === 'gasto') {
            const gasto = {
                id: doc._id,
                tenant_id: TENANT,
                descripcion: doc.descripcion || 'Sin descripción',
                monto: Number(doc.monto || 0).toFixed(2),
                created_at: doc.fecha ? new Date(doc.fecha).toISOString() : doc._createdAt
            };

            const { error } = await supabase.from('gastos').upsert(gasto, { onConflict: 'id' });
            if (error) console.error(`❌ Error gasto ${doc._id}:`, error.message);
            else console.log(`✅ Gasto procesado: ${doc._id}`);
        }
    }
    console.log("✨ MIGRACIÓN FINALIZADA CON ÉXITO.");
}

migrarTodo();