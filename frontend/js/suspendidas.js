/* ==========================================================
   LÓGICA DEL NIVEL 5: TRÍADAS SUSPENDIDAS (suspendidas.js)
   ========================================================== */

// Esperamos que el HTML cargue completamente antes de actuar
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
        
        // Reutilizamos el banco de 24 notas global
        window.bancoNotas24.forEach((notaIndividualDelBanco, numeroDeIndice) => {
            const nuevoBotonDeNota = document.createElement("button");
            // Usamos la misma clase que las triadas normales para mantener el estilo naranja
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
            
            // Si no hay un acorde generado, construimos uno nuevo
            if (listaDeNotasDelAcordeSecretoSuspendido.length === 0) {
                
                // Elegimos la nota Raíz (máximo índice 16 porque la Quinta Justa suma 7 semitonos)
                const indiceDeLaNotaRaiz = Math.floor(Math.random() * 16);
                
                // Diccionario de cualidades suspendidas (Sus2 y Sus4)
                // Sus2: Raíz, Segunda Mayor (2 semitonos), Quinta Justa (7 semitonos)
                // Sus4: Raíz, Cuarta Justa (5 semitonos), Quinta Justa (7 semitonos)
                const listaDeCualidadesSuspendidas = [
                    { nombre: "sus2", distanciaMedia: 2, distanciaQuinta: 7 },
                    { nombre: "sus4", distanciaMedia: 5, distanciaQuinta: 7 }
                ];
                
                // Elegimos aleatoriamente si será Sus2 o Sus4
                const objetoDeCualidadSeleccionada = listaDeCualidadesSuspendidas[Math.floor(Math.random() * listaDeCualidadesSuspendidas.length)];
                cualidadSecretaDelAcordeSuspendido = objetoDeCualidadSeleccionada.nombre;

                const indiceNotaUno = indiceDeLaNotaRaiz;
                const indiceNotaDos = indiceDeLaNotaRaiz + objetoDeCualidadSeleccionada.distanciaMedia;
                const indiceNotaTres = indiceDeLaNotaRaiz + objetoDeCualidadSeleccionada.distanciaQuinta;

                // Guardamos las 3 notas reales sacadas del banco
                listaDeNotasDelAcordeSecretoSuspendido = [
                    window.bancoNotas24[indiceNotaUno],
                    window.bancoNotas24[indiceNotaDos],
                    window.bancoNotas24[indiceNotaTres]
                ];

                // Limpiamos las elecciones previas del usuario
                listaDeNotasElegidasPorElUsuario = [];
                cualidadElegidaPorElUsuario = null;
                
                // Despintamos botones de la cuadrícula y de cualidad
                const botonesDeLaCuadricula = cuadriculaDeNotasSuspendidas.querySelectorAll(".boton-nota-triada");
                botonesDeLaCuadricula.forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
                listaDeBotonesDeCualidadSuspendida.forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
                
                if (botonParaBorrarSeleccionSuspendidas) botonParaBorrarSeleccionSuspendidas.classList.add("oculto");
            }

            cuadroDeMensajeVisualSuspendidas.textContent = "🔊 Reproduciendo tríada suspendida...";
            cuadroDeMensajeVisualSuspendidas.className = "mensaje-neutro";

            // Reproducimos las 3 notas
            window.reproducirSecuenciaAcorde(listaDeNotasDelAcordeSecretoSuspendido.map(notaIndividual => notaIndividual.frecuencia));
        });
    }

    // ------------------------------------------------------
    // 5. INTERACCIÓN DEL USUARIO CON LA CUADRÍCULA DE NOTAS
    // ------------------------------------------------------
    if (cuadriculaDeNotasSuspendidas) {
        cuadriculaDeNotasSuspendidas.addEventListener("click", (eventoDeClicGeneral) => {
            if (eventoDeClicGeneral.target.classList.contains("boton-nota-triada")) {
                
                // Validar que haya pedido escuchar el reto primero
                if (listaDeNotasDelAcordeSecretoSuspendido.length === 0) {
                    cuadroDeMensajeVisualSuspendidas.textContent = "⚠️ Primero haz clic en 'Escuchar Tríada'.";
                    return;
                }
                
                // Solo permitimos 3 notas máximo
                if (listaDeNotasElegidasPorElUsuario.length >= 3) return;

                const frecuenciaDelBotonPresionado = parseFloat(eventoDeClicGeneral.target.getAttribute("data-frecuencia"));
                const nombreEscritoDelBotonPresionado = eventoDeClicGeneral.target.textContent;

                window.reproducirTono(frecuenciaDelBotonPresionado);
                eventoDeClicGeneral.target.classList.add("seleccionada");
                
                if (botonParaBorrarSeleccionSuspendidas) botonParaBorrarSeleccionSuspendidas.classList.remove("oculto");

                listaDeNotasElegidasPorElUsuario.push({ nombre: nombreEscritoDelBotonPresionado, frecuencia: frecuenciaDelBotonPresionado });
                
                cuadroDeMensajeVisualSuspendidas.textContent = `Notas seleccionadas (${listaDeNotasElegidasPorElUsuario.length}/3). Elige las que faltan y la cualidad.`;

                // Evaluamos si ya completó el reto
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
        
        // Extraemos las frecuencias numéricas y las ordenamos de menor a mayor
        const frecuenciasSecretasOrdenadas = listaDeNotasDelAcordeSecretoSuspendido.map(nota => nota.frecuencia).sort((a, b) => a - b);
        const frecuenciasDelUsuarioOrdenadas = listaDeNotasElegidasPorElUsuario.map(nota => nota.frecuencia).sort((a, b) => a - b);

        // Comparamos nota por nota con un margen de error mínimo por los decimales de hertzios
        const lasNotasSonIdenticas = frecuenciasSecretasOrdenadas.every((frecuenciaSecreta, indice) => 
            Math.abs(frecuenciaSecreta - frecuenciasDelUsuarioOrdenadas[indice]) < 0.1
        );
        
        const laCualidadEsCorrecta = cualidadElegidaPorElUsuario === cualidadSecretaDelAcordeSuspendido;

        if (lasNotasSonIdenticas && laCualidadEsCorrecta) {
            cuadroDeMensajeVisualSuspendidas.textContent = `🎉 ¡Correcto! Acorde ${cualidadSecretaDelAcordeSuspendido} identificado. (+25 pts)`;
            cuadroDeMensajeVisualSuspendidas.className = "mensaje-exito";
            
            contadorDePuntosTotalesSuspendidas += 25;
            if (etiquetaPuntajeMostradoSuspendidas) etiquetaPuntajeMostradoSuspendidas.textContent = contadorDePuntosTotalesSuspendidas;
            
            await window.guardarPuntajeGenerico(25, "Tríadas Suspendidas", "acierto");
        } else {
            cuadroDeMensajeVisualSuspendidas.textContent = `❌ Fallaste. Era un acorde ${cualidadSecretaDelAcordeSuspendido}. (0 pts)`;
            cuadroDeMensajeVisualSuspendidas.className = "mensaje-error";
            
            await window.guardarPuntajeGenerico(0, "Tríadas Suspendidas", "fallo");
        }

        // Limpieza final de la ronda
        listaDeNotasDelAcordeSecretoSuspendido = [];
        listaDeNotasElegidasPorElUsuario = [];
        cualidadElegidaPorElUsuario = null;
        
        const botonesDeLaCuadricula = cuadriculaDeNotasSuspendidas.querySelectorAll(".boton-nota-triada");
        botonesDeLaCuadricula.forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
        listaDeBotonesDeCualidadSuspendida.forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
        if (botonParaBorrarSeleccionSuspendidas) botonParaBorrarSeleccionSuspendidas.classList.add("oculto");
    }
});