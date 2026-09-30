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

   document.addEventListener("DOMContentLoaded", () => {
    // ------------------------------------------------------
    // 1. SELECTORES DE VISTAS Y MENÚ PRINCIPAL
    // ------------------------------------------------------
    const menuNiveles = document.getElementById("menu-niveles");
    const vistaJuego = document.getElementById("vista-juego");
    const vistaIntervalos = document.getElementById("vista-intervalos"); 
    const botonesSeleccionNivel = document.querySelectorAll(".boton-nivel:not(.bloqueado)");
    
    const botonVolverJuego = document.getElementById("btn-volver");
    const botonVolverIntervalos = document.getElementById("btn-volver-intervalos");

    let nivelActual = "Notas Cromáticas";

    // ------------------------------------------------------
    // 2. LÓGICA DEL NIVEL 1: NOTAS CROMÁTICAS
    // ------------------------------------------------------
    const botonesNotas = document.querySelectorAll(".contenedor-botones .boton-nota");
    const botonReto = document.getElementById("boton-reto");
    const mensajeEstado = document.getElementById("mensaje-estado");
    const spanPuntajeTotal = document.querySelector("#marcador-puntaje span");
    const listaHistorial = document.getElementById("lista-historial");

    const bancoNotas = [
        { nombre: "Do", frecuencia: 261.63 },
        { nombre: "Do# / Reb", frecuencia: 277.18 },
        { nombre: "Re", frecuencia: 293.66 },
        { nombre: "Re# / Mib", frecuencia: 311.13 },
        { nombre: "Mi", frecuencia: 329.63 },
        { nombre: "Fa", frecuencia: 349.23 },
        { nombre: "Fa# / Solb", frecuencia: 369.99 },
        { nombre: "Sol", frecuencia: 392.00 },
        { nombre: "Sol# / Lab", frecuencia: 415.30 },
        { nombre: "La", frecuencia: 440.00 },
        { nombre: "La# / Sib", frecuencia: 466.16 },
        { nombre: "Si", frecuencia: 493.88 }
    ];

    let notaSecreta = null;
    let puntajeTotal = 0; 

    // ------------------------------------------------------
    // 3. LÓGICA DEL NIVEL 2: INTERVALOS SIMPLES (24 NOTAS)
    // ------------------------------------------------------
    const bancoNotas24 = [
        { nombre: "Do 4", frecuencia: 261.63 },
        { nombre: "Do#4 / Reb4", frecuencia: 277.18 },
        { nombre: "Re 4", frecuencia: 293.66 },
        { nombre: "Re#4 / Mib4", frecuencia: 311.13 },
        { nombre: "Mi 4", frecuencia: 329.63 },
        { nombre: "Fa 4", frecuencia: 349.23 },
        { nombre: "Fa#4 / Solb4", frecuencia: 369.99 },
        { nombre: "Sol 4", frecuencia: 392.00 },
        { nombre: "Sol#4 / Lab4", frecuencia: 415.30 },
        { nombre: "La 4", frecuencia: 440.00 },
        { nombre: "La#4 / Sib4", frecuencia: 466.16 },
        { nombre: "Si 4", frecuencia: 493.88 },
        { nombre: "Do 5", frecuencia: 523.25 },
        { nombre: "Do#5 / Reb5", frecuencia: 554.37 },
        { nombre: "Re 5", frecuencia: 587.33 },
        { nombre: "Re#5 / Mib5", frecuencia: 622.25 },
        { nombre: "Mi 5", frecuencia: 659.25 },
        { nombre: "Fa 5", frecuencia: 698.46 },
        { nombre: "Fa#5 / Solb5", frecuencia: 739.99 },
        { nombre: "Sol 5", frecuencia: 783.99 },
        { nombre: "Sol#5 / Lab5", frecuencia: 830.61 },
        { nombre: "La 5", frecuencia: 880.00 },
        { nombre: "La#5 / Sib5", frecuencia: 932.33 },
        { nombre: "Si 5", frecuencia: 987.77 }
    ];

    const gridNotasIntervalos = document.getElementById("grid-notas-intervalos");

    function inicializarBotonesIntervalos() {
        if (!gridNotasIntervalos) return;
        gridNotasIntervalos.innerHTML = "";
        bancoNotas24.forEach((nota, index) => {
            const boton = document.createElement("button");
            boton.className = "boton-nota-intervalo";
            boton.textContent = nota.nombre;
            boton.setAttribute("data-index", index);
            boton.setAttribute("data-frecuencia", nota.frecuencia);
            gridNotasIntervalos.appendChild(boton);
        });
    }

    inicializarBotonesIntervalos();

    let notaSeleccionada1 = null;
    let notaSeleccionada2 = null;
    let intervaloObjetivo = null;

    const botonRetoIntervalo = document.getElementById("boton-reto-intervalo");
    const mensajeEstadoIntervalo = document.getElementById("mensaje-estado-intervalo");
    const panelOpcionesIntervalos = document.getElementById("panel-opciones-intervalos");
    const spanPuntajeIntervalos = document.querySelector("#marcador-puntaje-intervalos span");
    const listaHistorialIntervalos = document.getElementById("lista-historial-intervalos");
    const botonesOpcionIntervalo = document.querySelectorAll(".btn-opcion-intervalo");
    const btnDeseleccionar = document.getElementById("btn-deseleccionar");

    let puntajeIntervalosTotal = 0;

    // Reproducción de secuencia (Nota 1 -> Nota 2 -> Acorde simultáneo)
    function reproducirSecuenciaIntervalo(freq1, freq2) {
        const AudioContexto = window.AudioContext || window.webkitAudioContext;
        const contextoAudio = new AudioContexto();

        const ahora = contextoAudio.currentTime;
        const duracionNota = 0.6;
        const pausa = 0.15;

        // Nota 1
        const osc1 = contextoAudio.createOscillator();
        const gan1 = contextoAudio.createGain();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(freq1, ahora);
        gan1.gain.setValueAtTime(0.1, ahora);
        osc1.connect(gan1);
        gan1.connect(contextoAudio.destination);
        osc1.start(ahora);
        osc1.stop(ahora + duracionNota);

        // Nota 2
        const inicioNota2 = ahora + duracionNota + pausa;
        const osc2 = contextoAudio.createOscillator();
        const gan2 = contextoAudio.createGain();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(freq2, inicioNota2);
        gan2.gain.setValueAtTime(0.1, inicioNota2);
        osc2.connect(gan2);
        gan2.connect(contextoAudio.destination);
        osc2.start(inicioNota2);
        osc2.stop(inicioNota2 + duracionNota);

        // Acorde simultáneo
        const inicioAcorde = inicioNota2 + duracionNota + pausa;
        const oscA1 = contextoAudio.createOscillator();
        const oscA2 = contextoAudio.createOscillator();
        const ganAcorde = contextoAudio.createGain();

        oscA1.type = "sine";
        oscA2.type = "sine";
        oscA1.frequency.setValueAtTime(freq1, inicioAcorde);
        oscA2.frequency.setValueAtTime(freq2, inicioAcorde);
        ganAcorde.gain.setValueAtTime(0.08, inicioAcorde);

        oscA1.connect(ganAcorde);
        oscA2.connect(ganAcorde);
        ganAcorde.connect(contextoAudio.destination);

        oscA1.start(inicioAcorde);
        oscA2.start(inicioAcorde);
        oscA1.stop(inicioAcorde + duracionNota + 0.3);
        oscA2.stop(inicioAcorde + duracionNota + 0.3);
    }

    // Botón para escuchar el intervalo (genera nuevo reto o repite el actual)
    if (botonRetoIntervalo) {
        botonRetoIntervalo.addEventListener("click", () => {
            if (!notaSeleccionada1 || !notaSeleccionada2) {
                const index1 = Math.floor(Math.random() * bancoNotas24.length);
                intervaloObjetivo = Math.floor(Math.random() * 12) + 1;
                
                let index2 = index1 + intervaloObjetivo;
                if (index2 >= bancoNotas24.length) {
                    index2 = index1 - intervaloObjetivo;
                    intervaloObjetivo = Math.abs(index1 - index2);
                }

                notaSeleccionada1 = bancoNotas24[index1];
                notaSeleccionada2 = bancoNotas24[index2];
            }

            mensajeEstadoIntervalo.textContent = "🔊 Reproduciendo intervalo... Selecciona las dos notas en la cuadrícula.";
            mensajeEstadoIntervalo.className = "mensaje-neutro";

            reproducirSecuenciaIntervalo(notaSeleccionada1.frecuencia, notaSeleccionada2.frecuencia);
        });
    }

    // Selección de notas en la cuadrícula
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("boton-nota-intervalo")) {
            if (!notaSeleccionada1 || !notaSeleccionada2) {
                mensajeEstadoIntervalo.textContent = "⚠️ Primero haz clic en 'Escuchar Intervalo'.";
                mensajeEstado.className = "mensaje-error";
                return;
            }

            const freqBoton = parseFloat(e.target.getAttribute("data-frecuencia"));
            const nombreBoton = e.target.textContent;

            reproducirTono(freqBoton);
            e.target.classList.add("seleccionada");

            if (!window.usuarioNota1) {
                window.usuarioNota1 = { nombre: nombreBoton, frecuencia: freqBoton };
                mensajeEstadoIntervalo.textContent = `Nota 1: ${nombreBoton}. Selecciona la segunda nota.`;
                btnDeseleccionar.classList.remove("oculto");
            } else if (!window.usuarioNota2 && window.usuarioNota1.nombre !== nombreBoton) {
                window.usuarioNota2 = { nombre: nombreBoton, frecuencia: freqBoton };
                mensajeEstadoIntervalo.textContent = `Seleccionaste: ${window.usuarioNota1.nombre} y ${window.usuarioNota2.nombre}. ¿Qué intervalo es?`;
                panelOpcionesIntervalos.classList.remove("oculto");
            }
        }
    });

    // Botón deseleccionar
    if (btnDeseleccionar) {
        btnDeseleccionar.addEventListener("click", () => {
            window.usuarioNota1 = null;
            window.usuarioNota2 = null;
            document.querySelectorAll(".boton-nota-intervalo").forEach(b => b.classList.remove("seleccionada"));
            panelOpcionesIntervalos.classList.add("oculto");
            btnDeseleccionar.classList.add("oculto");
            mensajeEstadoIntervalo.textContent = "Selección borrada. Vuelve a elegir las dos notas.";
            mensajeEstadoIntervalo.className = "mensaje-neutro";
        });
    }

    // Validar respuesta de intervalo
    botonesOpcionIntervalo.forEach(btnOpcion => {
        btnOpcion.addEventListener("click", () => {
            const semitonosElegidos = parseInt(btnOpcion.getAttribute("data-intervalo"));

            const idx1 = bancoNotas24.findIndex(n => n.frecuencia === notaSeleccionada1.frecuencia);
            const idx2 = bancoNotas24.findIndex(n => n.frecuencia === notaSeleccionada2.frecuencia);
            const semitonosReales = Math.abs(idx1 - idx2);

            if (semitonosElegidos === semitonosReales) {
                mensajeEstadoIntervalo.textContent = `🎉 ¡Correcto! Es el intervalo correcto. (+15 pts)`;
                mensajeEstado.className = "mensaje-exito";
                puntajeIntervalosTotal += 15;
                spanPuntajeIntervalos.textContent = puntajeIntervalosTotal;

                guardarPuntajeEnServidor(15);
            } else {
                mensajeEstadoIntervalo.textContent = `❌ Fallaste. Era otro intervalo. Inténtalo de nuevo.`;
                mensajeEstado.className = "mensaje-error";
            }

            // Reiniciar estado
            notaSeleccionada1 = null;
            notaSeleccionada2 = null;
            window.usuarioNota1 = null;
            window.usuarioNota2 = null;
            document.querySelectorAll(".boton-nota-intervalo").forEach(b => b.classList.remove("seleccionada"));
            panelOpcionesIntervalos.classList.add("oculto");
            btnDeseleccionar.classList.add("oculto");
        });
    });

    // ------------------------------------------------------
    // 4. FUNCIONES GLOBALES DE AUDIO Y BACKEND
    // ------------------------------------------------------
    async function cargarHistorial() {
        try {
            const respuesta = await fetch("http://localhost:5001/api/puntajes");
            const resultado = await respuesta.json();
            
            // Seleccionamos ambas listas por si acaso existen en el DOM
            const listaNivel1 = document.getElementById("lista-historial");
            const listaNivel2 = document.getElementById("lista-historial-intervalos");
            
            let contenidoHTML = "";

            // Verificamos de forma clara si hay puntajes registrados
            if (resultado.puntajes.length === 0) {
                contenidoHTML = "<li>No hay puntajes registrados aún.</li>";
            } else {
                // Construimos la lista paso a paso de forma muy legible
                resultado.puntajes.forEach(item => {
                    contenidoHTML += `<li><span>Nivel: ${item.nivel}</span> <strong>+${item.puntaje} pts</strong> <small>${item.fecha}</small></li>`;
                });
            }

            // Actualizamos la interfaz para el Nivel 1 si existe
            if (listaNivel1) {
                listaNivel1.innerHTML = contenidoHTML;
            }

            // Actualizamos la interfaz para el Nivel 2 si existe
            if (listaNivel2) {
                listaNivel2.innerHTML = contenidoHTML;
            }

        } catch (error) {
            console.error("Error al cargar el historial:", error);
            const errorHTML = "<li>Error al conectar con el servidor.</li>";
            
            const listaNivel1 = document.getElementById("lista-historial");
            if (listaNivel1) {
                listaNivel1.innerHTML = errorHTML;
            }

            const listaNivel2 = document.getElementById("lista-historial-intervalos");
            if (listaNivel2) {
                listaNivel2.innerHTML = errorHTML;
            }
        }
    }

    cargarHistorial();

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
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ puntaje: puntosGanados, nivel: nivelActual })
            });
            const resultado = await respuesta.json();
            console.log("Puntaje guardado en SQLite con éxito:", resultado);
            cargarHistorial();
        } catch (error) {
            console.error("Error al conectar con el servidor Flask:", error);
        }
    }

    // ------------------------------------------------------
    // 5. NAVEGACIÓN ENTRE MENÚ Y NIVELES
    // ------------------------------------------------------
    botonesSeleccionNivel.forEach(boton => {
        boton.addEventListener("click", () => {
            const tipoNivel = boton.getAttribute("data-nivel");

            menuNiveles.classList.add("oculto");

            if (tipoNivel === "notas-cromaticas") {
                nivelActual = "Notas Cromáticas";
                vistaJuego.classList.remove("oculto");
                notaSecreta = null;
                mensajeEstado.textContent = "Haz clic en 'Escuchar Nota Secreta' para comenzar.";
                mensajeEstado.className = "mensaje-neutro";
            } else if (tipoNivel === "intervalos-simples") {
                nivelActual = "Intervalos Simples";
                vistaIntervalos.classList.remove("oculto");
            }
        });
    });

    if (botonVolverJuego) {
        botonVolverJuego.addEventListener("click", () => {
            vistaJuego.classList.add("oculto");
            menuNiveles.classList.remove("oculto");
        });
    }

    if (botonVolverIntervalos) {
        botonVolverIntervalos.addEventListener("click", () => {
            vistaIntervalos.classList.add("oculto");
            menuNiveles.classList.remove("oculto");
        });
    }

    // ------------------------------------------------------
    // 6. EVENTOS DEL JUEGO: NIVEL 1
    // ------------------------------------------------------
    if (botonReto) {
        botonReto.addEventListener("click", () => {
            const indiceAleatorio = Math.floor(Math.random() * bancoNotas.length);
            notaSecreta = bancoNotas[indiceAleatorio];

            mensajeEstado.textContent = "🔊 ¡Nota secreta reproducida! ¿Cuál fue?";
            mensajeEstado.className = "mensaje-neutro";
            
            reproducirTono(notaSecreta.frecuencia);
        });
    }

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

                puntajeTotal += 10;
                spanPuntajeTotal.textContent = puntajeTotal;

                guardarPuntajeEnServidor(10);
            } else {
                mensajeEstado.textContent = `❌ Fallaste. Era la nota ${notaSecreta.nombre}, elegiste ${notaSeleccionada}.`;
                mensajeEstado.className = "mensaje-error";
            }
        });
    });
});