import { createClient } from '@sanity/client';

const client = createClient({
    projectId: '',
    dataset: 'production',
    apiVersion: '2026-06-10',
    token: '',
    useCdn: false
});

const TENANT = 'fruverlaeconomianiko';

const MAPEO_CATEGORIAS = {
    'BANDEJAS': 'HipUx4AkhoAVzOqaoL03Vn',
    'FRUTAS M': 'HipUx4AkhoAVzOqaoL06Ci',
    'FRUTAS T-Z': 'HipUx4AkhoAVzOqaoL074E',
    'PAQUETES': 'HipUx4AkhoAVzOqaoL07Ti',
    'TUBERCULOS': 'HipUx4AkhoAVzOqaoL092Y',
    'UNIDAD': 'HipUx4AkhoAVzOqaoL03Vn',
    'FRUTAS N-P': 'lam0QrU1I74uWM1Y3sjt6C',
    'TARROS': 'lam0QrU1I74uWM1Y3sjyjn',
    'VERDURAS A-H': 'lam0QrU1I74uWM1Y3sk2WE',
    'FRUTAS A-F': 'v2QPAS0EbzGFgyFjtaQysL',
    'FRUTAS G-L': 'v2QPAS0EbzGFgyFjtaQzVY',
    'HORTALIZA': 'v2QPAS0EbzGFgyFjtaR3Yx',
    'VERDURAS I-Z': 'v2QPAS0EbzGFgyFjtaR8v5'
};

