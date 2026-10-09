/* ==========================================================
   LÓGICA DEL NIVEL 6: ACORDES DE SÉPTIMA E INVERSIONES (septimas.js)
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
                
                const indiceDeLaNotaRaiz = Math.floor(Math.random() * 11);
                
                const listaDeCualidadesDeSeptima = [
                    { nombre: "Maj7", distanciaTercera: 4, distanciaQuinta: 7, distanciaSeptima: 11 },
                    { nombre: "7", distanciaTercera: 4, distanciaQuinta: 7, distanciaSeptima: 10 },
                    { nombre: "m7", distanciaTercera: 3, distanciaQuinta: 7, distanciaSeptima: 10 },
                    { nombre: "m7b5", distanciaTercera: 3, distanciaQuinta: 6, distanciaSeptima: 10 },
                    { nombre: "dim7", distanciaTercera: 3, distanciaQuinta: 6, distanciaSeptima: 9 }
                ];
                
                const objetoDeCualidadSeleccionada = listaDeCualidadesDeSeptima[Math.floor(Math.random() * listaDeCualidadesDeSeptima.length)];
                cualidadSecretaDelAcordeSeptima = objetoDeCualidadSeleccionada.nombre;

                let objetoNotaRaiz = window.bancoNotas24[indiceDeLaNotaRaiz];
                let objetoNotaTercera = window.bancoNotas24[indiceDeLaNotaRaiz + objetoDeCualidadSeleccionada.distanciaTercera];
                let objetoNotaQuinta = window.bancoNotas24[indiceDeLaNotaRaiz + objetoDeCualidadSeleccionada.distanciaQuinta];
                let objetoNotaSeptima = window.bancoNotas24[indiceDeLaNotaRaiz + objetoDeCualidadSeleccionada.distanciaSeptima];

                // Decidimos si omitimos la quinta justa de forma independiente
                let omitirQuintaJusta = false;
                const esQuintaJusta = objetoDeCualidadSeleccionada.distanciaQuinta === 7;
                
                if (esQuintaJusta) {
                    const numeroAleatorioOmision = Math.random() * 100;
                    if (numeroAleatorioOmision > 50) {
                        omitirQuintaJusta = true;
                    }
                }

                // Creamos la lista base de notas según la omisión
                let listaNotasBase = [];
                if (omitirQuintaJusta === true) {
                    listaNotasBase = [objetoNotaRaiz, objetoNotaTercera, objetoNotaSeptima];
                } else {
                    listaNotasBase = [objetoNotaRaiz, objetoNotaTercera, objetoNotaQuinta, objetoNotaSeptima];
                }

                // Aplicamos las inversiones usando porcentajes explícitos
                const numeroAleatorioInversion = Math.random() * 100;
                let listaNotasInvertidas = [...listaNotasBase];

                const cantidadNotasEnBase = listaNotasBase.length;

                if (cantidadNotasEnBase === 4) {
                    let raizEnOctavaSuperior = { nombre: objetoNotaRaiz.nombre + " (St)", frecuencia: objetoNotaRaiz.frecuencia * 2 };
                    let terceraEnOctavaSuperior = { nombre: objetoNotaTercera.nombre + " (St)", frecuencia: objetoNotaTercera.frecuencia * 2 };
                    let quintaEnOctavaSuperior = { nombre: objetoNotaQuinta.nombre + " (St)", frecuencia: objetoNotaQuinta.frecuencia * 2 };

                    const esPrimeraInversion = numeroAleatorioInversion >= 40 && numeroAleatorioInversion < 60;
                    const esSegundaInversion = numeroAleatorioInversion >= 60 && numeroAleatorioInversion < 80;
                    const esTerceraInversion = numeroAleatorioInversion >= 80;

                    if (esPrimeraInversion) {
                        listaNotasInvertidas = [objetoNotaTercera, objetoNotaQuinta, objetoNotaSeptima, raizEnOctavaSuperior];
                    } else if (esSegundaInversion) {
                        listaNotasInvertidas = [objetoNotaQuinta, objetoNotaSeptima, raizEnOctavaSuperior, terceraEnOctavaSuperior];
                    } else if (esTerceraInversion) {
                        listaNotasInvertidas = [objetoNotaSeptima, raizEnOctavaSuperior, terceraEnOctavaSuperior, quintaEnOctavaSuperior];
                    }
                } else {
                    let raizEnOctavaSuperior = { nombre: objetoNotaRaiz.nombre + " (St)", frecuencia: objetoNotaRaiz.frecuencia * 2 };
                    let terceraEnOctavaSuperior = { nombre: objetoNotaTercera.nombre + " (St)", frecuencia: objetoNotaTercera.frecuencia * 2 };

                    const esPrimeraInversionTresNotas = numeroAleatorioInversion >= 40 && numeroAleatorioInversion < 65;
                    const esSegundaInversionTresNotas = numeroAleatorioInversion >= 65;

                    if (esPrimeraInversionTresNotas) {
                        listaNotasInvertidas = [objetoNotaTercera, objetoNotaSeptima, raizEnOctavaSuperior];
                    } else if (esSegundaInversionTresNotas) {
                        listaNotasInvertidas = [objetoNotaSeptima, raizEnOctavaSuperior, terceraEnOctavaSuperior];
                    }
                }

                // Añadimos duplicación de la nota más grave superior a veces (35% de probabilidad)
                const numeroAleatorioDuplicacion = Math.random() * 100;
                if (numeroAleatorioDuplicacion < 35) {
                    let notaMasGraveActual = listaNotasInvertidas[0];
                    let notaBajoDuplicada = { 
                        nombre: notaMasGraveActual.nombre + " (Dub)", 
                        frecuencia: notaMasGraveActual.frecuencia * 2 
                    };
                    listaNotasInvertidas.push(notaBajoDuplicada);
                }

                listaDeNotasDelAcordeSecretoSeptima = listaNotasInvertidas;

                listaDeNotasElegidasPorElUsuario = [];
                cualidadElegidaPorElUsuario = null;
                
                const botonesDeLaCuadricula = cuadriculaDeNotasSeptimas.querySelectorAll(".boton-nota-triada");
                botonesDeLaCuadricula.forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
                listaDeBotonesDeCualidadSeptima.forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
                
                if (botonParaBorrarSeleccionSeptimas) {
                    botonParaBorrarSeleccionSeptimas.classList.add("oculto");
                }
            }

            cuadroDeMensajeVisualSeptimas.textContent = "🔊 Reproduciendo acorde de séptima con inversión y sonoridad real...";
            cuadroDeMensajeVisualSeptimas.className = "mensaje-neutro";

            const frecuenciasParaReproducir = listaDeNotasDelAcordeSecretoSeptima.map(objetoNota => objetoNota.frecuencia);
            window.reproducirSecuenciaAcorde(frecuenciasParaReproducir);
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
                
                // Determinamos cuántas notas base debe elegir el usuario según el tamaño del acorde secreto
                let cantidadNotasRequeridas = 4;
                const tieneNotasModificadas = listaDeNotasDelAcordeSecretoSeptima.some(objetoNota => 
                    objetoNota.nombre.includes("St") || objetoNota.nombre.includes("Dub")
                );

                if (tieneNotasModificadas === true) {
                    if (listaDeNotasDelAcordeSecretoSeptima.length > 4) {
                        cantidadNotasRequeridas = 4;
                    } else {
                        cantidadNotasRequeridas = 3;
                    }
                } else {
                    cantidadNotasRequeridas = listaDeNotasDelAcordeSecretoSeptima.length;
                }

                if (listaDeNotasElegidasPorElUsuario.length >= cantidadNotasRequeridas) {
                    return;
                }

                const frecuenciaDelBotonPresionado = parseFloat(eventoDeClicGeneral.target.getAttribute("data-frecuencia"));
                const nombreEscritoDelBotonPresionado = eventoDeClicGeneral.target.textContent;

                window.reproducirTono(frecuenciaDelBotonPresionado);
                eventoDeClicGeneral.target.classList.add("seleccionada");
                
                if (botonParaBorrarSeleccionSeptimas) {
                    botonParaBorrarSeleccionSeptimas.classList.remove("oculto");
                }

                listaDeNotasElegidasPorElUsuario.push({ 
                    nombre: nombreEscritoDelBotonPresionado, 
                    frecuencia: frecuenciaDelBotonPresionado 
                });
                
                cuadroDeMensajeVisualSeptimas.textContent = `Notas seleccionadas (${listaDeNotasElegidasPorElUsuario.length}/${cantidadNotasRequeridas}). Elige las que faltan y la cualidad.`;

                const usuarioCompletoLasNotas = listaDeNotasElegidasPorElUsuario.length === cantidadNotasRequeridas;
                const usuarioSeleccionoCualidad = cualidadElegidaPorElUsuario !== null;

                if (usuarioCompletoLasNotas && usuarioSeleccionoCualidad) {
                    validarResultadoDelAcordeDeSeptima();
                }
            }
        });
    }

    // ------------------------------------------------------
    // 6. INTERACCIÓN CON LOS BOTONES DE CUALIDAD
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

            let cantidadNotasRequeridas = 4;
            if (listaDeNotasElegidasPorElUsuario.length > 0) {
                cantidadNotasRequeridas = listaDeNotasElegidasPorElUsuario.length;
            }

            const usuarioCompletoLasNotas = listaDeNotasElegidasPorElUsuario.length === cantidadNotasRequeridas;
            const usuarioSeleccionoCualidad = cualidadElegidaPorElUsuario !== null;

            if (usuarioCompletoLasNotas && usuarioSeleccionoCualidad) {
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
            cuadroDeMensajeVisualSeptimas.textContent = "Selección borrada. Vuelve a elegir las notas y la cualidad.";
        });
    }

    // ------------------------------------------------------
    // 8. EVALUACIÓN FINAL DEL RETO
    // ------------------------------------------------------
    async function validarResultadoDelAcordeDeSeptima() {
        
        // Normalizamos las frecuencias secretas a su octava base de manera explícita
        const frecuenciasSecretasBase = listaDeNotasDelAcordeSecretoSeptima.map(objetoNota => {
            let frecuenciaActual = objetoNota.frecuencia;
            while (frecuenciaActual > 500) {
                frecuenciaActual = frecuenciaActual / 2;
            }
            return Math.round(frecuenciaActual * 10) / 10;
        });

        // Normalizamos las frecuencias elegidas por el usuario
        const frecuenciasUsuarioBase = listaDeNotasElegidasPorElUsuario.map(objetoNota => {
            let frecuenciaActual = objetoNota.frecuencia;
            while (frecuenciaActual > 500) {
                frecuenciaActual = frecuenciaActual / 2;
            }
            return Math.round(frecuenciaActual * 10) / 10;
        });

        // Eliminamos duplicados de octava para comparar la estructura base limpia
        const frecuenciasSecretasUnicas = [...new Set(frecuenciasSecretasBase)].sort((a, b) => a - b);
        const frecuenciasUsuarioUnicas = [...new Set(frecuenciasUsuarioBase)].sort((a, b) => a - b);

        let lasNotasSonIdenticas = true;
        frecuenciasSecretasUnicas.forEach((frecuenciaSecreta, indice) => {
            const frecuenciaUsuarioCorrespondiente = frecuenciasUsuarioUnicas[indice];
            if (frecuenciaUsuarioCorrespondiente === undefined) {
                lasNotasSonIdenticas = false;
            } else {
                const diferenciaFrecuencias = Math.abs(frecuenciaSecreta - frecuenciaUsuarioCorrespondiente);
                if (diferenciaFrecuencias >= 1.0) {
                    lasNotasSonIdenticas = false;
                }
            }
        });
        
        const laCualidadEsCorrecta = cualidadElegidaPorElUsuario === cualidadSecretaDelAcordeSeptima;

        if (lasNotasSonIdenticas && laCualidadEsCorrecta) {
            cuadroDeMensajeVisualSeptimas.textContent = `🎉 ¡Correcto! Acorde ${cualidadSecretaDelAcordeSeptima} identificado con inversión. (+40 pts)`;
            cuadroDeMensajeVisualSeptimas.className = "mensaje-exito";
            
            contadorDePuntosTotalesSeptimas += 40; 
            if (etiquetaPuntajeMostradoSeptimas) {
                etiquetaPuntajeMostradoSeptimas.textContent = contadorDePuntosTotalesSeptimas;
            }
            
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
        
        if (botonParaBorrarSeleccionSeptimas) {
            botonParaBorrarSeleccionSeptimas.classList.add("oculto");
        }
    }
});