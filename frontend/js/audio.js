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
   LÓGICA ACTIVA DEL JUEGO + NAVEGACIÓN DE NIVELES (Día 9)
   ========================================================== */

   window.bancoNotas24 = [
    { nombre: "Do 4", frecuencia: 261.63 }, { nombre: "Do#4 / Reb4", frecuencia: 277.18 },
    { nombre: "Re 4", frecuencia: 293.66 }, { nombre: "Re#4 / Mib4", frecuencia: 311.13 },
    { nombre: "Mi 4", frecuencia: 329.63 }, { nombre: "Fa 4", frecuencia: 349.23 },
    { nombre: "Fa#4 / Solb4", frecuencia: 369.99 }, { nombre: "Sol 4", frecuencia: 392.00 },
    { nombre: "Sol#4 / Lab4", frecuencia: 415.30 }, { nombre: "La 4", frecuencia: 440.00 },
    { nombre: "La#4 / Sib4", frecuencia: 466.16 }, { nombre: "Si 4", frecuencia: 493.88 },
    { nombre: "Do 5", frecuencia: 523.25 }, { nombre: "Do#5 / Reb5", frecuencia: 554.37 },
    { nombre: "Re 5", frecuencia: 587.33 }, { nombre: "Re#5 / Mib5", frecuencia: 622.25 },
    { nombre: "Mi 5", frecuencia: 659.25 }, { nombre: "Fa 5", frecuencia: 698.46 },
    { nombre: "Fa#5 / Solb5", frecuencia: 739.99 }, { nombre: "Sol 5", frecuencia: 783.99 },
    { nombre: "Sol#5 / Lab5", frecuencia: 830.61 }, { nombre: "La 5", frecuencia: 880.00 },
    { nombre: "La#5 / Sib5", frecuencia: 932.33 }, { nombre: "Si 5", frecuencia: 987.77 }
];

window.reproducirTono = function(frecuenciaHertzios) {
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
};

window.reproducirTonoLargo = function(freq, duracion = 1.2, gananciaBase = 0.08) {
    const AudioContexto = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContexto();
    const ahora = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ahora);
    gain.gain.setValueAtTime(0.001, ahora);
    gain.gain.linearRampToValueAtTime(gananciaBase, ahora + 0.05);
    gain.gain.setValueAtTime(gananciaBase, ahora + duracion - 0.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, ahora + duracion);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ahora);
    osc.stop(ahora + duracion);
};

window.reproducirAcordeSimultaneo = function(frecuencias) {
    const AudioContexto = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContexto();
    const ahora = ctx.currentTime;
    const duracion = 2.0;
    const gananciaNota = 0.07 / Math.sqrt(frecuencias.length);

    frecuencias.forEach(freq => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ahora);
        gain.gain.setValueAtTime(0.001, ahora);
        gain.gain.linearRampToValueAtTime(gananciaNota, ahora + 0.08);
        gain.gain.setValueAtTime(gananciaNota, ahora + duracion - 0.3);
        gain.gain.exponentialRampToValueAtTime(0.0001, ahora + duracion);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ahora);
        osc.stop(ahora + duracion);
    });
};

window.reproducirSecuenciaAcorde = async function(frecuencias) {
    for (let freq of frecuencias) {
        window.reproducirTonoLargo(freq, 1.2, 0.09);
        await new Promise(r => setTimeout(r, 1400));
    }
    await new Promise(r => setTimeout(r, 300));
    window.reproducirAcordeSimultaneo(frecuencias);
};

window.cargarHistorial = async function() {
    const usuarioActualId = localStorage.getItem("ear_training_usuario_id");
    if (!usuarioActualId) return;
    try {
        const respuesta = await fetch(`http://localhost:5001/api/puntajes?usuario_id=${usuarioActualId}`);
        const resultado = await respuesta.json();
        
        ["lista-historial", "lista-historial-intervalos", "lista-historial-compuestos", "lista-historial-triadas"].forEach(id => {
            const lista = document.getElementById(id);
            if (!lista) return;
            if (resultado.puntajes.length === 0) {
                lista.innerHTML = "<li style='justify-content: center; color: var(--color-texto-suave);'>No hay puntajes registrados aún para este usuario.</li>";
            } else {
                let html = "";
                resultado.puntajes.forEach(item => {
                    const iconoEstado = item.resultado === 'fallo' ? '❌' : '✅';
                    html += `<li><span>${iconoEstado} Nivel: ${item.nivel}</span> <strong>+${item.puntaje} pts</strong> <small>${item.fecha}</small></li>`;
                });
                lista.innerHTML = html;
            }
        });
    } catch (error) {
        console.error("Error al cargar el historial:", error);
    }
};

window.guardarPuntajeGenerico = async function(puntos, nivel, resultado = 'acierto') {
    const usuarioActualId = localStorage.getItem("ear_training_usuario_id");
    if (!usuarioActualId) return;
    try {
        await fetch("http://localhost:5001/api/puntajes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario_id: usuarioActualId, puntaje: puntos, nivel: nivel, resultado: resultado })
        });
        window.cargarHistorial();
    } catch (error) {
        console.error("Error al registrar puntaje:", error);
    }
};