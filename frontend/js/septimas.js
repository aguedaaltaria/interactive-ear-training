/* ==========================================================
   LÓGICA DEL NIVEL 6: ACORDES DE SÉPTIMA (septimas.js)
   ========================================================== */

   document.addEventListener("DOMContentLoaded", () => {
    
    // ------------------------------------------------------
    // 1. CONEXIÓN CON LOS ELEMENTOS DE LA PANTALLA (HTML)
    // ------------------------------------------------------
    const cuadriculaDeNotasSeptimas = document.getElementById("grid-notas-septimas");
    const botonDeEscucharAcordeSeptima = document.getElementById("boton-reto-septimas");
    const cuadroDeMensajeVisualSeptimas = document.getElementById("mensaje-estado-septimas");
    const etiquetaPuntajeMostradoSeptimas = document.querySelector("#marcador-puntaje-septimas span");
    const botonParaBorrarSeleccionSeptimas = document.getElementById("btn-deseleccionar-septimas");
    const listaDeBotonesDeCualidadSeptima = document.querySelectorAll(".btn-cualidad-septima");

    // ------------------------------------------------------
    // 2. VARIABLES DE MEMORIA PARA EL JUEGO ACTUAL
    // ------------------------------------------------------
    // Esta lista ahora podrá tener 3 o 4 notas, dependiendo de si se omite la quinta
    let listaDeNotasDelAcordeSecretoSeptima = [];
    let cualidadSecretaDelAcordeSeptima = null; 
    
    let listaDeNotasElegidasPorElUsuario = [];
    let cualidadElegidaPorElUsuario = null;
    let contadorDePuntosTotalesSeptimas = 0;

    // ------------------------------------------------------
    // 3. CONSTRUCCIÓN DE LA CUADRÍCULA DE NOTAS
    // ------------------------------------------------------
    function inicializarBotonesParaSeptimas() {
        if (!cuadriculaDeNotasSeptimas) return;
        
        cuadriculaDeNotasSeptimas.innerHTML = "";
        
        window.bancoNotas24.forEach((notaIndividualDelBanco, numeroDeIndice) => {
            const nuevoBotonDeNota = document.createElement("button");
            nuevoBotonDeNota.className = "boton-nota-triada";
            nuevoBotonDeNota.textContent = notaIndividualDelBanco.nombre;
            
            nuevoBotonDeNota.setAttribute("data-index", numeroDeIndice);
            nuevoBotonDeNota.setAttribute("data-frecuencia", notaIndividualDelBanco.frecuencia);
            
            cuadriculaDeNotasSeptimas.appendChild(nuevoBotonDeNota);
        });
    }
    inicializarBotonesParaSeptimas();

    // ------------------------------------------------------
    // 4. LÓGICA PARA GENERAR Y ESCUCHAR EL ACORDE SECRETO
    // ------------------------------------------------------
    if (botonDeEscucharAcordeSeptima) {
        botonDeEscucharAcordeSeptima.addEventListener("click", () => {
            
            if (listaDeNotasDelAcordeSecretoSeptima.length === 0) {
                
                const indiceDeLaNotaRaiz = Math.floor(Math.random() * 13);
                
                const listaDeCualidadesDeSeptima = [
                    { nombre: "Maj7", distanciaTercera: 4, distanciaQuinta: 7, distanciaSeptima: 11 },
                    { nombre: "7", distanciaTercera: 4, distanciaQuinta: 7, distanciaSeptima: 10 },
                    { nombre: "m7", distanciaTercera: 3, distanciaQuinta: 7, distanciaSeptima: 10 },
                    { nombre: "m7b5", distanciaTercera: 3, distanciaQuinta: 6, distanciaSeptima: 10 },
                    { nombre: "dim7", distanciaTercera: 3, distanciaQuinta: 6, distanciaSeptima: 9 }
                ];
                
                const objetoDeCualidadSeleccionada = listaDeCualidadesDeSeptima[Math.floor(Math.random() * listaDeCualidadesDeSeptima.length)];
                cualidadSecretaDelAcordeSeptima = objetoDeCualidadSeleccionada.nombre;

                const indiceNotaUno = indiceDeLaNotaRaiz;
                const indiceNotaDos = indiceDeLaNotaRaiz + objetoDeCualidadSeleccionada.distanciaTercera;
                const indiceNotaTres = indiceDeLaNotaRaiz + objetoDeCualidadSeleccionada.distanciaQuinta;
                const indiceNotaCuatro = indiceDeLaNotaRaiz + objetoDeCualidadSeleccionada.distanciaSeptima;

                // NUEVA LÓGICA: ¿Omitimos la quinta (Shell Voicing)?
                let omitirQuintaJusta = false;
                
                // Solo nos permitimos omitir la quinta si es una quinta justa (7 semitonos de distancia).
                // Los acordes m7b5 y dim7 tienen quintas alteradas (6 semitonos), así que esas NUNCA se omiten.
                if (objetoDeCualidadSeleccionada.distanciaQuinta === 7) {
                    // 50% de probabilidad de jugar con 3 notas en lugar de 4
                    omitirQuintaJusta = Math.random() > 0.5;
                }

                if (omitirQuintaJusta) {
                    // Acorde de 3 notas (Raíz, Tercera, Séptima)
                    listaDeNotasDelAcordeSecretoSeptima = [
                        window.bancoNotas24[indiceNotaUno],
                        window.bancoNotas24[indiceNotaDos],
                        window.bancoNotas24[indiceNotaCuatro] // Saltamos la nota tres (la quinta)
                    ];
                } else {
                    // Acorde completo de 4 notas
                    listaDeNotasDelAcordeSecretoSeptima = [
                        window.bancoNotas24[indiceNotaUno],
                        window.bancoNotas24[indiceNotaDos],
                        window.bancoNotas24[indiceNotaTres],
                        window.bancoNotas24[indiceNotaCuatro]
                    ];
                }

                listaDeNotasElegidasPorElUsuario = [];
                cualidadElegidaPorElUsuario = null;
                
                const botonesDeLaCuadricula = cuadriculaDeNotasSeptimas.querySelectorAll(".boton-nota-triada");
                botonesDeLaCuadricula.forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
                listaDeBotonesDeCualidadSeptima.forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
                
                if (botonParaBorrarSeleccionSeptimas) botonParaBorrarSeleccionSeptimas.classList.add("oculto");
            }

            // El mensaje dinámico le avisa al usuario si está buscando 3 o 4 notas
            const cantidadDeNotasRequeridasParaEsteReto = listaDeNotasDelAcordeSecretoSeptima.length;
            cuadroDeMensajeVisualSeptimas.textContent = `🔊 Reproduciendo acorde de séptima (${cantidadDeNotasRequeridasParaEsteReto} notas)...`;
            cuadroDeMensajeVisualSeptimas.className = "mensaje-neutro";

            window.reproducirSecuenciaAcorde(listaDeNotasDelAcordeSecretoSeptima.map(notaIndividual => notaIndividual.frecuencia));
        });
    }

    // ------------------------------------------------------
    // 5. INTERACCIÓN DEL USUARIO CON LA CUADRÍCULA DE NOTAS
    // ------------------------------------------------------
    if (cuadriculaDeNotasSeptimas) {
        cuadriculaDeNotasSeptimas.addEventListener("click", (eventoDeClicGeneral) => {
            if (eventoDeClicGeneral.target.classList.contains("boton-nota-triada")) {
                
                if (listaDeNotasDelAcordeSecretoSeptima.length === 0) {
                    cuadroDeMensajeVisualSeptimas.textContent = "⚠️ Primero haz clic en 'Escuchar Acorde'.";
                    return;
                }
                
                // Leemos dinámicamente si el reto actual exige 3 o 4 notas
                const cantidadDeNotasRequeridasParaEsteReto = listaDeNotasDelAcordeSecretoSeptima.length;
                
                // Bloqueamos clics adicionales si ya alcanzó el límite de esta ronda
                if (listaDeNotasElegidasPorElUsuario.length >= cantidadDeNotasRequeridasParaEsteReto) return;

                const frecuenciaDelBotonPresionado = parseFloat(eventoDeClicGeneral.target.getAttribute("data-frecuencia"));
                const nombreEscritoDelBotonPresionado = eventoDeClicGeneral.target.textContent;

                window.reproducirTono(frecuenciaDelBotonPresionado);
                eventoDeClicGeneral.target.classList.add("seleccionada");
                
                if (botonParaBorrarSeleccionSeptimas) botonParaBorrarSeleccionSeptimas.classList.remove("oculto");

                listaDeNotasElegidasPorElUsuario.push({ nombre: nombreEscritoDelBotonPresionado, frecuencia: frecuenciaDelBotonPresionado });
                
                cuadroDeMensajeVisualSeptimas.textContent = `Notas seleccionadas (${listaDeNotasElegidasPorElUsuario.length}/${cantidadDeNotasRequeridasParaEsteReto}). Elige las que faltan y la cualidad.`;

                // Evaluamos automáticamente cuando se llenan los cupos
                if (listaDeNotasElegidasPorElUsuario.length === cantidadDeNotasRequeridasParaEsteReto && cualidadElegidaPorElUsuario) {
                    validarResultadoDelAcordeDeSeptima();
                }
            }
        });
    }

    // ------------------------------------------------------
    // 6. INTERACCIÓN CON LOS BOTONES DE CUALIDAD (Maj7, 7, etc.)
    // ------------------------------------------------------
    listaDeBotonesDeCualidadSeptima.forEach(botonDeCualidadIndividual => {
        botonDeCualidadIndividual.addEventListener("click", () => {
            if (listaDeNotasDelAcordeSecretoSeptima.length === 0) {
                cuadroDeMensajeVisualSeptimas.textContent = "⚠️ Primero haz clic en 'Escuchar Acorde'.";
                return;
            }
            
            listaDeBotonesDeCualidadSeptima.forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
            botonDeCualidadIndividual.classList.add("seleccionada");
            
            cualidadElegidaPorElUsuario = botonDeCualidadIndividual.getAttribute("data-cualidad");

            const cantidadDeNotasRequeridasParaEsteReto = listaDeNotasDelAcordeSecretoSeptima.length;
            if (listaDeNotasElegidasPorElUsuario.length === cantidadDeNotasRequeridasParaEsteReto && cualidadElegidaPorElUsuario) {
                validarResultadoDelAcordeDeSeptima();
            }
        });
    });

    // ------------------------------------------------------
    // 7. BOTÓN PARA BORRAR SELECCIÓN
    // ------------------------------------------------------
    if (botonParaBorrarSeleccionSeptimas) {
        botonParaBorrarSeleccionSeptimas.addEventListener("click", () => {
            listaDeNotasElegidasPorElUsuario = [];
            cualidadElegidaPorElUsuario = null;
            
            const botonesDeLaCuadricula = cuadriculaDeNotasSeptimas.querySelectorAll(".boton-nota-triada");
            botonesDeLaCuadricula.forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
            listaDeBotonesDeCualidadSeptima.forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
            
            botonParaBorrarSeleccionSeptimas.classList.add("oculto");
            
            const cantidadDeNotasRequeridasParaEsteReto = listaDeNotasDelAcordeSecretoSeptima.length;
            cuadroDeMensajeVisualSeptimas.textContent = `Selección borrada. Vuelve a elegir las ${cantidadDeNotasRequeridasParaEsteReto} notas y la cualidad.`;
        });
    }

    // ------------------------------------------------------
    // 8. EVALUACIÓN FINAL DEL RETO (40 PUNTOS)
    // ------------------------------------------------------
    async function validarResultadoDelAcordeDeSeptima() {
        
        const frecuenciasSecretasOrdenadas = listaDeNotasDelAcordeSecretoSeptima.map(nota => nota.frecuencia).sort((a, b) => a - b);
        const frecuenciasDelUsuarioOrdenadas = listaDeNotasElegidasPorElUsuario.map(nota => nota.frecuencia).sort((a, b) => a - b);

        const lasNotasSonIdenticas = frecuenciasSecretasOrdenadas.every((frecuenciaSecreta, indice) => 
            Math.abs(frecuenciaSecreta - frecuenciasDelUsuarioOrdenadas[indice]) < 0.1
        );
        
        const laCualidadEsCorrecta = cualidadElegidaPorElUsuario === cualidadSecretaDelAcordeSeptima;

        if (lasNotasSonIdenticas && laCualidadEsCorrecta) {
            cuadroDeMensajeVisualSeptimas.textContent = `🎉 ¡Correcto! Acorde ${cualidadSecretaDelAcordeSeptima} identificado. (+40 pts)`;
            cuadroDeMensajeVisualSeptimas.className = "mensaje-exito";
            
            contadorDePuntosTotalesSeptimas += 40; 
            if (etiquetaPuntajeMostradoSeptimas) etiquetaPuntajeMostradoSeptimas.textContent = contadorDePuntosTotalesSeptimas;
            
            await window.guardarPuntajeGenerico(40, "Acordes de Séptima", "acierto");
        } else {
            cuadroDeMensajeVisualSeptimas.textContent = `❌ Fallaste. Era un acorde ${cualidadSecretaDelAcordeSeptima}. (0 pts)`;
            cuadroDeMensajeVisualSeptimas.className = "mensaje-error";
            
            await window.guardarPuntajeGenerico(0, "Acordes de Séptima", "fallo");
        }

        listaDeNotasDelAcordeSecretoSeptima = [];
        listaDeNotasElegidasPorElUsuario = [];
        cualidadElegidaPorElUsuario = null;
        
        const botonesDeLaCuadricula = cuadriculaDeNotasSeptimas.querySelectorAll(".boton-nota-triada");
        botonesDeLaCuadricula.forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
        listaDeBotonesDeCualidadSeptima.forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
        if (botonParaBorrarSeleccionSeptimas) botonParaBorrarSeleccionSeptimas.classList.add("oculto");
    }
});