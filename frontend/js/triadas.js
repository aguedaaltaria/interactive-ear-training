/* ==========================================================
   LÓGICA DEL NIVEL 4: TRÍADAS SIMPLES E INVERSIONES (triadas.js)
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    // ------------------------------------------------------
    // 1. CONEXIÓN CON LOS ELEMENTOS DE LA PANTALLA (HTML)
    // ------------------------------------------------------
    const cuadriculaDeNotasTriadas = document.getElementById("grid-notas-triadas");
    const botonDeEscucharAcordeTriadas = document.getElementById("boton-reto-triadas");
    const cuadroDeMensajeVisualTriadas = document.getElementById("mensaje-estado-triadas");
    const etiquetaPuntajeMostradoTriadas = document.querySelector("#marcador-puntaje-triadas span");
    const botonParaBorrarSeleccionTriadas = document.getElementById("btn-deseleccionar-triadas");
    const listaDeBotonesDeCualidad = document.querySelectorAll(".btn-cualidad");
    
    const botonDeVolverDelNivel4 = document.getElementById("btn-volver-triadas");
    const pantallaDelMenuPrincipal = document.getElementById("menu-niveles");
    const pantallaDelNivel4_Triadas = document.getElementById("vista-triadas");

    // ------------------------------------------------------
    // 2. VARIABLES DE MEMORIA PARA EL JUEGO ACTUAL
    // ------------------------------------------------------
    let listaDeNotasDelAcordeSecreto = [];
    let cualidadSecretaDelAcorde = null;
    
    let listaDeNotasElegidasPorElUsuario = [];
    let cualidadElegidaPorElUsuario = null;
    let contadorDePuntosTotalesTriadas = 0;

    if (botonDeVolverDelNivel4) {
        botonDeVolverDelNivel4.addEventListener("click", () => {
            if (pantallaDelNivel4_Triadas) pantallaDelNivel4_Triadas.classList.add("oculto");
            if (pantallaDelMenuPrincipal) pantallaDelMenuPrincipal.classList.remove("oculto");
        });
    }

    // ------------------------------------------------------
    // 3. CONSTRUCCIÓN DE LA CUADRÍCULA DE NOTAS
    // ------------------------------------------------------
    function inicializarBotonesParaTriadas() {
        if (!cuadriculaDeNotasTriadas) return;
        cuadriculaDeNotasTriadas.innerHTML = "";
        
        window.bancoNotas24.forEach((notaIndividualDelBanco, numeroDeIndice) => {
            const nuevoBotonDeNota = document.createElement("button");
            nuevoBotonDeNota.className = "boton-nota-triada";
            nuevoBotonDeNota.textContent = notaIndividualDelBanco.nombre;
            nuevoBotonDeNota.setAttribute("data-index", numeroDeIndice);
            nuevoBotonDeNota.setAttribute("data-frecuencia", notaIndividualDelBanco.frecuencia);
            cuadriculaDeNotasTriadas.appendChild(nuevoBotonDeNota);
        });
    }
    inicializarBotonesParaTriadas();

    // ------------------------------------------------------
    // 4. LÓGICA PARA GENERAR Y ESCUCHAR EL ACORDE SECRETO
    // ------------------------------------------------------
    if (botonDeEscucharAcordeTriadas) {
        botonDeEscucharAcordeTriadas.addEventListener("click", () => {
            
            if (listaDeNotasDelAcordeSecreto.length === 0) {
                // Margen seguro para que el acorde y su inversión quepan en los 24 botones
                const indiceDeLaNotaRaiz = Math.floor(Math.random() * 15);
                
                const listaDeCualidadesPosibles = [
                    { nombre: "mayor", distanciaTercera: 4, distanciaQuinta: 7 },
                    { nombre: "menor", distanciaTercera: 3, distanciaQuinta: 7 },
                    { nombre: "disminuida", distanciaTercera: 3, distanciaQuinta: 6 },
                    { nombre: "aumentada", distanciaTercera: 4, distanciaQuinta: 8 }
                ];
                
                const objetoDeCualidadSeleccionada = listaDeCualidadesPosibles[Math.floor(Math.random() * listaDeCualidadesPosibles.length)];
                cualidadSecretaDelAcorde = objetoDeCualidadSeleccionada.nombre;

                // Obtenemos las 3 notas base en estado fundamental
                let notaRaiz = window.bancoNotas24[indiceDeLaNotaRaiz];
                let notaTercera = window.bancoNotas24[indiceDeLaNotaRaiz + objetoDeCualidadSeleccionada.distanciaTercera];
                let notaQuinta = window.bancoNotas24[indiceDeLaNotaRaiz + objetoDeCualidadSeleccionada.distanciaQuinta];

                let notasBase = [notaRaiz, notaTercera, notaQuinta];

                // 🎲 APLICAR INVERSIONES (50% Fundamental, 25% 1ra Inversión, 25% 2da Inversión)
                const probabilidadInversion = Math.random() * 100;
                let notasInvertidas = [...notasBase];

                if (probabilidadInversion >= 50 && probabilidadInversion < 75) {
                    // 1ra Inversión: La tercera pasa al bajo, la fundamental sube una octava
                    let notaRaizOctava = { nombre: notaRaiz.nombre + " (St)", frecuencia: notaRaiz.frecuencia * 2 };
                    notasInvertidas = [notaTercera, notaQuinta, notaRaizOctava];
                } else if (probabilidadInversion >= 75) {
                    // 2da Inversión: La quinta pasa al bajo, la fundamental y la tercera suben una octava
                    let notaRaizOctava = { nombre: notaRaiz.nombre + " (St)", frecuencia: notaRaiz.frecuencia * 2 };
                    let notaTerceraOctava = { nombre: notaTercera.nombre + " (St)", frecuencia: notaTercera.frecuencia * 2 };
                    notasInvertidas = [notaQuinta, notaRaizOctava, notaTerceraOctava];
                }

                // 🎲 AÑADIR LA OCTAVA (A veces: 35% de probabilidad de duplicar la nota más grave arriba)
                if (Math.random() * 100 < 35) {
                    let notaBajoDuplicada = { 
                        nombre: notasInvertidas[0].nombre + " (Dub)", 
                        frecuencia: notasInvertidas[0].frecuencia * 2 
                    };
                    notasInvertidas.push(notaBajoDuplicada);
                }

                listaDeNotasDelAcordeSecreto = notasInvertidas;

                listaDeNotasElegidasPorElUsuario = [];
                cualidadElegidaPorElUsuario = null;
                
                document.querySelectorAll(".boton-nota-triada").forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
                listaDeBotonesDeCualidad.forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
                
                if (botonParaBorrarSeleccionTriadas) botonParaBorrarSeleccionTriadas.classList.add("oculto");
            }

            cuadroDeMensajeVisualTriadas.textContent = "🔊 Reproduciendo tríada con inversiones y sonoridad real...";
            cuadroDeMensajeVisualTriadas.className = "mensaje-neutro";

            // Reproducimos las frecuencias del acorde secreto
            window.reproducirSecuenciaAcorde(listaDeNotasDelAcordeSecreto.map(notaIndividual => notaIndividual.frecuencia));
        });
    }

    // ------------------------------------------------------
    // 5. INTERACCIÓN DEL USUARIO CON LA CUADRÍCULA DE NOTAS
    // ------------------------------------------------------
    document.addEventListener("click", (eventoDeClicGeneral) => {
        if (eventoDeClicGeneral.target.classList.contains("boton-nota-triada")) {
            
            if (listaDeNotasDelAcordeSecreto.length === 0) {
                cuadroDeMensajeVisualTriadas.textContent = "⚠️ Primero haz clic en 'Escuchar Acorde'.";
                return;
            }
            
            if (listaDeNotasElegidasPorElUsuario.length >= 3) return;

            const frecuenciaDelBotonPresionado = parseFloat(eventoDeClicGeneral.target.getAttribute("data-frecuencia"));
            const nombreEscritoDelBotonPresionado = eventoDeClicGeneral.target.textContent;

            window.reproducirTono(frecuenciaDelBotonPresionado);
            eventoDeClicGeneral.target.classList.add("seleccionada");
            
            if (botonParaBorrarSeleccionTriadas) botonParaBorrarSeleccionTriadas.classList.remove("oculto");

            listaDeNotasElegidasPorElUsuario.push({ nombre: nombreEscritoDelBotonPresionado, frecuencia: frecuenciaDelBotonPresionado });
            
            cuadroDeMensajeVisualTriadas.textContent = `Notas seleccionadas (${listaDeNotasElegidasPorElUsuario.length}/3). Elige las que faltan y la cualidad.`;

            if (listaDeNotasElegidasPorElUsuario.length === 3 && cualidadElegidaPorElUsuario) {
                validarResultadoDeLaTriada();
            }
        }
    });

    // ------------------------------------------------------
    // 6. INTERACCIÓN CON LOS BOTONES DE CUALIDAD
    // ------------------------------------------------------
    listaDeBotonesDeCualidad.forEach(botonDeCualidadIndividual => {
        botonDeCualidadIndividual.addEventListener("click", () => {
            if (listaDeNotasDelAcordeSecreto.length === 0) {
                cuadroDeMensajeVisualTriadas.textContent = "⚠️ Primero haz clic en 'Escuchar Acorde'.";
                return;
            }
            
            listaDeBotonesDeCualidad.forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
            botonDeCualidadIndividual.classList.add("seleccionada");
            
            cualidadElegidaPorElUsuario = botonDeCualidadIndividual.getAttribute("data-cualidad");

            if (listaDeNotasElegidasPorElUsuario.length === 3 && cualidadElegidaPorElUsuario) {
                validarResultadoDeLaTriada();
            }
        });
    });

    // ------------------------------------------------------
    // 7. BOTÓN PARA BORRAR Y REINICIAR SELECCIÓN
    // ------------------------------------------------------
    if (botonParaBorrarSeleccionTriadas) {
        botonParaBorrarSeleccionTriadas.addEventListener("click", () => {
            listaDeNotasElegidasPorElUsuario = [];
            cualidadElegidaPorElUsuario = null;
            
            document.querySelectorAll(".boton-nota-triada").forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
            listaDeBotonesDeCualidad.forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
            
            botonParaBorrarSeleccionTriadas.classList.add("oculto");
            cuadroDeMensajeVisualTriadas.textContent = "Selección borrada. Vuelve a elegir las 3 notas y la cualidad.";
        });
    }

    // ------------------------------------------------------
    // 8. EVALUACIÓN FINAL
    // ------------------------------------------------------
    async function validarResultadoDeLaTriada() {
        
        // Normalizamos las frecuencias del acorde secreto a su octava base para comparar componentes
        const frecuenciasSecretasBase = listaDeNotasDelAcordeSecreto.map(objetoNota => {
            let frecuenciaActual = objetoNota.frecuencia;
            while (frecuenciaActual > 500) {
                frecuenciaActual /= 2;
            }
            return Math.round(frecuenciaActual * 10) / 10;
        });

        // Hacemos el mismo proceso de normalización con las notas elegidas por el usuario
        const frecuenciasUsuarioBase = listaDeNotasElegidasPorElUsuario.map(objetoNota => {
            let frecuenciaActual = objetoNota.frecuencia;
            while (frecuenciaActual > 500) {
                frecuenciaActual /= 2;
            }
            return Math.round(frecuenciaActual * 10) / 10;
        });

        // Ordenamos ambas listas de menor a mayor para asegurar una comparación limpia
        frecuenciasSecretasBase.sort((a, b) => a - b);
        frecuenciasUsuarioBase.sort((a, b) => a - b);

        // Verificamos si las notas coinciden matemáticamente
        const lasNotasSonIguales = frecuenciasSecretasBase.every((frecuenciaSecreta, indice) => 
            Math.abs(frecuenciaSecreta - frecuenciasUsuarioBase[indice]) < 1.0
        );
        
        const laCualidadEsIgual = cualidadElegidaPorElUsuario === cualidadSecretaDelAcorde;

        if (lasNotasSonIguales && laCualidadEsIgual) {
            cuadroDeMensajeVisualTriadas.textContent = `🎉 ¡Correcto! Acorde ${cualidadSecretaDelAcorde} identificado con inversión. (+30 pts)`;
            cuadroDeMensajeVisualTriadas.className = "mensaje-exito";
            
            contadorDePuntosTotalesTriadas += 30;
            if (etiquetaPuntajeMostradoTriadas) etiquetaPuntajeMostradoTriadas.textContent = contadorDePuntosTotalesTriadas;
            
            await window.guardarPuntajeGenerico(30, "Tríadas Simples", "acierto");
        } else {
            cuadroDeMensajeVisualTriadas.textContent = `❌ Fallaste. Era acorde ${cualidadSecretaDelAcorde}. (0 pts)`;
            cuadroDeMensajeVisualTriadas.className = "mensaje-error";
            
            await window.guardarPuntajeGenerico(0, "Tríadas Simples", "fallo");
        }

        listaDeNotasDelAcordeSecreto = [];
        listaDeNotasElegidasPorElUsuario = [];
        cualidadElegidaPorElUsuario = null;
        
        document.querySelectorAll(".boton-nota-triada").forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
        listaDeBotonesDeCualidad.forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
        if (botonParaBorrarSeleccionTriadas) botonParaBorrarSeleccionTriadas.classList.add("oculto");
    }
});