const PRODUCTOS_A_MIGRAR = [
    { nombre: 'BANDEJA DE AGRAS', cat: 'BANDEJAS', precio: 5000 },
    { nombre: 'BANDEJA DE AJONJOLI', cat: 'BANDEJAS', precio: 5000 },
    { nombre: 'BANDEJA DE ARANDANOS', cat: 'BANDEJAS', precio: 8000 },
    { nombre: 'BANDEJA DE CIRUELA', cat: 'BANDEJAS', precio: 4500 },
    { nombre: 'BANDEJA DE CURCUMA', cat: 'BANDEJAS', precio: 3500 },
    { nombre: 'BANDEJA DE CHAMPIÑON TAJADO', cat: 'BANDEJAS', precio: 3000 },
    { nombre: 'BANDEJA DE CHIA', cat: 'BANDEJAS', precio: 5000 },
    { nombre: 'BANDEJA DE FRESA', cat: 'BANDEJAS', precio: 8500 },
    { nombre: 'BANDEJA DE LINAZA', cat: 'BANDEJAS', precio: 5000 },
    { nombre: 'BANDEJA DE MANZANA', cat: 'BANDEJAS', precio: 9000 },
    { nombre: 'BANDEJA DE PIÑA', cat: 'BANDEJAS', precio: 2000 },
    { nombre: 'BANDEJA DE RAICES CHINAS', cat: 'BANDEJAS', precio: 3000 },
    { nombre: 'BANDEJA DE REPOLLITAS', cat: 'BANDEJAS', precio: 5000 },
    { nombre: 'BANDEJA DE TOMATE CHERRY', cat: 'BANDEJAS', precio: 4000 },
    { nombre: 'BANDEJA DE UCHUA', cat: 'BANDEJAS', precio: 3500 },
    { nombre: 'BANDEJA DE UVA ISABELA', cat: 'BANDEJAS', precio: 3500 },
    { nombre: 'BANDEJA DE YACON', cat: 'BANDEJAS', precio: 5000 },
    { nombre: 'AGUACATE HASS', cat: 'FRUTAS A-F', precio: 16000 },
    { nombre: 'AGUACATE PAPELILLO', cat: 'FRUTAS A-F', precio: 18000 },
    { nombre: 'ANON', cat: 'FRUTAS A-F', precio: 6000 },
    { nombre: 'BANANO BOCADILLO', cat: 'FRUTAS A-F', precio: 5000 },
    { nombre: 'BANANO CRIOLLO', cat: 'FRUTAS A-F', precio: 3600 },
    { nombre: 'BANANO URABA', cat: 'FRUTAS A-F', precio: 3600 },
    { nombre: 'BOROJO', cat: 'UNIDAD', precio: 2500 },
    { nombre: 'BREVAS', cat: 'FRUTAS A-F', precio: 8000 },
    { nombre: 'CIRUELA CHILENA', cat: 'UNIDAD', precio: 3000 },
    { nombre: 'CIRUELA NACIONAL', cat: 'FRUTAS A-F', precio: 7000 },
    { nombre: 'COCO', cat: 'UNIDAD', precio: 8500 },
    { nombre: 'CURUBA', cat: 'FRUTAS A-F', precio: 6800 },
    { nombre: 'DURAZNO CHILENO', cat: 'UNIDAD', precio: 3000 },
    { nombre: 'DURAZNOS', cat: 'FRUTAS A-F', precio: 7200 },
    { nombre: 'FEIJOA', cat: 'FRUTAS A-F', precio: 8000 },
    { nombre: 'FRESA', cat: 'FRUTAS A-F', precio: 17000 },
    { nombre: 'GRANADA', cat: 'UNIDAD', precio: 10000 },
    { nombre: 'GRANADILLA', cat: 'UNIDAD', precio: 2200 },
    { nombre: 'GUANABANA', cat: 'FRUTAS G-L', precio: 6000 },
    { nombre: 'GUAYABA PERA', cat: 'FRUTAS G-L', precio: 6400 },
    { nombre: 'HIGO', cat: 'FRUTAS G-L', precio: 8000 },
    { nombre: 'KIWI', cat: 'FRUTAS G-L', precio: 22000 },
    { nombre: 'LIMON', cat: 'FRUTAS G-L', precio: 5600 },
    { nombre: 'LIMON MANDARINO', cat: 'FRUTAS G-L', precio: 4000 },
    { nombre: 'LULO GRUESO', cat: 'FRUTAS G-L', precio: 8400 },
    { nombre: 'MAMONCILLO', cat: 'FRUTAS M', precio: 8000 },
    { nombre: 'MAMONCILLO CHINO', cat: 'FRUTAS M', precio: 14000 },
    { nombre: 'MANDARINA ARRAYANA', cat: 'FRUTAS M', precio: 5200 },
    { nombre: 'MANDARINA ISRAELA', cat: 'FRUTAS M', precio: 5200 },
    { nombre: 'MANGO AZUCAR', cat: 'FRUTAS M', precio: 8400 },
    { nombre: 'MANGO COMUN', cat: 'FRUTAS M', precio: 5000 },
    { nombre: 'MANGO TOMMY', cat: 'FRUTAS M', precio: 6800 },
    { nombre: 'MANGOSTINO', cat: 'FRUTAS M', precio: 8000 },
    { nombre: 'MANZANA DE AGUA', cat: 'FRUTAS M', precio: 6000 },
    { nombre: 'MANZANA ROJA', cat: 'UNIDAD', precio: 2200 },
    { nombre: 'MANZANA ROYAL', cat: 'UNIDAD', precio: 2200 },
    { nombre: 'MANZANA VERDE', cat: 'UNIDAD', precio: 2200 },
    { nombre: 'MARACUYA', cat: 'FRUTAS M', precio: 7000 },
    { nombre: 'MELON', cat: 'FRUTAS M', precio: 3600 },
    { nombre: 'MORA', cat: 'FRUTAS M', precio: 8000 },
    { nombre: 'NARANJA TANGELO', cat: 'FRUTAS N-P', precio: 5600 },
    { nombre: 'NARANJA VALENCIA', cat: 'FRUTAS N-P', precio: 3200 },
    { nombre: 'PAPAYA', cat: 'FRUTAS N-P', precio: 3600 },
    { nombre: 'PAPAYA MARADOL', cat: 'FRUTAS N-P', precio: 2000 },
    { nombre: 'PAPAYUELA', cat: 'FRUTAS N-P', precio: 8000 },
    { nombre: 'PATILLA', cat: 'FRUTAS N-P', precio: 3600 },
    { nombre: 'PATILLA BABY', cat: 'FRUTAS N-P', precio: 4000 },
    { nombre: 'PERA CHILENA', cat: 'UNIDAD', precio: 2200 },
    { nombre: 'PERA NACIONAL', cat: 'FRUTAS N-P', precio: 3000 },
    { nombre: 'PITAYA', cat: 'FRUTAS N-P', precio: 10000 },
    { nombre: 'PIÑA GOLDEN', cat: 'FRUTAS N-P', precio: 4600 },
    { nombre: 'PIÑA GOLDEN PAREJA', cat: 'UNIDAD', precio: 3000 },
    { nombre: 'PIÑA PEROLERA', cat: 'UNIDAD', precio: 5000 },
    { nombre: 'TAMARINDO', cat: 'UNIDAD', precio: 2500 },
    { nombre: 'TOMATE DE ARBOL COMUN', cat: 'FRUTAS T-Z', precio: 6400 },
    { nombre: 'TOMATE DE ARBOL POLLO', cat: 'FRUTAS T-Z', precio: 7600 },
    { nombre: 'UVA CHILENA', cat: 'FRUTAS T-Z', precio: 24000 },
    { nombre: 'UVA NACIONAL', cat: 'FRUTAS T-Z', precio: 14000 },
    { nombre: 'ZAPOTE', cat: 'FRUTAS T-Z', precio: 6000 },
    { nombre: 'ACELGA', cat: 'UNIDAD', precio: 3000 },
    { nombre: 'APIO', cat: 'UNIDAD', precio: 4000 },
    { nombre: 'AROMATICAS', cat: 'UNIDAD', precio: 1400 },
    { nombre: 'BROCOLI', cat: 'UNIDAD', precio: 3000 },
    { nombre: 'CANENDULA', cat: 'UNIDAD', precio: 1400 },
    { nombre: 'CILANTRO', cat: 'UNIDAD', precio: 1800 },
    { nombre: 'COLIFLOR', cat: 'UNIDAD', precio: 4000 },
    { nombre: 'ESPINACA', cat: 'UNIDAD', precio: 3000 },
    { nombre: 'GUASCAS', cat: 'UNIDAD', precio: 1800 },
    { nombre: 'LECHUGA BATAVIA', cat: 'UNIDAD', precio: 3500 },
    { nombre: 'LECHUGA CRESPA', cat: 'UNIDAD', precio: 2500 },
    { nombre: 'LECHUGA MORADA', cat: 'UNIDAD', precio: 2500 },
    { nombre: 'PEREJIL', cat: 'UNIDAD', precio: 1800 },
    { nombre: 'RAMA DE APIO', cat: 'UNIDAD', precio: 500 },
    { nombre: 'REPOLLO', cat: 'HORTALIZA', precio: 4000 },
    { nombre: 'SABILA', cat: 'UNIDAD', precio: 2500 },
    { nombre: 'TOMILLO Y LAUREL', cat: 'UNIDAD', precio: 1400 },
    { nombre: 'BOLSA', cat: 'UNIDAD', precio: 200 },
    { nombre: 'MALLA DE NARANJA', cat: 'UNIDAD', precio: 5600 },
    { nombre: 'PAQUETES DE ARVEJA', cat: 'UNIDAD', precio: 2000 },
    { nombre: 'PAQUETE DE VERDURA', cat: 'UNIDAD', precio: 2000 },
    { nombre: 'PAQUETE DE CARBON', cat: 'UNIDAD', precio: 19000 },
    { nombre: 'PAQUETE CRISTAL DE SABILA', cat: 'UNIDAD', precio: 3000 },
    { nombre: 'PAQUETE DE CUBIOS Y CHUGUAS', cat: 'UNIDAD', precio: 2000 },
    { nombre: 'PAQUETE DE FLOR DE JAMAICA', cat: 'UNIDAD', precio: 3000 },
    { nombre: 'PAQUETE DE MAZORCA', cat: 'UNIDAD', precio: 2000 },
    { nombre: 'PAQUETE DE MORINGA', cat: 'PAQUETES', precio: 0 },
    { nombre: 'PAQUETE DE PAPA CRIOLLA', cat: 'PAQUETES', precio: 0 },
    { nombre: 'PAQUETE DE PAPA SAN LUIS GRUESA', cat: 'PAQUETES', precio: 0 },
    { nombre: 'PAQUETE DE PAPA SAN LUIS PAREJA', cat: 'PAQUETES', precio: 0 },
    { nombre: 'PAQUETE DE PLATANO', cat: 'PAQUETES', precio: 0 },
    { nombre: 'PAQUETES', cat: 'PAQUETES', precio: 0 },
    { nombre: 'BOTELLA DE MIEL', cat: 'TARROS', precio: 0 },
    { nombre: 'MIEL ORIGINAL', cat: 'TARROS', precio: 0 },
    { nombre: 'TARRO GRANDE DE AJO-AJI', cat: 'TARROS', precio: 0 },
    { nombre: 'TARRO MEDIANO', cat: 'TARROS', precio: 0 },
    { nombre: 'TARRO MEDIANO AJO AJI', cat: 'TARROS', precio: 0 },
    { nombre: 'TARRO PEQUEÑO', cat: 'TARROS', precio: 0 },
    { nombre: 'ZUMO GRANDE', cat: 'TARROS', precio: 0 },
    { nombre: 'ZUMO PEQUEÑO', cat: 'TARROS', precio: 0 },
    { nombre: 'AJO CHIÑLENO MALLA', cat: 'TUBERCULOS', precio: 0 },
    { nombre: 'AJO CHILENO POR UNIDAD', cat: 'TUBERCULOS', precio: 0 },
    { nombre: 'AJO NACIONAL', cat: 'TUBERCULOS', precio: 0 },
    { nombre: 'ARRACACHA', cat: 'TUBERCULOS', precio: 0 },
    { nombre: 'CEBOLLA CABEZONA', cat: 'TUBERCULOS', precio: 0 },
    { nombre: 'CEBOLLACABEZONA ROJA', cat: 'TUBERCULOS', precio: 0 },
    { nombre: 'CEBOLLA LARGA', cat: 'TUBERCULOS', precio: 0 },
    { nombre: 'JENGIBRE', cat: 'TUBERCULOS', precio: 0 },
    { nombre: 'PAPA CRIOLLA', cat: 'TUBERCULOS', precio: 0 },
    { nombre: 'PAPA PASTUSA', cat: 'TUBERCULOS', precio: 0 },
    { nombre: 'PAPA SABANERA', cat: 'TUBERCULOS', precio: 0 },
    { nombre: 'REMOLACHA', cat: 'TUBERCULOS', precio: 0 },
    { nombre: 'YUCA', cat: 'TUBERCULOS', precio: 0 },
    { nombre: 'ZANAHORIA', cat: 'TUBERCULOS', precio: 0 },
    { nombre: 'ALCACHOFA', cat: 'VERDURAS A-H', precio: 0 },
    { nombre: 'ARVEJA EN CASCARA', cat: 'VERDURAS A-H', precio: 0 },
    { nombre: 'ARVEJA DESGRANADA', cat: 'VERDURAS A-H', precio: 0 },
    { nombre: 'AUYAMA', cat: 'VERDURAS A-H', precio: 0 }
];

