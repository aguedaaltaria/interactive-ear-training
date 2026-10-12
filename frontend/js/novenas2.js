/* ==========================================================
   LÓGICA DEL NIVEL 7 (PARTE 2): INTERACCIÓN Y VALIDACIÓN (novenas2.js)
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    // 5. CONEXIÓN CON LOS ELEMENTOS DE LA PANTALLA
    const cuadriculaDeNotasNovenas = document.getElementById("grid-notas-novenas");
    const cuadroDeMensajeVisualNovenas = document.getElementById("mensaje-estado-novenas");
    const etiquetaPuntajeMostradoNovenas = document.querySelector("#marcador-puntaje-novenas span");
    const botonParaBorrarSeleccionNovenas = document.getElementById("btn-deseleccionar-novenas");
    const listaDeBotonesDeCualidadNovena = document.querySelectorAll(".btn-cualidad-novena");

    // 6. INTERACCIÓN DEL USUARIO CON LA CUADRÍCULA DE NOTAS
    if (cuadriculaDeNotasNovenas) {
        cuadriculaDeNotasNovenas.addEventListener("click", (eventoDeClicGeneral) => {
            const elBotonClickeadoEsUnaNota = eventoDeClicGeneral.target.classList.contains("boton-nota-pequeno");
            
            if (elBotonClickeadoEsUnaNota) {
                
                if (listaDeNotasDelAcordeSecretoNovena.length === 0) {
                    cuadroDeMensajeVisualNovenas.textContent = "⚠️ Primero haz clic en 'Escuchar Acorde'.";
                    return;
                }
                
                let cantidadNotasRequeridas = 5;
                const tieneNotasModificadas = listaDeNotasDelAcordeSecretoNovena.some(objetoNota => 
                    objetoNota.nombre.includes("St") || objetoNota.nombre.includes("Dub")
                );

                if (tieneNotasModificadas === true) {
                    if (listaDeNotasDelAcordeSecretoNovena.length > 5) {
                        cantidadNotasRequeridas = 5;
                    } else if (listaDeNotasDelAcordeSecretoNovena.length === 5) {
                        const tieneDuplicada = listaDeNotasDelAcordeSecretoNovena.some(objetoNota => objetoNota.nombre.includes("Dub"));
                        if (tieneDuplicada === true) {
                            cantidadNotasRequeridas = 4;
                        } else {
                            cantidadNotasRequeridas = 5;
                        }
                    } else {
                        cantidadNotasRequeridas = 4;
                    }
                } else {
                    cantidadNotasRequeridas = listaDeNotasDelAcordeSecretoNovena.length;
                }

                if (listaDeNotasElegidasPorElUsuario.length >= cantidadNotasRequeridas) {
                    return;
                }

                const frecuenciaDelBotonPresionado = parseFloat(eventoDeClicGeneral.target.getAttribute("data-frecuencia"));
                const nombreEscritoDelBotonPresionado = eventoDeClicGeneral.target.textContent;

                window.reproducirTono(frecuenciaDelBotonPresionado);
                eventoDeClicGeneral.target.classList.add("seleccionada");
                
                if (botonParaBorrarSeleccionNovenas) {
                    botonParaBorrarSeleccionNovenas.classList.remove("oculto");
                }

                listaDeNotasElegidasPorElUsuario.push({ 
                    nombre: nombreEscritoDelBotonPresionado, 
                    frecuencia: frecuenciaDelBotonPresionado 
                });
                
                cuadroDeMensajeVisualNovenas.textContent = `Notas seleccionadas (${listaDeNotasElegidasPorElUsuario.length}/${cantidadNotasRequeridas}). Elige las que faltan y la cualidad.`;

                const usuarioCompletoLasNotas = listaDeNotasElegidasPorElUsuario.length === cantidadNotasRequeridas;
                const usuarioSeleccionoCualidad = cualidadElegidaPorElUsuario !== null;

                if (usuarioCompletoLasNotas && usuarioSeleccionoCualidad) {
                    validarResultadoDelAcordeDeNovena();
                }
            }
        });
    }

    // 7. INTERACCIÓN CON LOS BOTONES DE CUALIDAD
    listaDeBotonesDeCualidadNovena.forEach(botonDeCualidadIndividual => {
        botonDeCualidadIndividual.addEventListener("click", () => {
            if (listaDeNotasDelAcordeSecretoNovena.length === 0) {
                cuadroDeMensajeVisualNovenas.textContent = "⚠️ Primero haz clic en 'Escuchar Acorde'.";
                return;
            }
            
            listaDeBotonesDeCualidadNovena.forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
            botonDeCualidadIndividual.classList.add("seleccionada");
            
            cualidadElegidaPorElUsuario = botonDeCualidadIndividual.getAttribute("data-cualidad");

            let cantidadNotasRequeridas = 5;
            if (listaDeNotasElegidasPorElUsuario.length > 0) {
                cantidadNotasRequeridas = listaDeNotasElegidasPorElUsuario.length;
            }

            const usuarioCompletoLasNotas = listaDeNotasElegidasPorElUsuario.length === cantidadNotasRequeridas;
            const usuarioSeleccionoCualidad = cualidadElegidaPorElUsuario !== null;

            if (usuarioCompletoLasNotas && usuarioSeleccionoCualidad) {
                validarResultadoDelAcordeDeNovena();
            }
        });
    });

    // 8. BOTÓN PARA BORRAR SELECCIÓN
    if (botonParaBorrarSeleccionNovenas) {
        botonParaBorrarSeleccionNovenas.addEventListener("click", () => {
            listaDeNotasElegidasPorElUsuario = [];
            cualidadElegidaPorElUsuario = null;
            
            const botonesDeLaCuadricula = cuadriculaDeNotasNovenas.querySelectorAll(".boton-nota-pequeno");
            botonesDeLaCuadricula.forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
            listaDeBotonesDeCualidadNovena.forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
            
            botonParaBorrarSeleccionNovenas.classList.add("oculto");
            cuadroDeMensajeVisualNovenas.textContent = "Selección borrada. Vuelve a elegir las notas y la cualidad.";
        });
    }

    // 9. EVALUACIÓN FINAL DEL RETO (50 PUNTOS)
    async function validarResultadoDelAcordeDeNovena() {
        
        const frecuenciasSecretasBase = listaDeNotasDelAcordeSecretoNovena.map(objetoNota => {
            let frecuenciaActual = objetoNota.frecuencia;
            while (frecuenciaActual > 500) {
                frecuenciaActual = frecuenciaActual / 2;
            }
            return Math.round(frecuenciaActual * 10) / 10;
        });

        const frecuenciasUsuarioBase = listaDeNotasElegidasPorElUsuario.map(objetoNota => {
            let frecuenciaActual = objetoNota.frecuencia;
            while (frecuenciaActual > 500) {
                frecuenciaActual = frecuenciaActual / 2;
            }
            return Math.round(frecuenciaActual * 10) / 10;
        });

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
        
        const laCualidadEsCorrecta = cualidadElegidaPorElUsuario === cualidadSecretaDelAcordeNovena;

        if (lasNotasSonIdenticas && laCualidadEsCorrecta) {
            cuadroDeMensajeVisualNovenas.textContent = `🎉 ¡Correcto! Acorde ${cualidadSecretaDelAcordeNovena} identificado con inversión. (+50 pts)`;
            cuadroDeMensajeVisualNovenas.className = "mensaje-exito";
            
            contadorDePuntosTotalesNovenas += 50; 
            if (etiquetaPuntajeMostradoNovenas) {
                etiquetaPuntajeMostradoNovenas.textContent = contadorDePuntosTotalesNovenas;
            }
            
            await window.guardarPuntajeGenerico(50, "Acordes de Novena", "acierto");
        } else {
            cuadroDeMensajeVisualNovenas.textContent = `❌ Fallaste. Era un acorde ${cualidadSecretaDelAcordeNovena}. (0 pts)`;
            cuadroDeMensajeVisualNovenas.className = "mensaje-error";
            
            await window.guardarPuntajeGenerico(0, "Acordes de Novena", "fallo");
        }

        listaDeNotasDelAcordeSecretoNovena = [];
        listaDeNotasElegidasPorElUsuario = [];
        cualidadElegidaPorElUsuario = null;
        
        const botonesDeLaCuadricula = cuadriculaDeNotasNovenas.querySelectorAll(".boton-nota-pequeno");
        botonesDeLaCuadricula.forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
        listaDeBotonesDeCualidadNovena.forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
        
        if (botonParaBorrarSeleccionNovenas) {
            botonParaBorrarSeleccionNovenas.classList.add("oculto");
        }
    }
});