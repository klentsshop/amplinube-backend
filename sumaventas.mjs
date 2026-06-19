import fs from 'fs';
import readline from 'readline';

const DESTELLO = './data.ndjson';

async function diagnosticoLimpio() {
    const rl = readline.createInterface({ input: fs.createReadStream(DESTELLO), crlfDelay: Infinity });
    let totalReal = 0;
    let countReal = 0;
    let totalIgnorado = 0;

    for await (const line of rl) {
        if (!line.trim()) continue;
        const v = JSON.parse(line);

        // Filtro estricto: solo suma si tiene totalPagado 
        // Y si NO es un ticket de cobro Y NO tiene el flag isTicket
        if (v.totalPagado && v._type !== 'ticketCobro' && !v.isTicket) {
            totalReal += Number(v.totalPagado);
            countReal++;
        } else if (v.totalPagado) {
            // Todo lo demás que tenga totalPagado pero sea ticket, se cuenta como ignorado
            totalIgnorado += Number(v.totalPagado);
        }
    }
    
    console.log(`--- DIAGNÓSTICO FILTRADO ---`);
    console.log(`Ventas reales encontradas: ${countReal}`);
    console.log(`Suma total REAL: $${totalReal.toLocaleString()}`);
    console.log(`Dinero ignorado (tickets/cobros): $${totalIgnorado.toLocaleString()}`);
}

diagnosticoLimpio();