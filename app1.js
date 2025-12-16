// app9_cola.js

const solicitudes = [
    { id: 101, nombre: "Ana", tiempo_ms: 1500 },
    { id: 102, nombre: "Luis", tiempo_ms: 2200 },
    { id: 103, nombre: "María", tiempo_ms: 800 },
    { id: 104, nombre: "Pedro", tiempo_ms: 1800 }
];

// Funcion que simula la atencion de una solicitud (devuelve una Promesa)
function atenderSolicitud(solicitud) {
    console.log(`\n>> INICIO: Atendiendo a ${solicitud.nombre} (ID: ${solicitud.id})...`);
    const inicioAtencion = Date.now();
    
    return new Promise((resolve) => {
        setTimeout(() => {
            const finAtencion = Date.now();
            const duracion = finAtencion - inicioAtencion;
            
            console.log(`FIN: ${solicitud.nombre} atendido`);
            
            // Resolvemos con el objeto de resultado
            resolve({
                id: solicitud.id,
                nombre: solicitud.nombre,
                duracion: duracion
            });
        }, solicitud.tiempo_ms);
    });
}

// Funcion asincrona para procesar la cola secuencialmente
async function gestionarCola(cola) {
    console.log("--- GESTIÓN DE COLA INICIADA ---");
    const inicioProceso = Date.now();
    const resultados = [];

    // El for...of con await garantiza el orden secuencial 
    for (const solicitud of cola) {
        // await pausa la ejecucion hasta que la solicitud actual termine
        const resultado = await atenderSolicitud(solicitud);
        resultados.push(resultado);
    }
    
    const finProceso = Date.now();
    const tiempoTotal = finProceso - inicioProceso;
    
    console.log("\n--- REPORTE FINAL ---");
    resultados.forEach((res) => {
        console.log(`Usuario: ${res.nombre} | ID: ${res.id} | Duración: ${res.duracion}ms`);
    });
    console.log(`\nTIEMPO TOTAL DEL PROCESO: ${tiempoTotal}ms`);
    
    // El tiempo total debe ser la suma de todos los tiempos simulados (1500 + 2200 + 800 + 1800 = 6300ms)
}

// Ejecutar el proceso
gestionarCola(solicitudes);

console.log("\n(El programa principal sigue ejecutándose mientras espera las atenciones...)");