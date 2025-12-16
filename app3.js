// app3.js

const datosFormulario = {
    correo: "usuario@ejemplo.com",
    documento: "102030405",
    nombre: "Roberto"
};

// --- VALIDACIONES CON PROMESAS ---

// 1. Validar correo (1200ms)
function ValidarCorreo(correo) {
    console.log(`-> Correo: ${correo}`);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ validacion: "correo", estado: "OK" });
        }, 1200);
    });
}

// 2. Validar documento (800ms, falla)
function ValidarDocumento(doc) {
    console.log(`-> Documento: ${doc}`);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject({ validacion: "documento", estado: "FALLO", error: "Lista negra" });
        }, 800);
    });
}

// 3. Validar disponibilidad (1500ms)
function ValidarDisponibilidad(nombre) {
    console.log(`-> Disponibilidad: ${nombre}`);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ validacion: "disponibilidad", estado: "OK" });
        }, 1500);
    });
}

// --- GESTOR PRINCIPAL (Promise.all) ---

async function validarFormulario(datos) {
    console.log("--- INICIO VALIDACIÓN PARALELA ---");
    const inicioGeneral = Date.now();

    // Las promesas se lanzan al mismo tiempo
    const promesas = [
        ValidarCorreo(datos.correo),
        ValidarDocumento(datos.documento),
        ValidarDisponibilidad(datos.nombre)
    ];

    try {
        // Espera a que todas terminen OK
        const resultados = await Promise.all(promesas);

        const tFinal = Date.now() - inicioGeneral;
        
        console.log("\n--- RESULTADO FINAL ---");
        console.log("Validado");
        console.log(`Tiempo: ${tFinal}ms`);
        // console.log("Detalles:", resultados); // Descomentar para ver el objeto final

    } catch (error) {
        // Captura el error si alguna falla
        const tFinal = Date.now() - inicioGeneral;
        
        console.log("\n--- RESULTADO FINAL ---");
        console.error(`FALLO: ${error.validacion}`);
        console.error(`Razón: ${error.error}`);
        console.log(`Tiempo hasta el fallo: ${tFinal}ms`);
    }
}

// Ejecutar
validarFormulario(datosFormulario);