async function migrarFruverEnUnSoloRequest() {
    console.log(`🚀 Preparando transacción masiva para [${TENANT}]...`);
    
    // 1. Inicializamos una transacción vacía de Sanity
    let tx = client.transaction();
    let c = 0;

    for (const prod of PRODUCTOS_A_MIGRAR) {
        c++;
        const limpioId = `plato-${prod.nombre.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
        const precioSeguro = Number(prod.precio || 0);
        const categoriaTexto = prod.cat ? prod.cat.trim() : '';
        const categoriaRefId = MAPEO_CATEGORIAS[categoriaTexto] || null;

        const molde = {
            _id: limpioId,
            _type: 'plato',
            nombre: prod.nombre.trim(),
            precio: precioSeguro,
            precioCosto: 0,
            disponible: true,
            totalVentas: 0,
            tenant: TENANT,
            barcode: null,
            codigoBalanza: null,
            controlaInventario: false,
            recetaInsumos: []
        };

        if (categoriaRefId) {
            molde.categoria = {
                _type: 'reference',
                _ref: categoriaRefId
            };
        }

        // 2. En lugar de ejecutar la petición a internet en cada vuelta, la añadimos a la transacción local
        tx = tx.createOrReplace(molde);
    }

    try {
        console.log(`📡 Enviando paquete de ${c} productos en una sola mutación API...`);
        
        // 3. Aquí es donde ocurre el ÚNICO request real de red
        await tx.commit();
        
        console.log(`\n🏁 ¡MIGRACIÓN EXITOSA! Se inyectaron todos los productos usando un solo API Request.`);
    } catch (err) {
        console.error(`❌ Falló la mutación masiva:`, err.message);
    }
}

migrarFruverEnUnSoloRequest();