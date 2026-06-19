import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import readline from 'readline';

const supabase = createClient('');
const TENANT = 'longchino';
const DESTELLO = './data.ndjson';

async function migrarVentaPorVenta() {
    console.log(`🚀 [VENTAS] Iniciando migración INDIVIDUAL para: [${TENANT}]...`);
    const rl = readline.createInterface({ input: fs.createReadStream(DESTELLO), crlfDelay: Infinity });
    
    let cont = 0;
    let errores = [];

    for await (const line of rl) {
        if (!line.trim()) continue;
        const v = JSON.parse(line);

        // Filtro estricto: Excluimos tickets de impresión o cobro previo para asegurar los 188 millones exactos
        if (v._type === 'venta' && !v.isTicket && v._type !== 'ticketCobro') {
            cont++;
            
            // Lógica contable de cálculo para columnas planas
            let efectivo = 0, tarjeta = 0, digital = 0;
            const listaPagos = v.detallePagos || [{ metodo: v.metodoPago, monto: v.totalPagado }];
            
            listaPagos.forEach(p => {
                const m = (p.metodo || 'efectivo').toLowerCase();
                const monto = Number(p.monto || 0);
                if (m.includes('tarjeta')) tarjeta += monto;
                else if (m.includes('nequi') || m.includes('davi') || m.includes('digital') || m.includes('transferencia')) digital += monto;
                else efectivo += monto;
            });

            // Saneamiento y estructura limpia del array de detallePagos para el fallback del POS
            const detallePagosFormateado = listaPagos.map(p => ({
                _key: p._key || Math.random().toString(36).substring(2, 15),
                metodo: (p.metodo || v.metodoPago || 'efectivo').toLowerCase().trim(),
                monto: Math.round(Number(p.monto || v.totalPagado || 0)) // Entero puro para coincidir con la tienda exitosa
            }));

            // Construcción de la fecha local en formato sueco (YYYY-MM-DD HH:mm:ss) para alineación del calendario
            let fechaLocalCalculada = v.fechaLocal;
            if (!fechaLocalCalculada) {
                const baseDate = v.fecha || v._createdAt;
                fechaLocalCalculada = baseDate 
                    ? new Date(baseDate).toLocaleString('sv-SE', { timeZone: 'America/Bogota' }).replace(',', '')
                    : new Date().toLocaleString('sv-SE', { timeZone: 'America/Bogota' }).replace(',', '');
            }

            // Construcción del objeto de inserción libre de truncamientos destructivos
            const venta = {
                transaccion_id: v._id,
                folio: String(v.folio || `MIG-${new Date(v._createdAt || Date.now()).getTime().toString().slice(-6)}`),
                tenant_id: TENANT,
                mesa: String(v.mesa || '0').slice(0, 90), // Único campo con corte controlado para nombres extensos de domicilios
                tipo_orden: String(v.tipoOrden || 'mesa').trim(),
                mesero: String(v.mesero || 'Caja').trim(),
                metodo_pago: String(v.metodoPago || 'efectivo').toLowerCase().trim(),
                total_pagado: Number(v.totalPagado || 0), // Número puro decimal sin truncar en string
                propina_recaudada: Number(v.propinaRecaudada || 0),
                fecha_iso: v.fecha || v._createdAt || new Date().toISOString(),
                fecha_local: fechaLocalCalculada,
                detalle_pagos: detallePagosFormateado, // Array de objetos nativo (JSONB)
                platos_vendidos: v.platosVendidosV2 || [], // Array de objetos nativo (JSONB) sin alterar strings
                pago_efectivo: Number(efectivo),
                pago_tarjeta: Number(tarjeta),
                pago_digital: Number(digital),
                created_at: v._createdAt || new Date().toISOString()
            };

            // Inserción individual en Supabase
            const { error } = await supabase.from('ventas').insert(venta);
            
            if (error) {
                console.error(`❌ ERROR en ID: ${v._id} | Folio: ${venta.folio} | Motivo: ${error.message}`);
                errores.push({ id: v._id, error: error.message });
            } else {
                console.log(`✅ [${cont}] Insertada con éxito: ${v._id}`);
            }
        }
    }
    
    console.log("\n✨ PROCESO DE MIGRACIÓN FINALIZADO.");
    console.log(`📊 Total de registros procesados: ${cont}`);
    console.log(`📊 Total de errores encontrados: ${errores.length}`);
    if (errores.length > 0) {
        console.log("📝 LISTA DE IDs FALLIDOS PARA REVISIÓN:");
        console.table(errores);
    }
}

migrarVentaPorVenta();