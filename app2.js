// app10_paralelo.js

const paquetes = [
    { id: "P-001", destino: "Centro", tiempo_ms: 2500, falla: false },
    { id: "P-002", destino: "Norte", tiempo_ms: 1000, falla: false },
    { id: "P-003", destino: "Sur", tiempo_ms: 3000, falla: true }, // Falla
    { id: "P-004", destino: "Este", tiempo_ms: 1500, falla: false }
];

// Funcion que simula la entrega (devuelve Promesa)
function realizarEntrega(paquete) {
    console.log(`INICIO: ${paquete.id}`);
    const inicio = Date.now();
    
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const fin = Date.now();
            const duracion = fin - inicio;
            
            if (paquete.falla) {
                // Rechazamos
                console.log(`FALLO: ${paquete.id}`);
                reject({ id: paquete.id, razon: "Fallo de ruta" });
            } else {
                // Resolvemos
                console.log(`FIN: ${paquete.id}`);
                resolve({ id: paquete.id, destino: paquete.destino, duracion: duracion });
            }
        }, paquete.tiempo_ms);
    });
}

// Funcion async para gestionar todas las entregas en paralelo
async function gestionarEntregas(listaPaquetes) {
    console.log("--- INICIO GESTIÓN PARALELA ---");
    const inicioGeneral = Date.now();
    
    // Array de promesas
    const promesas = listaPaquetes.map(paquete => realizarEntrega(paquete));

    // Esperar a que todas terminen (éxito o fallo)
    const resultados = await Promise.allSettled(promesas);

    const finGeneral = Date.now();
    const tiempoTotal = finGeneral - inicioGeneral;
    
    console.log("\n--- INFORME FINAL ---");
    
    let completados = 0;
    let fallidos = 0;

    resultados.forEach((res) => {
        if (res.status === 'fulfilled') {
            completados++;
            console.log(`OK: ${res.value.id} (${res.value.duracion}ms)`);
        } else {
            fallidos++;
            console.error(`ERROR: ${res.reason.id}`);
        }
    });

    console.log("\nRESUMEN:");
    console.log(`Completadas: ${completados}`);
    console.log(`Fallidas: ${fallidos}`);
    console.log(`TOTAL: ${tiempoTotal}ms`);
}

// Ejecutar el proceso
gestionarEntregas(paquetes);