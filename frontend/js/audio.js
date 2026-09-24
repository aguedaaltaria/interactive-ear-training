// Esperamos a que la página cargue por completo antes de interactuar con el DOM
document.addEventListener("DOMContentLoaded", () => {
    // 1. Seleccionamos todos los botones de notas musicales dentro del contenedor
    const botonesNotas = document.querySelectorAll(".contenedor-botones button");

    // 2. Función genérica para reproducir un tono basado en una frecuencia específica en Hertzios
    function reproducirTono(frecuenciaHertzios) {
        // Creamos el contexto de audio del navegador (el motor de sonido)
        const AudioContexto = window.AudioContext || window.webkitAudioContext;
        const contextoAudio = new AudioContexto();

        // Creamos el oscilador y configuramos su onda senoidal ('sine') para un tono limpio
        const oscilador = contextoAudio.createOscillator();
        oscilador.type = "sine";
        
        // Asignamos la frecuencia dinámica que recibimos por parámetro
        oscilador.frequency.setValueAtTime(frecuenciaHertzios, contextoAudio.currentTime);

        // Creamos el control de volumen (GainNode) para proteger los oídos (10% de volumen)
        const nodoGanancia = contextoAudio.createGain();
        nodoGanancia.gain.setValueAtTime(0.1, contextoAudio.currentTime);

        // Conectamos los nodos: Oscilador -> Control de Volumen -> Salida de audio del dispositivo
        oscilador.connect(nodoGanancia);
        nodoGanancia.connect(contextoAudio.destination);

        // Iniciamos el sonido y programamos su apagado automático a los 1.2 segundos
        oscilador.start();
        oscilador.stop(contextoAudio.currentTime + 1.2);
    }

    // 3. Recorremos cada botón de nota y le asignamos un evento de escucha individual
    botonesNotas.forEach(boton => {
        boton.addEventListener("click", () => {
            // Extraemos el valor numérico de la frecuencia guardado en el atributo 'data-frecuencia'
            const frecuencia = parseFloat(boton.getAttribute("data-frecuencia"));
            
            // Llamamos a nuestra función pasando la frecuencia correspondiente
            reproducirTono(frecuencia);
        });
    });
});