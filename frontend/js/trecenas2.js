/* ==========================================================
   LÓGICA DEL NIVEL 8 (PARTE 2): INTERACCIÓN Y VALIDACIÓN (trecenas2.js)
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    // 5. CONEXIÓN CON LOS ELEMENTOS DE LA PANTALLA
    const cuadriculaDeNotasTrecenas = document.getElementById("grid-notas-trecenas");
    const cuadroDeMensajeVisualTrecenas = document.getElementById("mensaje-estado-trecenas");
    const etiquetaPuntajeMostradoTrecenas = document.querySelector("#marcador-puntaje-trecenas span");
    const botonParaBorrarSeleccionTrecenas = document.getElementById("btn-deseleccionar-trecenas");
    const listaDeBotonesDeCualidadTrecena = document.querySelectorAll(".btn-cualidad-trecena");

    // 6. INTERACCIÓN DEL USUARIO CON LA CUADRÍCULA DE NOTAS
    if (cuadriculaDeNotasTrecenas) {
        cuadriculaDeNotasTrecenas.addEventListener("click", (eventoDeClicGeneral) => {
            const elBotonClickeadoEsUnaNota = eventoDeClicGeneral.target.classList.contains("boton-nota-pequeno");
            
            if (elBotonClickeadoEsUnaNota) {
                
                if (listaDeNotasDelAcordeSecretoTrecena.length === 0) {
                    cuadroDeMensajeVisualTrecenas.textContent = "⚠️ Primero haz clic en 'Escuchar Acorde'.";
                    return;
                }
                
                // La cantidad de notas requeridas depende de si el generador omitió la 5ta o la 9na
                const cantidadNotasRequeridas = listaDeNotasDelAcordeSecretoTrecena.length;

                if (listaDeNotasElegidasPorElUsuarioTrecena.length >= cantidadNotasRequeridas) {
                    return;
                }

                const frecuenciaDelBotonPresionado = parseFloat(eventoDeClicGeneral.target.getAttribute("data-frecuencia"));
                const nombreEscritoDelBotonPresionado = eventoDeClicGeneral.target.textContent;

                window.reproducirTono(frecuenciaDelBotonPresionado);
                eventoDeClicGeneral.target.classList.add("seleccionada");
                
                if (botonParaBorrarSeleccionTrecenas) {
                    botonParaBorrarSeleccionTrecenas.classList.remove("oculto");
                }

                listaDeNotasElegidasPorElUsuarioTrecena.push({ 
                    nombre: nombreEscritoDelBotonPresionado, 
                    frecuencia: frecuenciaDelBotonPresionado 
                });
                
                cuadroDeMensajeVisualTrecenas.textContent = `Notas seleccionadas (${listaDeNotasElegidasPorElUsuarioTrecena.length}/${cantidadNotasRequeridas}). Elige las que faltan y la cualidad.`;

                const usuarioCompletoLasNotas = listaDeNotasElegidasPorElUsuarioTrecena.length === cantidadNotasRequeridas;
                const usuarioSeleccionoCualidad = cualidadElegidaPorElUsuarioTrecena !== null;

                if (usuarioCompletoLasNotas && usuarioSeleccionoCualidad) {
                    validarResultadoDelAcordeDeTrecena();
                }
            }
        });
    }

    // 7. INTERACCIÓN CON LOS BOTONES DE CUALIDAD
    listaDeBotonesDeCualidadTrecena.forEach(botonDeCualidadIndividual => {
        botonDeCualidadIndividual.addEventListener("click", () => {
            if (listaDeNotasDelAcordeSecretoTrecena.length === 0) {
                cuadroDeMensajeVisualTrecenas.textContent = "⚠️ Primero haz clic en 'Escuchar Acorde'.";
                return;
            }
            
            listaDeBotonesDeCualidadTrecena.forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
            botonDeCualidadIndividual.classList.add("seleccionada");
            
            cualidadElegidaPorElUsuarioTrecena = botonDeCualidadIndividual.getAttribute("data-cualidad");

            let cantidadNotasRequeridas = listaDeNotasDelAcordeSecretoTrecena.length;
            const usuarioCompletoLasNotas = listaDeNotasElegidasPorElUsuarioTrecena.length === cantidadNotasRequeridas;
            const usuarioSeleccionoCualidad = cualidadElegidaPorElUsuarioTrecena !== null;

            if (usuarioCompletoLasNotas && usuarioSeleccionoCualidad) {
                validarResultadoDelAcordeDeTrecena();
            }
        });
    });

    // 8. BOTÓN PARA BORRAR SELECCIÓN
    if (botonParaBorrarSeleccionTrecenas) {
        botonParaBorrarSeleccionTrecenas.addEventListener("click", () => {
            listaDeNotasElegidasPorElUsuarioTrecena = [];
            cualidadElegidaPorElUsuarioTrecena = null;
            
            const botonesDeLaCuadricula = cuadriculaDeNotasTrecenas.querySelectorAll(".boton-nota-pequeno");
            botonesDeLaCuadricula.forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
            listaDeBotonesDeCualidadTrecena.forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
            
            botonParaBorrarSeleccionTrecenas.classList.add("oculto");
            cuadroDeMensajeVisualTrecenas.textContent = "Selección borrada. Vuelve a elegir las notas y la cualidad.";
        });
    }

    // 9. EVALUACIÓN FINAL DEL RETO (60 PUNTOS POR SER EL NIVEL MÁXIMO)
    async function validarResultadoDelAcordeDeTrecena() {
        
        // Normalizamos las frecuencias secretas a su octava base de manera explícita
        const frecuenciasSecretasBase = listaDeNotasDelAcordeSecretoTrecena.map(objetoNota => {
            let frecuenciaActual = objetoNota.frecuencia;
            while (frecuenciaActual > 500) {
                frecuenciaActual = frecuenciaActual / 2;
            }
            return Math.round(frecuenciaActual * 10) / 10;
        });

        // Normalizamos las frecuencias elegidas por el usuario
        const frecuenciasUsuarioBase = listaDeNotasElegidasPorElUsuarioTrecena.map(objetoNota => {
            let frecuenciaActual = objetoNota.frecuencia;
            while (frecuenciaActual > 500) {
                frecuenciaActual = frecuenciaActual / 2;
            }
            return Math.round(frecuenciaActual * 10) / 10;
        });

        const frecuenciasSecretasUnicas = [...new Set(frecuenciasSecretasBase)].sort((a, b) => a - b);
        const frecuenciasUsuarioUnicas = [...new Set(frecuenciasUsuarioBase)].sort((a, b) => a - b);

        let lasNotasSonIdenticas = true;
        
        if (frecuenciasSecretasUnicas.length !== frecuenciasUsuarioUnicas.length) {
            lasNotasSonIdenticas = false;
        } else {
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
        }
        
        const laCualidadEsCorrecta = cualidadElegidaPorElUsuarioTrecena === cualidadSecretaDelAcordeTrecena;

        if (lasNotasSonIdenticas && laCualidadEsCorrecta) {
            cuadroDeMensajeVisualTrecenas.textContent = `🎉 ¡Maestría Armónica! Acorde ${cualidadSecretaDelAcordeTrecena} identificado perfectamente. (+60 pts)`;
            cuadroDeMensajeVisualTrecenas.className = "mensaje-exito";
            
            contadorDePuntosTotalesTrecenas += 60; 
            if (etiquetaPuntajeMostradoTrecenas) {
                etiquetaPuntajeMostradoTrecenas.textContent = contadorDePuntosTotalesTrecenas;
            }
            
            await window.guardarPuntajeGenerico(60, "Acordes de Treceava", "acierto");
        } else {
            cuadroDeMensajeVisualTrecenas.textContent = `❌ Fallaste. Era un acorde ${cualidadSecretaDelAcordeTrecena}. (0 pts)`;
            cuadroDeMensajeVisualTrecenas.className = "mensaje-error";
            
            await window.guardarPuntajeGenerico(0, "Acordes de Treceava", "fallo");
        }

        // Limpieza de memoria para el siguiente acorde
        listaDeNotasDelAcordeSecretoTrecena = [];
        listaDeNotasElegidasPorElUsuarioTrecena = [];
        cualidadElegidaPorElUsuarioTrecena = null;
        
        const botonesDeLaCuadricula = cuadriculaDeNotasTrecenas.querySelectorAll(".boton-nota-pequeno");
        botonesDeLaCuadricula.forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
        listaDeBotonesDeCualidadTrecena.forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
        
        if (botonParaBorrarSeleccionTrecenas) {
            botonParaBorrarSeleccionTrecenas.classList.add("oculto");
        }
    }
});