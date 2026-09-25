/* ==========================================================
   GUÍA DE CONSULTA HISTÓRICA - ENTRENADOR AUDITIVO
   ========================================================== */

/* ----------------------------------------------------------
   1. EJEMPLO BÁSICO CRUDO (Día 3 - Inicio de la Web Audio API)
   El ejemplo más simple posible para entender cómo un oscilador 
   y un nodo de ganancia generan un tono de 440 Hz por 1 segundo:
-------------------------------------------------------------
const contexto = new AudioContext();
const oscilador = contexto.createOscillator();
const volumen = contexto.createGain();
volumen.gain.value = 0.1;
oscilador.connect(volumen);
volumen.connect(contexto.destination);
oscilador.start();
oscilador.stop(contexto.currentTime + 1);
---------------------------------------------------------- */


/* ----------------------------------------------------------
   2. VERSIÓN MODULAR DE MÚLTIPLES NOTAS (Día 4)
   Función genérica para recibir cualquier frecuencia y recorrer 
   botones mediante querySelectorAll y forEach:
-------------------------------------------------------------
function reproducirTonoBase(frecuenciaHertzios) {
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
---------------------------------------------------------- */


/* ==========================================================
   LÓGICA ACTIVA DEL JUEGO (Día 5)
   ========================================================== */

   document.addEventListener("DOMContentLoaded", () => {
    // Seleccionamos los elementos interactivos del DOM
    const botonesNotas = document.querySelectorAll(".contenedor-botones .boton-nota");
    const botonReto = document.getElementById("boton-reto");
    const mensajeEstado = document.getElementById("mensaje-estado");

    // Banco de datos con las notas disponibles y sus frecuencias exactas
    const bancoNotas = [
        { nombre: "Do", frecuencia: 261.63 },
        { nombre: "Mi", frecuencia: 329.63 },
        { nombre: "Sol", frecuencia: 392.00 }
    ];

    // Memoria global temporal para guardar la nota secreta actual del reto
    let notaSecreta = null;

    // Función genérica para sintetizar y reproducir cualquier frecuencia de audio
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

    // Evento del botón de reto morado: elige una nota al azar y la reproduce
    botonReto.addEventListener("click", () => {
        // Seleccionamos un índice aleatorio (0, 1 o 2) basado en la longitud del banco
        const indiceAleatorio = Math.floor(Math.random() * bancoNotas.length);
        notaSecreta = bancoNotas[indiceAleatorio];

        // Actualizamos el letrero en pantalla y disparamos el sonido
        mensajeEstado.textContent = "🔊 ¡Nota secreta reproducida! ¿Cuál fue?";
        mensajeEstado.className = "mensaje-neutro";
        
        reproducirTono(notaSecreta.frecuencia);
    });

    // Eventos para los botones donde el usuario intenta adivinar
    botonesNotas.forEach(boton => {
        boton.addEventListener("click", () => {
            // Validación de seguridad por si intentan adivinar antes de pedir el reto
            if (!notaSecreta) {
                mensajeEstado.textContent = "⚠️ Primero haz clic en 'Escuchar Nota Secreta'.";
                mensajeEstado.className = "mensaje-error";
                return;
            }

            // Extraemos la nota oculta en el atributo data-nota del botón presionado
            const notaSeleccionada = boton.getAttribute("data-nota");

            // Comparamos la elección del usuario contra la nota secreta de la memoria
            if (notaSeleccionada === notaSecreta.nombre) {
                mensajeEstado.textContent = `🎉 ¡Correcto! Acertaste, era la nota ${notaSecreta.nombre}.`;
                mensajeEstado.className = "mensaje-exito";
            } else {
                mensajeEstado.textContent = `❌ Fallaste. Era la nota ${notaSecreta.nombre}, elegiste ${notaSeleccionada}.`;
                mensajeEstado.className = "mensaje-error";
            }
        });
    });
});