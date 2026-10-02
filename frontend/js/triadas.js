/* ==========================================================
   LÓGICA DEL NIVEL 4: TRÍADAS SIMPLES E INVERSIONES (triadas.js)
   ========================================================== */

// Protegemos el código para que se ejecute solo cuando la pantalla esté totalmente dibujada
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
    
    // Elementos para la navegación
    const botonDeVolverDelNivel4 = document.getElementById("btn-volver-triadas");
    const pantallaDelMenuPrincipal = document.getElementById("menu-niveles");
    const pantallaDelNivel4_Triadas = document.getElementById("vista-triadas");

    // ------------------------------------------------------
    // 2. VARIABLES DE MEMORIA PARA EL JUEGO ACTUAL
    // ------------------------------------------------------
    let listaDeNotasDelAcordeSecreto = [];
    let cualidadSecretaDelAcorde = null; // Guardará si es "mayor", "menor", etc.
    
    let listaDeNotasElegidasPorElUsuario = [];
    let cualidadElegidaPorElUsuario = null;
    let contadorDePuntosTotalesTriadas = 0;

    // Acción del botón Volver: Oculta el juego de tríadas y muestra el menú principal
    if (botonDeVolverDelNivel4) {
        botonDeVolverDelNivel4.addEventListener("click", () => {
            if (pantallaDelNivel4_Triadas) pantallaDelNivel4_Triadas.classList.add("oculto");
            if (pantallaDelMenuPrincipal) pantallaDelMenuPrincipal.classList.remove("oculto");
        });
    }

    // ------------------------------------------------------
    // 3. CONSTRUCCIÓN DE LA CUADRÍCULA DE NOTAS
    // ------------------------------------------------------
    // Al igual que en el nivel 2 y 3, dibujamos los 24 botones de notas
    function inicializarBotonesParaTriadas() {
        if (!cuadriculaDeNotasTriadas) return;
        
        // Limpiamos la caja por si tenía botones anteriores
        cuadriculaDeNotasTriadas.innerHTML = "";
        
        // Recorremos el banco general de notas (que viene de audio.js)
        window.bancoNotas24.forEach((notaIndividualDelBanco, numeroDeIndice) => {
            const nuevoBotonDeNota = document.createElement("button");
            nuevoBotonDeNota.className = "boton-nota-triada";
            nuevoBotonDeNota.textContent = notaIndividualDelBanco.nombre;
            
            // Le escondemos la información útil (índice y frecuencia) para usarla cuando le den clic
            nuevoBotonDeNota.setAttribute("data-index", numeroDeIndice);
            nuevoBotonDeNota.setAttribute("data-frecuencia", notaIndividualDelBanco.frecuencia);
            
            cuadriculaDeNotasTriadas.appendChild(nuevoBotonDeNota);
        });
    }
    // Llamamos a la función inmediatamente para que los botones aparezcan al cargar la página
    inicializarBotonesParaTriadas();

    // ------------------------------------------------------
    // 4. LÓGICA PARA GENERAR Y ESCUCHAR EL ACORDE SECRETO
    // ------------------------------------------------------
    if (botonDeEscucharAcordeTriadas) {
        botonDeEscucharAcordeTriadas.addEventListener("click", () => {
            
            // Si la lista del acorde secreto está vacía, significa que debemos generar uno nuevo
            if (listaDeNotasDelAcordeSecreto.length === 0) {
                
                // Elegimos la primera nota (la Raíz). 
                // Usamos 18 como límite máximo para asegurarnos de que quepan las otras dos notas hacia arriba sin salirse de los 24 botones.
                const indiceDeLaNotaRaiz = Math.floor(Math.random() * 18);
                
                // Diccionario de cualidades de acordes y sus distancias matemáticas en semitonos
                const listaDeCualidadesPosibles = [
                    { nombre: "mayor", distanciaTercera: 4, distanciaQuinta: 7 },
                    { nombre: "menor", distanciaTercera: 3, distanciaQuinta: 7 },
                    { nombre: "disminuida", distanciaTercera: 3, distanciaQuinta: 6 },
                    { nombre: "aumentada", distanciaTercera: 4, distanciaQuinta: 8 }
                ];
                
                // Elegimos una cualidad al azar (mayor, menor, etc.)
                const objetoDeCualidadSeleccionada = listaDeCualidadesPosibles[Math.floor(Math.random() * listaDeCualidadesPosibles.length)];
                cualidadSecretaDelAcorde = objetoDeCualidadSeleccionada.nombre;

                // Calculamos dónde caen exactamente las 3 notas en el teclado (índices)
                const indiceNotaUno = indiceDeLaNotaRaiz;
                const indiceNotaDos = indiceDeLaNotaRaiz + objetoDeCualidadSeleccionada.distanciaTercera;
                const indiceNotaTres = indiceDeLaNotaRaiz + objetoDeCualidadSeleccionada.distanciaQuinta;

                // Guardamos las 3 notas reales sacadas de nuestro banco de notas
                listaDeNotasDelAcordeSecreto = [
                    window.bancoNotas24[indiceNotaUno],
                    window.bancoNotas24[indiceNotaDos],
                    window.bancoNotas24[indiceNotaTres]
                ];

                // Limpiamos todo el tablero del usuario por si viene de una jugada anterior
                listaDeNotasElegidasPorElUsuario = [];
                cualidadElegidaPorElUsuario = null;
                
                // Quitamos el color de selección azul de todos los botones de notas y de cualidad
                document.querySelectorAll(".boton-nota-triada").forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
                listaDeBotonesDeCualidad.forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
                
                // Ocultamos el botón de borrar selección hasta que elija algo
                if (botonParaBorrarSeleccionTriadas) botonParaBorrarSeleccionTriadas.classList.add("oculto");
            }

            // Cambiamos el mensaje para guiar al usuario y tocamos el sonido
            cuadroDeMensajeVisualTriadas.textContent = "🔊 Reproduciendo acorde con notas largas y acorde conjunto...";
            cuadroDeMensajeVisualTriadas.className = "mensaje-neutro";

            // Extraemos solo las frecuencias matemáticas de las 3 notas y se las mandamos al motor de audio
            window.reproducirSecuenciaAcorde(listaDeNotasDelAcordeSecreto.map(notaIndividual => notaIndividual.frecuencia));
        });
    }

    // ------------------------------------------------------
    // 5. INTERACCIÓN DEL USUARIO CON LA CUADRÍCULA DE NOTAS
    // ------------------------------------------------------
    document.addEventListener("click", (eventoDeClicGeneral) => {
        // Filtramos para actuar solo si el usuario hizo clic en un botón naranja de tríadas
        if (eventoDeClicGeneral.target.classList.contains("boton-nota-triada")) {
            
            // Seguridad: Debe escuchar el acorde primero
            if (listaDeNotasDelAcordeSecreto.length === 0) {
                cuadroDeMensajeVisualTriadas.textContent = "⚠️ Primero haz clic en 'Escuchar Acorde'.";
                return;
            }
            
            // Si el usuario ya eligió sus 3 notas, ignoramos más clics
            if (listaDeNotasElegidasPorElUsuario.length >= 3) return;

            // Leemos los datos del botón que presionó
            const frecuenciaDelBotonPresionado = parseFloat(eventoDeClicGeneral.target.getAttribute("data-frecuencia"));
            const nombreEscritoDelBotonPresionado = eventoDeClicGeneral.target.textContent;

            // Reproducimos la nota individualmente y pintamos el botón de azul
            window.reproducirTono(frecuenciaDelBotonPresionado);
            eventoDeClicGeneral.target.classList.add("seleccionada");
            
            // Aparecemos el botón rojo de borrar por si se arrepiente
            if (botonParaBorrarSeleccionTriadas) botonParaBorrarSeleccionTriadas.classList.remove("oculto");

            // Guardamos la nota en la "canasta" del usuario
            listaDeNotasElegidasPorElUsuario.push({ nombre: nombreEscritoDelBotonPresionado, frecuencia: frecuenciaDelBotonPresionado });
            
            // Le avisamos cuántas notas lleva elegidas
            cuadroDeMensajeVisualTriadas.textContent = `Notas seleccionadas (${listaDeNotasElegidasPorElUsuario.length}/3). Elige las que faltan y la cualidad.`;

            // Si ya completó las 3 notas Y también había elegido la cualidad, evaluamos el resultado automáticamente
            if (listaDeNotasElegidasPorElUsuario.length === 3 && cualidadElegidaPorElUsuario) {
                validarResultadoDeLaTriada();
            }
        }
    });

    // ------------------------------------------------------
    // 6. INTERACCIÓN DEL USUARIO CON LOS BOTONES DE CUALIDAD
    // ------------------------------------------------------
    listaDeBotonesDeCualidad.forEach(botonDeCualidadIndividual => {
        botonDeCualidadIndividual.addEventListener("click", () => {
            // Seguridad: Debe escuchar el acorde primero
            if (listaDeNotasDelAcordeSecreto.length === 0) {
                cuadroDeMensajeVisualTriadas.textContent = "⚠️ Primero haz clic en 'Escuchar Acorde'.";
                return;
            }
            
            // Le quitamos la pintura azul a todos los botones de cualidad y pintamos solo el que presionó
            listaDeBotonesDeCualidad.forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
            botonDeCualidadIndividual.classList.add("seleccionada");
            
            // Guardamos la cualidad (mayor, menor, etc.) que el usuario eligió leyendo el atributo del HTML
            cualidadElegidaPorElUsuario = botonDeCualidadIndividual.getAttribute("data-cualidad");

            // Si ya tenía las 3 notas seleccionadas y ahora eligió la cualidad, evaluamos
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
            // Vaciamos las variables del usuario
            listaDeNotasElegidasPorElUsuario = [];
            cualidadElegidaPorElUsuario = null;
            
            // Quitamos toda la pintura de selección
            document.querySelectorAll(".boton-nota-triada").forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
            listaDeBotonesDeCualidad.forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
            
            // Ocultamos este mismo botón de borrar y reiniciamos las instrucciones
            botonParaBorrarSeleccionTriadas.classList.add("oculto");
            cuadroDeMensajeVisualTriadas.textContent = "Selección borrada. Vuelve a elegir las 3 notas y la cualidad.";
        });
    }

    // ------------------------------------------------------
    // 8. EVALUACIÓN FINAL: COMPROBAR SI GANÓ O PERDIÓ
    // ------------------------------------------------------
    async function validarResultadoDeLaTriada() {
        
        // Extraemos solo las frecuencias (los números) de las notas secretas y de las notas del usuario.
        // Usamos .sort() para ordenarlas de menor a mayor. Así no importa si el usuario las seleccionó en desorden,
        // siempre compararemos la más grave con la más grave, la del medio con la del medio, etc.
        const frecuenciasDeLasNotasSecretasOrdenadas = listaDeNotasDelAcordeSecreto.map(notaIndividual => notaIndividual.frecuencia).sort((frecuenciaA, frecuenciaB) => frecuenciaA - frecuenciaB);
        const frecuenciasDeLasNotasDelUsuarioOrdenadas = listaDeNotasElegidasPorElUsuario.map(notaIndividual => notaIndividual.frecuencia).sort((frecuenciaA, frecuenciaB) => frecuenciaA - frecuenciaB);

        // Evaluamos si las 3 notas son idénticas utilizando .every().
        // Restamos las frecuencias y usamos Math.abs para asegurar que la diferencia sea prácticamente 0 (menor a 0.1 por seguridad de decimales).
        const lasNotasSonIguales = frecuenciasDeLasNotasSecretasOrdenadas.every((frecuenciaSecreta, numeroDeIndice) => 
            Math.abs(frecuenciaSecreta - frecuenciasDeLasNotasDelUsuarioOrdenadas[numeroDeIndice]) < 0.1
        );
        
        // Evaluamos si el texto de la cualidad coincide
        const laCualidadEsIgual = cualidadElegidaPorElUsuario === cualidadSecretaDelAcorde;

        // VEREDICTO
        if (lasNotasSonIguales && laCualidadEsIgual) {
            // Acierto: Si le atinó a las 3 notas Y a la cualidad, gana 30 puntos (¡Es el nivel más difícil!)
            cuadroDeMensajeVisualTriadas.textContent = `🎉 ¡Correcto! Acorde ${cualidadSecretaDelAcorde} identificado. (+30 pts)`;
            cuadroDeMensajeVisualTriadas.className = "mensaje-exito";
            
            contadorDePuntosTotalesTriadas += 30;
            if (etiquetaPuntajeMostradoTriadas) etiquetaPuntajeMostradoTriadas.textContent = contadorDePuntosTotalesTriadas;
            
            await window.guardarPuntajeGenerico(30, "Tríadas Simples", "acierto");
        } else {
            // Fallo: Si se equivocó en una nota o en la cualidad
            cuadroDeMensajeVisualTriadas.textContent = `❌ Fallaste. Era acorde ${cualidadSecretaDelAcorde}. (0 pts)`;
            cuadroDeMensajeVisualTriadas.className = "mensaje-error";
            
            await window.guardarPuntajeGenerico(0, "Tríadas Simples", "fallo");
        }

        // Después de validar, borramos toda la memoria del reto para obligarlo a pedir uno nuevo
        listaDeNotasDelAcordeSecreto = [];
        listaDeNotasElegidasPorElUsuario = [];
        cualidadElegidaPorElUsuario = null;
        
        // Despintamos todos los botones
        document.querySelectorAll(".boton-nota-triada").forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
        listaDeBotonesDeCualidad.forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
        if (botonParaBorrarSeleccionTriadas) botonParaBorrarSeleccionTriadas.classList.add("oculto");
    }
});