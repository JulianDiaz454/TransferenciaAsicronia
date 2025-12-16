// app4.js

const pedido = {
    id: "PED-789",
    productos: 5,
    montoBase: 1000
};

// --- FUNCIONES ASÍNCRONAS DE PROCESAMIENTO ---

// Validar stock (1000ms)
function ValidarStock(pedido) {
    console.log(`Inicio stock ${pedido.id}`);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (pedido.productos < 10) {
                resolve({ estado: "Stock OK", data: pedido });
            } else {
                reject({ error: "Stock Insuficiente" }); 
            }
        }, 1000);
    });
}

// Calcular costos finales (1500ms)
function CalcularCostos(data) {
    console.log(`Inicio costos ${data.id}`);
    return new Promise((resolve) => {
        setTimeout(() => {
            const costoFinal = data.montoBase * 1.19; 
            resolve({ estado: "Costos OK", data: { ...data, costoFinal } });
        }, 1500);
    });
}

// Generar recomendaciones (500ms) - Corre en paralelo
function GenerarRecomendaciones(pedidoId) {
    console.log(`Inicio recomendacion ${pedidoId} (PARALELO)`);
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`Fin recomendacion ${pedidoId}`);
            resolve({ estado: "Recomendación OK" });
        }, 500);
    });
}

// Enviar factura (800ms)
function EnviarFactura(data) {
    console.log(`Inicio factura ${data.id}`);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ estado: "Factura OK", total: data.costoFinal });
        }, 800);
    });
}

// --- GESTOR PRINCIPAL MIXTO ---

async function procesarPedido(pedido) {
    console.log(`--- INICIO PEDIDO ${pedido.id} ---`);
    const inicioGeneral = Date.now();

    // Iniciar Opcional en PARALELO
    const promesaRecomendacion = GenerarRecomendaciones(pedido.id);
    
    // Flujo OBLIGATORIO: Secuencial
    try {
        const stockData = await ValidarStock(pedido);
        const costosData = await CalcularCostos(stockData.data); 
        const factura = await EnviarFactura(costosData.data); 

        // Esperar que la opcional haya terminado
        await promesaRecomendacion;

        const tFinal = Date.now() - inicioGeneral;

        console.log("\n--- RESULTADO FINAL ---");
        console.log("Pedido Procesado OK");
        console.log(`Total: ${factura.total}`);
        console.log(`Tiempo: ${tFinal}ms`); 

    } catch (error) {
        // Captura de fallo obligatorio
        const tFinal = Date.now() - inicioGeneral;
        console.log("\n--- ERROR FATAL ---");
        console.error(`Fallo: ${error.error}`);
        console.log(`Tiempo: ${tFinal}ms`);
    }
}

// Ejecutar
procesarPedido(pedido);