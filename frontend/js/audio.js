/* ==========================================================
   GUÍA DE CONSULTA HISTÓRICA - ENTRENADOR AUDITIVO
   ========================================================== */

/* ----------------------------------------------------------
   1. EJEMPLO BÁSICO CRUDO (Día 3 - Inicio de la Web Audio API)
   const contexto = new AudioContext();
   const oscilador = contexto.createOscillator();
   const volumen = contexto.createGain();
   volumen.gain.value = 0.1;
   oscilador.connect(volumen);
   volumen.connect(contexto.destination);
   oscilador.start();
   oscilador.stop(contexto.currentTime + 1);
-------------------------------------------------------------

   2. VERSIÓN MODULAR DE MÚLTIPLES NOTAS (Día 4)
   Función genérica para recibir frecuencias mediante querySelectorAll.
-------------------------------------------------------------

   3. LÓGICA DE JUEGO LOCAL (Día 5)
   Selección aleatoria con Math.random() y validación de aciertos.
---------------------------------------------------------- */


/* ==========================================================
   LÓGICA ACTIVA DEL JUEGO + CONEXIÓN CON BACKEND (Día 6)
   ========================================================== */

   document.addEventListener("DOMContentLoaded", () => {
    const botonesNotas = document.querySelectorAll(".contenedor-botones .boton-nota");
    const botonReto = document.getElementById("boton-reto");
    const mensajeEstado = document.getElementById("mensaje-estado");
    
    // 🌟 NUEVO: Seleccionamos el span del marcador de puntaje
    const spanPuntajeTotal = document.querySelector("#marcador-puntaje span");

    const bancoNotas = [
        { nombre: "Do", frecuencia: 261.63 },
        { nombre: "Mi", frecuencia: 329.63 },
        { nombre: "Sol", frecuencia: 392.00 }
    ];

    let notaSecreta = null;
    let puntajeTotal = 0; // 🌟 NUEVO: Variable para llevar la cuenta en la sesión

    function reproducirTono(frecuenciaHertzios) {
        const AudioContexto = window.AudioContext || window.webkitAudioContext;
        const contextoAudio = new AudioContexto();

        const oscilador = contextoAudio.createOscillator();
        oscilador.type = "sine";
        oscilador.frequency.setValueAtTime(frecuenciaHertzios, contextoAudio.currentTime);

        const nodoGanancia = contextoAudio.createGain();
        nodoGanancia.gain.setValueAtTime(0.1, contextoAudio.currentTime);

        oscilador.connect(nodoGanancia);
        nodoGanancia.connect(contextoAudio.destination);

        oscilador.start();
        oscilador.stop(contextoAudio.currentTime + 1.2);
    }

    async function guardarPuntajeEnServidor(puntosGanados) {
        try {
            const respuesta = await fetch("http://localhost:5001/api/puntajes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ puntaje: puntosGanados })
            });

            const resultado = await respuesta.json();
            console.log("Puntaje guardado en SQLite con éxito:", resultado);
        } catch (error) {
            console.error("Error al conectar con el servidor Flask:", error);
        }
    }

    botonReto.addEventListener("click", () => {
        const indiceAleatorio = Math.floor(Math.random() * bancoNotas.length);
        notaSecreta = bancoNotas[indiceAleatorio];

        mensajeEstado.textContent = "🔊 ¡Nota secreta reproducida! ¿Cuál fue?";
        mensajeEstado.className = "mensaje-neutro";
        
        reproducirTono(notaSecreta.frecuencia);
    });

    botonesNotas.forEach(boton => {
        boton.addEventListener("click", () => {
            if (!notaSecreta) {
                mensajeEstado.textContent = "⚠️ Primero haz clic en 'Escuchar Nota Secreta'.";
                mensajeEstado.className = "mensaje-error";
                return;
            }

            const notaSeleccionada = boton.getAttribute("data-nota");

            if (notaSeleccionada === notaSecreta.nombre) {
                mensajeEstado.textContent = `🎉 ¡Correcto! Acertaste, era la nota ${notaSecreta.nombre}. (+10 pts)`;
                mensajeEstado.className = "mensaje-exito";

                // 🌟 NUEVO: Incrementamos el puntaje local y actualizamos la interfaz visual
                puntajeTotal += 10;
                spanPuntajeTotal.textContent = puntajeTotal;

                // Enviamos los 10 puntos al backend de Flask para que los guarde en SQLite
                guardarPuntajeEnServidor(10);

            } else {
                mensajeEstado.textContent = `❌ Fallaste. Era la nota ${notaSecreta.nombre}, elegiste ${notaSeleccionada}.`;
                mensajeEstado.className = "mensaje-error";
            }
        });
    });
});