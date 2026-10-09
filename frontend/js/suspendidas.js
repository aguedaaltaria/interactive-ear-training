/* ==========================================================
   LÓGICA DEL NIVEL 5: TRÍADAS SUSPENDIDAS E INVERSIONES (suspendidas.js)
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    // ------------------------------------------------------
    // 1. CONEXIÓN CON LOS ELEMENTOS DE LA PANTALLA (HTML)
    // ------------------------------------------------------
    const cuadriculaDeNotasSuspendidas = document.getElementById("grid-notas-suspendidas");
    const botonDeEscucharAcordeSuspendido = document.getElementById("boton-reto-suspendidas");
    const cuadroDeMensajeVisualSuspendidas = document.getElementById("mensaje-estado-suspendidas");
    const etiquetaPuntajeMostradoSuspendidas = document.querySelector("#marcador-puntaje-suspendidas span");
    const botonParaBorrarSeleccionSuspendidas = document.getElementById("btn-deseleccionar-suspendidas");
    const listaDeBotonesDeCualidadSuspendida = document.querySelectorAll(".btn-cualidad-suspendida");

    // ------------------------------------------------------
    // 2. VARIABLES DE MEMORIA PARA EL JUEGO ACTUAL
    // ------------------------------------------------------
    let listaDeNotasDelAcordeSecretoSuspendido = [];
    let cualidadSecretaDelAcordeSuspendido = null; // Guardará si es "sus2" o "sus4"
    
    let listaDeNotasElegidasPorElUsuario = [];
    let cualidadElegidaPorElUsuario = null;
    let contadorDePuntosTotalesSuspendidas = 0;

    // ------------------------------------------------------
    // 3. CONSTRUCCIÓN DE LA CUADRÍCULA DE NOTAS
    // ------------------------------------------------------
    function inicializarBotonesParaSuspendidas() {
        if (!cuadriculaDeNotasSuspendidas) return;
        
        cuadriculaDeNotasSuspendidas.innerHTML = "";
        
        window.bancoNotas24.forEach((notaIndividualDelBanco, numeroDeIndice) => {
            const nuevoBotonDeNota = document.createElement("button");
            nuevoBotonDeNota.className = "boton-nota-triada";
            nuevoBotonDeNota.textContent = notaIndividualDelBanco.nombre;
            
            nuevoBotonDeNota.setAttribute("data-index", numeroDeIndice);
            nuevoBotonDeNota.setAttribute("data-frecuencia", notaIndividualDelBanco.frecuencia);
            
            cuadriculaDeNotasSuspendidas.appendChild(nuevoBotonDeNota);
        });
    }
    inicializarBotonesParaSuspendidas();

    // ------------------------------------------------------
    // 4. LÓGICA PARA GENERAR Y ESCUCHAR EL ACORDE SECRETO
    // ------------------------------------------------------
    if (botonDeEscucharAcordeSuspendido) {
        botonDeEscucharAcordeSuspendido.addEventListener("click", () => {
            
            if (listaDeNotasDelAcordeSecretoSuspendido.length === 0) {
                
                // Margen seguro para que el acorde y su inversión quepan en los 24 botones
                const indiceDeLaNotaRaiz = Math.floor(Math.random() * 15);
                
                const listaDeCualidadesSuspendidas = [
                    { nombre: "sus2", distanciaMedia: 2, distanciaQuinta: 7 },
                    { nombre: "sus4", distanciaMedia: 5, distanciaQuinta: 7 }
                ];
                
                const objetoDeCualidadSeleccionada = listaDeCualidadesSuspendidas[Math.floor(Math.random() * listaDeCualidadesSuspendidas.length)];
                cualidadSecretaDelAcordeSuspendido = objetoDeCualidadSeleccionada.nombre;

                // Obtenemos las 3 notas base en estado fundamental
                let notaRaiz = window.bancoNotas24[indiceDeLaNotaRaiz];
                let notaMedia = window.bancoNotas24[indiceDeLaNotaRaiz + objetoDeCualidadSeleccionada.distanciaMedia];
                let notaQuinta = window.bancoNotas24[indiceDeLaNotaRaiz + objetoDeCualidadSeleccionada.distanciaQuinta];

                let notasBase = [notaRaiz, notaMedia, notaQuinta];

                // 🎲 APLICAR INVERSIONES (50% Fundamental, 25% 1ra Inversión, 25% 2da Inversión)
                const probabilidadInversion = Math.random() * 100;
                let notasInvertidas = [...notasBase];

                if (probabilidadInversion >= 50 && probabilidadInversion < 75) {
                    // 1ra Inversión: La nota media pasa al bajo, la fundamental sube una octava
                    let notaRaizOctava = { nombre: notaRaiz.nombre + " (St)", frecuencia: notaRaiz.frecuencia * 2 };
                    notasInvertidas = [notaMedia, notaQuinta, notaRaizOctava];
                } else if (probabilidadInversion >= 75) {
                    // 2da Inversión: La quinta pasa al bajo, la fundamental y la nota media suben una octava
                    let notaRaizOctava = { nombre: notaRaiz.nombre + " (St)", frecuencia: notaRaiz.frecuencia * 2 };
                    let notaMediaOctava = { nombre: notaMedia.nombre + " (St)", frecuencia: notaMedia.frecuencia * 2 };
                    notasInvertidas = [notaQuinta, notaRaizOctava, notaMediaOctava];
                }

                // 🎲 AÑADIR LA OCTAVA (A veces: 35% de probabilidad de duplicar la nota más grave arriba)
                if (Math.random() * 100 < 35) {
                    let notaBajoDuplicada = { 
                        nombre: notasInvertidas[0].nombre + " (Dub)", 
                        frecuencia: notasInvertidas[0].frecuencia * 2 
                    };
                    notasInvertidas.push(notaBajoDuplicada);
                }

                listaDeNotasDelAcordeSecretoSuspendido = notasInvertidas;

                listaDeNotasElegidasPorElUsuario = [];
                cualidadElegidaPorElUsuario = null;
                
                const botonesDeLaCuadricula = cuadriculaDeNotasSuspendidas.querySelectorAll(".boton-nota-triada");
                botonesDeLaCuadricula.forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
                listaDeBotonesDeCualidadSuspendida.forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
                
                if (botonParaBorrarSeleccionSuspendidas) botonParaBorrarSeleccionSuspendidas.classList.add("oculto");
            }

            cuadroDeMensajeVisualSuspendidas.textContent = "🔊 Reproduciendo tríada suspendida con inversiones y sonoridad real...";
            cuadroDeMensajeVisualSuspendidas.className = "mensaje-neutro";

            // Reproducimos las frecuencias del acorde secreto
            window.reproducirSecuenciaAcorde(listaDeNotasDelAcordeSecretoSuspendido.map(notaIndividual => notaIndividual.frecuencia));
        });
    }

    // ------------------------------------------------------
    // 5. INTERACCIÓN DEL USUARIO CON LA CUADRÍCULA DE NOTAS
    // ------------------------------------------------------
    if (cuadriculaDeNotasSuspendidas) {
        cuadriculaDeNotasSuspendidas.addEventListener("click", (eventoDeClicGeneral) => {
            if (eventoDeClicGeneral.target.classList.contains("boton-nota-triada")) {
                
                if (listaDeNotasDelAcordeSecretoSuspendido.length === 0) {
                    cuadroDeMensajeVisualSuspendidas.textContent = "⚠️ Primero haz clic en 'Escuchar Tríada'.";
                    return;
                }
                
                if (listaDeNotasElegidasPorElUsuario.length >= 3) return;

                const frecuenciaDelBotonPresionado = parseFloat(eventoDeClicGeneral.target.getAttribute("data-frecuencia"));
                const nombreEscritoDelBotonPresionado = eventoDeClicGeneral.target.textContent;

                window.reproducirTono(frecuenciaDelBotonPresionado);
                eventoDeClicGeneral.target.classList.add("seleccionada");
                
                if (botonParaBorrarSeleccionSuspendidas) botonParaBorrarSeleccionSuspendidas.classList.remove("oculto");

                listaDeNotasElegidasPorElUsuario.push({ nombre: nombreEscritoDelBotonPresionado, frecuencia: frecuenciaDelBotonPresionado });
                
                cuadroDeMensajeVisualSuspendidas.textContent = `Notas seleccionadas (${listaDeNotasElegidasPorElUsuario.length}/3). Elige las que faltan y la cualidad.`;

                if (listaDeNotasElegidasPorElUsuario.length === 3 && cualidadElegidaPorElUsuario) {
                    validarResultadoDelAcordeSuspendido();
                }
            }
        });
    }

    // ------------------------------------------------------
    // 6. INTERACCIÓN DEL USUARIO CON LOS BOTONES DE CUALIDAD (Sus2 / Sus4)
    // ------------------------------------------------------
    listaDeBotonesDeCualidadSuspendida.forEach(botonDeCualidadIndividual => {
        botonDeCualidadIndividual.addEventListener("click", () => {
            if (listaDeNotasDelAcordeSecretoSuspendido.length === 0) {
                cuadroDeMensajeVisualSuspendidas.textContent = "⚠️ Primero haz clic en 'Escuchar Tríada'.";
                return;
            }
            
            listaDeBotonesDeCualidadSuspendida.forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
            botonDeCualidadIndividual.classList.add("seleccionada");
            
            cualidadElegidaPorElUsuario = botonDeCualidadIndividual.getAttribute("data-cualidad");

            if (listaDeNotasElegidasPorElUsuario.length === 3 && cualidadElegidaPorElUsuario) {
                validarResultadoDelAcordeSuspendido();
            }
        });
    });

    // ------------------------------------------------------
    // 7. BOTÓN PARA BORRAR SELECCIÓN
    // ------------------------------------------------------
    if (botonParaBorrarSeleccionSuspendidas) {
        botonParaBorrarSeleccionSuspendidas.addEventListener("click", () => {
            listaDeNotasElegidasPorElUsuario = [];
            cualidadElegidaPorElUsuario = null;
            
            const botonesDeLaCuadricula = cuadriculaDeNotasSuspendidas.querySelectorAll(".boton-nota-triada");
            botonesDeLaCuadricula.forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
            listaDeBotonesDeCualidadSuspendida.forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
            
            botonParaBorrarSeleccionSuspendidas.classList.add("oculto");
            cuadroDeMensajeVisualSuspendidas.textContent = "Selección borrada. Vuelve a elegir las 3 notas y la cualidad.";
        });
    }

    // ------------------------------------------------------
    // 8. EVALUACIÓN FINAL DEL RETO
    // ------------------------------------------------------
    async function validarResultadoDelAcordeSuspendido() {
        
        // Normalizamos las frecuencias del acorde secreto a su octava base
        const frecuenciasSecretasBase = listaDeNotasDelAcordeSecretoSuspendido.map(objetoNota => {
            let frecuenciaActual = objetoNota.frecuencia;
            while (frecuenciaActual > 500) {
                frecuenciaActual /= 2;
            }
            return Math.round(frecuenciaActual * 10) / 10;
        });

        // Normalizamos las frecuencias elegidas por el usuario
        const frecuenciasUsuarioBase = listaDeNotasElegidasPorElUsuario.map(objetoNota => {
            let frecuenciaActual = objetoNota.frecuencia;
            while (frecuenciaActual > 500) {
                frecuenciaActual /= 2;
            }
            return Math.round(frecuenciaActual * 10) / 10;
        });

        // Ordenamos ambas listas de menor a mayor
        frecuenciasSecretasBase.sort((a, b) => a - b);
        frecuenciasUsuarioBase.sort((a, b) => a - b);

        // Verificamos si las notas coinciden matemáticamente
        const lasNotasSonIdenticas = frecuenciasSecretasBase.every((frecuenciaSecreta, indice) => 
            Math.abs(frecuenciaSecreta - frecuenciasUsuarioBase[indice]) < 1.0
        );
        
        const laCualidadEsCorrecta = cualidadElegidaPorElUsuario === cualidadSecretaDelAcordeSuspendido;

        if (lasNotasSonIdenticas && laCualidadEsCorrecta) {
            cuadroDeMensajeVisualSuspendidas.textContent = `🎉 ¡Correcto! Acorde ${cualidadSecretaDelAcordeSuspendido} identificado con inversión. (+25 pts)`;
            cuadroDeMensajeVisualSuspendidas.className = "mensaje-exito";
            
            contadorDePuntosTotalesSuspendidas += 25;
            if (etiquetaPuntajeMostradoSuspendidas) etiquetaPuntajeMostradoSuspendidas.textContent = contadorDePuntosTotalesSuspendidas;
            
            await window.guardarPuntajeGenerico(25, "Tríadas Suspendidas", "acierto");
        } else {
            cuadroDeMensajeVisualSuspendidas.textContent = `❌ Fallaste. Era un acorde ${cualidadSecretaDelAcordeSuspendido}. (0 pts)`;
            cuadroDeMensajeVisualSuspendidas.className = "mensaje-error";
            
            await window.guardarPuntajeGenerico(0, "Tríadas Suspendidas", "fallo");
        }

        listaDeNotasDelAcordeSecretoSuspendido = [];
        listaDeNotasElegidasPorElUsuario = [];
        cualidadElegidaPorElUsuario = null;
        
        const botonesDeLaCuadricula = cuadriculaDeNotasSuspendidas.querySelectorAll(".boton-nota-triada");
        botonesDeLaCuadricula.forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
        listaDeBotonesDeCualidadSuspendida.forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
        if (botonParaBorrarSeleccionSuspendidas) botonParaBorrarSeleccionSuspendidas.classList.add("oculto");
    }
});