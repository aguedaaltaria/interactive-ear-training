// Esperamos a que la página cargue por completo antes de interactuar con el DOM
document.addEventListener("DOMContentLoaded", () => {
    const botonReproducir = document.getElementById("boton-reproducir");

    // Función encargada de sintetizar y reproducir un tono puro
    function reproducirTonoPuro() {
        // 1. Creamos el contexto de audio del navegador (el motor de sonido)
        const AudioContexto = window.AudioContext || window.webkitAudioContext;
        const contextoAudio = new AudioContexto();

        // 2. Creamos un oscilador (es el generador de la onda matemática del sonido)
        const oscilador = contextoAudio.createOscillator();
        
        // Configuramos el tipo de onda: 'sine' (senoidal) genera un tono limpio y suave
        oscilador.type = "sine";
        
        // Frecuencia en Hertzios (440 Hz corresponde a la nota La estándar)
        oscilador.frequency.setValueAtTime(440, contextoAudio.currentTime);

        // 3. Creamos un control de volumen (GainNode) para evitar chasquidos molestos al iniciar/parar
        const nodoGanancia = contextoAudio.createGain();
        nodoGanancia.gain.setValueAtTime(0.1, contextoAudio.currentTime); // Volumen al 10% por seguridad

        // 4. Conectamos los bloques: Oscilador -> Control de Volumen -> Altavoces del dispositivo
        oscilador.connect(nodoGanancia);
        nodoGanancia.connect(contextoAudio.destination);

        // 5. Iniciamos la reproducción del tono y programamos su apagado automático a los 1.5 segundos
        oscilador.start();
        oscilador.stop(contextoAudio.currentTime + 1.5);
    }

    // Vinculamos el evento de clic del botón a nuestra función de audio
    botonReproducir.addEventListener("click", () => {
        reproducirTonoPuro();
    });
});