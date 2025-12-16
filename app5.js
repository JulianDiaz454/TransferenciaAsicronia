// app5.js

const USUARIO_ID = 5001;
// Control de fallos
const FORZAR_FALLO_SERVICIO_C = true; 

// --- SERVICIOS CON PROMESAS ---

// Servicio A: Disponibilidad (1500ms)
function ServicioA(id) {
    console.log(`-> A (1500ms)`);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ nombre: "Disponibilidad", estado: "OK", recurso: true });
        }, 1500);
    });
}

// Servicio B: Datos del Usuario (1000ms)
function ServicioB(id) {
    console.log(`-> B (1000ms)`);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ nombre: "Usuario", estado: "OK", datos: { nombre: "Juan", edad: 30 } });
        }, 1000);
    });
}

// Servicio C: Historial (2000ms)
function ServicioC(id, debeFallar) {
    console.log(`-> C (2000ms)`);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (debeFallar) {
                console.error(`<- C FALLO`);
                reject({ nombre: "Historial", error: "Error BD" });
            } else {
                resolve({ nombre: "Historial", estado: "OK", acciones: 5 });
            }
        }, 2000);
    });
}

// Servicio D: Recomendaciones (800ms) - Depende de B y C
function ServicioD(datosUsuario, historial) {
    console.log(`-> D (800ms)`);
    return new Promise((resolve) => {
        setTimeout(() => {
            const recomendacion = `Recomendación para ${datosUsuario.datos.nombre}.`;
            resolve({ nombre: "Recomendaciones", estado: "OK", mensaje: recomendacion });
        }, 800);
    });
}

// --- GESTOR CENTRAL ---

async function integrarServicios(id) {
    console.log(`--- INICIO INTEGRACIÓN ${id} ---`);
    const inicioGeneral = Date.now();

    // 1. Ejecutar A, B, C en PARALELO.
    const promesaA = ServicioA(id);
    const promesaB = ServicioB(id);
    const promesaC = ServicioC(id, FORZAR_FALLO_SERVICIO_C);

    try {
        // 2. Esperar A, B y C. Si C falla, salta al catch.
        const [resA, resB, resC] = await Promise.all([
            promesaA,
            promesaB,
            promesaC 
        ]);

        // 3. Ejecutar D (SEC.)
        const resD = await ServicioD(resB, resC);
        
        const tFinal = Date.now() - inicioGeneral;

        console.log("\n--- INFORME FINAL ---");
        console.log("Integración exitosa");
        console.log(`Recurso: ${resA.recurso}`);
        console.log(`Tiempo: ${tFinal}ms`);

    } catch (error) {
        // Captura el fallo
        const tFinal = Date.now() - inicioGeneral;
        
        console.log("\n--- INFORME FINAL ---");
        console.error("Integración fallida");
        console.error(`Fallo en: ${error.nombre}`);
        console.log(`Tiempo: ${tFinal}ms`);
    }
}

// Ejecutar
integrarServicios(USUARIO_ID);