/* ==========================================================
   LÓGICA DE LOS NIVELES 2 Y 3 (intervalos.js)
   ========================================================== */

// Todo el código está protegido aquí adentro para que se ejecute solo cuando el navegador 
// haya terminado de dibujar completamente todos los botones y contenedores del HTML.
document.addEventListener("DOMContentLoaded", () => {
    
    // ------------------------------------------------------
    // HERRAMIENTA: CREADOR DE BOTONES (Para Niveles 2 y 3)
    // ------------------------------------------------------
    
    // ¿Por qué una función? Porque el Nivel 2 y el Nivel 3 necesitan una cuadrícula de 24 botones idénticos.
    // En lugar de escribir 48 botones a mano en el HTML, esta herramienta los construye automáticamente.
    function inicializarCuadriculaDeBotones(identificadorDeLaCajaHtml, claseCssParaLosBotones) {
        
        // 1. Buscamos la caja vacía en el HTML donde vamos a meter los botones
        const cajaContenedoraHtml = document.getElementById(identificadorDeLaCajaHtml);
        if (!cajaContenedoraHtml) return; // Si la caja no existe, nos detenemos para evitar errores
        
        // 2. Vaciamos la caja por si ya tenía botones viejos de un juego anterior
        cajaContenedoraHtml.innerHTML = "";
        
        // 3. Traemos el arreglo gigante de 24 notas que está guardado en audio.js (window.bancoNotas24)
        // Usamos forEach para recorrer cada nota del banco, una por una.
        window.bancoNotas24.forEach((notaIndividualDelBanco, numeroDeIndice) => {
            
            // Creamos un botón nuevecito "en el aire" (en la memoria de JavaScript)
            const nuevoBotonDeNota = document.createElement("button");
            
            // Le ponemos la clase de CSS para que se pinte de color anaranjado y tenga forma
            nuevoBotonDeNota.className = claseCssParaLosBotones;
            
            // Le escribimos el texto visible en el centro del botón (ej: "Do 4" o "Fa# 5")
            nuevoBotonDeNota.textContent = notaIndividualDelBanco.nombre;
            
            // Le pegamos dos "etiquetas invisibles" al botón (data-index y data-frecuencia).
            // Esto sirve para que, cuando el usuario le dé clic, sepamos exactamente qué nota tocó
            // sin tener que leer el texto, leyendo directamente la frecuencia exacta en hertzios.
            nuevoBotonDeNota.setAttribute("data-index", numeroDeIndice);
            nuevoBotonDeNota.setAttribute("data-frecuencia", notaIndividualDelBanco.frecuencia);
            
            // Finalmente, metemos el botón dentro de la caja visible en el HTML
            cajaContenedoraHtml.appendChild(nuevoBotonDeNota);
        });
    }
    
    // Ejecutamos la herramienta dos veces: Una para rellenar el Nivel 2, y otra para el Nivel 3.
    inicializarCuadriculaDeBotones("grid-notas-intervalos", "boton-nota-intervalo");
    inicializarCuadriculaDeBotones("grid-notas-compuestos", "boton-nota-compuesto");


    // ------------------------------------------------------
    // SECCIÓN 3: LÓGICA DEL NIVEL 2 (INTERVALOS SIMPLES)
    // ------------------------------------------------------

    // 3.1 Buscamos los elementos del Nivel 2 en el HTML
    const botonDeEscucharIntervaloNivel2 = document.getElementById("boton-reto-intervalo");
    const cuadroDeMensajeVisualNivel2 = document.getElementById("mensaje-estado-intervalo");
    const panelDesplegableDeOpcionesNivel2 = document.getElementById("panel-opciones-intervalos");
    const etiquetaPuntajeMostradoNivel2 = document.querySelector("#marcador-puntaje-intervalos span");
    const listaDeBotonesDeOpcionesNivel2 = document.querySelectorAll(".btn-opcion-intervalo");
    const botonParaBorrarSeleccionNivel2 = document.getElementById("btn-deseleccionar");

    // 3.2 Variables de memoria interna para guardar el reto activo y los puntos
    let notaSecretaGeneradaUnoNivel2 = null;
    let notaSecretaGeneradaDosNivel2 = null;
    let distanciaDeSemitonosObjetivoNivel2 = null;
    let contadorDePuntosTotalesNivel2 = 0;

    // 3.3 Acción: El usuario hace clic en el botón azul de "Escuchar Intervalo"
    if (botonDeEscucharIntervaloNivel2) {
        botonDeEscucharIntervaloNivel2.addEventListener("click", () => {
            
            // IMPORTANTE: Si ya hay un reto activo (ya hay 2 notas secretas), NO generamos notas nuevas.
            // Esto permite que el usuario pueda darle clic al botón azul varias veces para escuchar el 
            // mismo sonido una y otra vez hasta que esté seguro, sin que el juego le cambie las notas.
            if (!notaSecretaGeneradaUnoNivel2 || !notaSecretaGeneradaDosNivel2) {
                
                // --- Generación del Nuevo Reto ---
                // Elegimos una primera nota al azar usando Math.random (entre 0 y 23)
                const indiceDeLaPrimeraNota = Math.floor(Math.random() * window.bancoNotas24.length);
                
                // Elegimos una distancia al azar entre 1 y 12 semitonos (porque este nivel es de intervalos Simples, máximo una octava)
                distanciaDeSemitonosObjetivoNivel2 = Math.floor(Math.random() * 12) + 1;
                
                // Calculamos en qué posición cae la segunda nota
                let indiceDeLaSegundaNota = indiceDeLaPrimeraNota + distanciaDeSemitonosObjetivoNivel2;
                
                // Si la suma se pasa de 23 (no tenemos tantas notas agudas), calculamos la segunda nota 
                // restando la distancia hacia atrás (hacia las notas más graves)
                if (indiceDeLaSegundaNota >= window.bancoNotas24.length) {
                    indiceDeLaSegundaNota = indiceDeLaPrimeraNota - distanciaDeSemitonosObjetivoNivel2;
                    distanciaDeSemitonosObjetivoNivel2 = Math.abs(indiceDeLaPrimeraNota - indiceDeLaSegundaNota);
                }

                // Guardamos en la memoria las dos notas musicales que formarán el reto
                notaSecretaGeneradaUnoNivel2 = window.bancoNotas24[indiceDeLaPrimeraNota];
                notaSecretaGeneradaDosNivel2 = window.bancoNotas24[indiceDeLaSegundaNota];

                // Limpiamos las variables temporales del usuario, por si viene de jugar una ronda anterior
                window.notaQueElUsuarioEligioUnoNivel2 = null;
                window.notaQueElUsuarioEligioDosNivel2 = null;
                
                // Limpiamos la pintura azul de selección de todos los botones de la cuadrícula
                document.querySelectorAll(".boton-nota-intervalo").forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
                
                // Ocultamos el panel amarillo de respuestas (porque todavía no selecciona las 2 notas)
                if (panelDesplegableDeOpcionesNivel2) panelDesplegableDeOpcionesNivel2.classList.add("oculto");
                if (botonParaBorrarSeleccionNivel2) botonParaBorrarSeleccionNivel2.classList.add("oculto");
            }

            // Cambiamos el texto de instrucciones en pantalla
            cuadroDeMensajeVisualNivel2.textContent = "🔊 Reproduciendo intervalo... Selecciona las dos notas en la cuadrícula.";
            cuadroDeMensajeVisualNivel2.className = "mensaje-neutro";
            
            // Le mandamos las dos notas secretas al motor de audio (audio.js) para que las reproduzca con eco y luego juntas
            window.reproducirSecuenciaAcorde([notaSecretaGeneradaUnoNivel2.frecuencia, notaSecretaGeneradaDosNivel2.frecuencia]);
        });
    }

    // 3.4 Acción: El usuario hace clic en alguno de los 24 botones de la cuadrícula
    // Usamos 'document.addEventListener' en lugar de revisar botón por botón (esto se llama delegación de eventos)
    // Es más eficiente y funciona aunque los botones se hayan creado dinámicamente con la herramienta inicial.
    document.addEventListener("click", (eventoDeClicGeneral) => {
        
        // Verificamos que el clic fue específicamente sobre un botón de la cuadrícula del Nivel 2
        if (eventoDeClicGeneral.target.classList.contains("boton-nota-intervalo")) {
            
            // Si el usuario da clic antes de pedir el reto, lo frenamos
            if (!notaSecretaGeneradaUnoNivel2 || !notaSecretaGeneradaDosNivel2) {
                cuadroDeMensajeVisualNivel2.textContent = "⚠️ Primero haz clic en 'Escuchar Intervalo'.";
                return; // Corta la ejecución aquí
            }

            // Si el usuario ya eligió sus 2 notas, ignoramos los clics adicionales
            if (window.notaQueElUsuarioEligioUnoNivel2 && window.notaQueElUsuarioEligioDosNivel2) return;

            // Extraemos la frecuencia que le habíamos escondido al botón en el atributo 'data-frecuencia'
            const frecuenciaDelBotonPresionado = parseFloat(eventoDeClicGeneral.target.getAttribute("data-frecuencia"));
            const nombreEscritoDelBotonPresionado = eventoDeClicGeneral.target.textContent;

            // Hacemos que suene la nota que tocó el usuario y pintamos el botón de azul oscuro
            window.reproducirTono(frecuenciaDelBotonPresionado);
            eventoDeClicGeneral.target.classList.add("seleccionada");

            // SITUACIÓN A: El usuario está eligiendo su PRIMERA nota
            if (!window.notaQueElUsuarioEligioUnoNivel2) {
                window.notaQueElUsuarioEligioUnoNivel2 = { nombre: nombreEscritoDelBotonPresionado, frecuencia: frecuenciaDelBotonPresionado };
                cuadroDeMensajeVisualNivel2.textContent = `Nota 1: ${nombreEscritoDelBotonPresionado}. Selecciona la segunda nota.`;
                
                // Aparecemos el botoncito rojo de "Borrar" por si se arrepiente
                if (botonParaBorrarSeleccionNivel2) botonParaBorrarSeleccionNivel2.classList.remove("oculto");
            } 
            // SITUACIÓN B: El usuario está eligiendo su SEGUNDA nota (y aseguramos que no sea la misma que la primera)
            else if (!window.notaQueElUsuarioEligioDosNivel2 && window.notaQueElUsuarioEligioUnoNivel2.nombre !== nombreEscritoDelBotonPresionado) {
                window.notaQueElUsuarioEligioDosNivel2 = { nombre: nombreEscritoDelBotonPresionado, frecuencia: frecuenciaDelBotonPresionado };
                cuadroDeMensajeVisualNivel2.textContent = `Seleccionaste: ${window.notaQueElUsuarioEligioUnoNivel2.nombre} y ${window.notaQueElUsuarioEligioDosNivel2.nombre}. ¿Qué intervalo es?`;
                
                // Como ya eligió ambas notas, despegamos el panel amarillo con las 12 opciones teóricas
                if (panelDesplegableDeOpcionesNivel2) panelDesplegableDeOpcionesNivel2.classList.remove("oculto");
            }
        }
    });

    // 3.5 Acción: Botón "Borrar"
    // Si el usuario se equivocó seleccionando en la cuadrícula, este botón limpia la pizarra
    if (botonParaBorrarSeleccionNivel2) {
        botonParaBorrarSeleccionNivel2.addEventListener("click", () => {
            window.notaQueElUsuarioEligioUnoNivel2 = null;
            window.notaQueElUsuarioEligioDosNivel2 = null;
            
            // Le quitamos la clase "seleccionada" a todos los botones para que vuelvan a ser naranjas
            document.querySelectorAll(".boton-nota-intervalo").forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
            
            // Escondemos el panel amarillo y el botón borrar
            if (panelDesplegableDeOpcionesNivel2) panelDesplegableDeOpcionesNivel2.classList.add("oculto");
            if (botonParaBorrarSeleccionNivel2) botonParaBorrarSeleccionNivel2.classList.add("oculto");
            
            cuadroDeMensajeVisualNivel2.textContent = "Selección borrada. Vuelve a elegir las dos notas.";
            cuadroDeMensajeVisualNivel2.className = "mensaje-neutro";
        });
    }

    // 3.6 Acción: El usuario escoge una respuesta del panel amarillo (ej: "5ta Justa")
    listaDeBotonesDeOpcionesNivel2.forEach(botonDeOpcionIndividual => {
        botonDeOpcionIndividual.addEventListener("click", async () => {
            // Seguridad: Si intenta responder pero le falta seleccionar una nota de la cuadrícula, ignoramos el clic
            if (!notaSecretaGeneradaUnoNivel2 || !window.notaQueElUsuarioEligioDosNivel2) return;
            
            // Leemos cuántos semitonos teóricos vale el botón amarillo que presionó (viene del HTML 'data-intervalo')
            const cantidadDeSemitonosDeLaOpcionElegida = parseInt(botonDeOpcionIndividual.getAttribute("data-intervalo"));
            
            // Buscamos en el banco general qué posición ocupan las dos notas que el usuario eligió en la cuadrícula
            const indiceDeLaNotaElegidaUno = window.bancoNotas24.findIndex(notaDelBanco => notaDelBanco.frecuencia === notaSecretaGeneradaUnoNivel2.frecuencia);
            const indiceDeLaNotaElegidaDos = window.bancoNotas24.findIndex(notaDelBanco => notaDelBanco.frecuencia === window.notaQueElUsuarioEligioDosNivel2.frecuencia);
            
            // Restamos ambas posiciones (Math.abs para que el número sea siempre positivo) para saber la distancia real
            const cantidadDeSemitonosRealesDelUsuario = Math.abs(indiceDeLaNotaElegidaUno - indiceDeLaNotaElegidaDos);

            // EVALUACIÓN FINAL: ¿La distancia matemática de las teclas coincide con el valor teórico del botón amarillo?
            if (cantidadDeSemitonosDeLaOpcionElegida === cantidadDeSemitonosRealesDelUsuario) {
                // GANÓ
                cuadroDeMensajeVisualNivel2.textContent = `🎉 ¡Correcto! Es el intervalo correcto. (+15 pts)`;
                cuadroDeMensajeVisualNivel2.className = "mensaje-exito";
                
                // Sumar puntos visualmente y enviar a la base de datos de audio.js
                contadorDePuntosTotalesNivel2 += 15;
                if (etiquetaPuntajeMostradoNivel2) etiquetaPuntajeMostradoNivel2.textContent = contadorDePuntosTotalesNivel2;
                await window.guardarPuntajeGenerico(15, 'Intervalos Simples', 'acierto');
            } else {
                // PERDIÓ
                cuadroDeMensajeVisualNivel2.textContent = `❌ Fallaste. Era otro intervalo. (0 pts)`;
                cuadroDeMensajeVisualNivel2.className = "mensaje-error";
                await window.guardarPuntajeGenerico(0, 'Intervalos Simples', 'fallo');
            }

            // Después de responder (acierte o falle), borramos toda la memoria del reto
            // para obligarlo a presionar el botón azul y empezar una ronda nueva
            notaSecretaGeneradaUnoNivel2 = null;
            notaSecretaGeneradaDosNivel2 = null;
            window.notaQueElUsuarioEligioUnoNivel2 = null;
            window.notaQueElUsuarioEligioDosNivel2 = null;
            
            document.querySelectorAll(".boton-nota-intervalo").forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
            if (panelDesplegableDeOpcionesNivel2) panelDesplegableDeOpcionesNivel2.classList.add("oculto");
            if (botonParaBorrarSeleccionNivel2) botonParaBorrarSeleccionNivel2.classList.add("oculto");
        });
    });


    // ------------------------------------------------------
    // SECCIÓN 4: LÓGICA DEL NIVEL 3 (INTERVALOS COMPUESTOS)
    // ------------------------------------------------------
    // AVISO: Toda la mecánica es exactamente igual a la del Nivel 2. 
    // Las únicas diferencias son:
    // 1. Las variables tienen sufijo "Nivel3" o "compuesto"
    // 2. La fórmula matemática crea distancias mayores a 13 semitonos.
    
    const botonDeEscucharIntervaloNivel3 = document.getElementById("boton-reto-compuestos");
    const cuadroDeMensajeVisualNivel3 = document.getElementById("mensaje-estado-compuestos");
    const panelDesplegableDeOpcionesNivel3 = document.getElementById("panel-opciones-compuestos");
    const etiquetaPuntajeMostradoNivel3 = document.querySelector("#marcador-puntaje-compuestos span");
    const botonParaBorrarSeleccionNivel3 = document.getElementById("btn-deseleccionar-compuestos");
    const listaDeBotonesDeOpcionesNivel3 = document.querySelectorAll(".btn-opcion-compuesto");

    let notaSecretaGeneradaUnoNivel3 = null;
    let notaSecretaGeneradaDosNivel3 = null;
    let contadorDePuntosTotalesNivel3 = 0;

    if (botonDeEscucharIntervaloNivel3) {
        botonDeEscucharIntervaloNivel3.addEventListener("click", () => {
            // Igual que en el Nivel 2: Si ya hay un reto, repetimos el sonido sin cambiar las notas.
            if (!notaSecretaGeneradaUnoNivel3 || !notaSecretaGeneradaDosNivel3) {
                
                // DIFERENCIA MATEMÁTICA: Restamos 13 al tamaño del banco. 
                // Esto asegura que la primera nota sea lo suficientemente grave para dejar "espacio"
                // y que la segunda nota pueda saltar más de una octava sin salirse del teclado.
                const indiceDeLaPrimeraNota = Math.floor(Math.random() * (window.bancoNotas24.length - 13));
                
                // La distancia ahora será siempre entre 13 y 24 semitonos (Intervalo Compuesto)
                const distanciaDeSemitonosObjetivoNivel3 = Math.floor(Math.random() * 12) + 13; 
                
                const indiceDeLaSegundaNota = indiceDeLaPrimeraNota + distanciaDeSemitonosObjetivoNivel3;
                
                notaSecretaGeneradaUnoNivel3 = window.bancoNotas24[indiceDeLaPrimeraNota];
                notaSecretaGeneradaDosNivel3 = window.bancoNotas24[indiceDeLaSegundaNota];

                window.notaQueElUsuarioEligioUnoNivel3 = null;
                window.notaQueElUsuarioEligioDosNivel3 = null;
                
                document.querySelectorAll(".boton-nota-compuesto").forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
                if (panelDesplegableDeOpcionesNivel3) panelDesplegableDeOpcionesNivel3.classList.add("oculto");
                if (botonParaBorrarSeleccionNivel3) botonParaBorrarSeleccionNivel3.classList.add("oculto");
            }

            cuadroDeMensajeVisualNivel3.textContent = "🔊 Reproduciendo intervalo compuesto... Selecciona las dos notas.";
            cuadroDeMensajeVisualNivel3.className = "mensaje-neutro";

            window.reproducirSecuenciaAcorde([notaSecretaGeneradaUnoNivel3.frecuencia, notaSecretaGeneradaDosNivel3.frecuencia]);
        });
    }

    // Igual al Nivel 2: Detecta clics en los botones de la cuadrícula
    document.addEventListener("click", (eventoDeClicGeneral) => {
        if (eventoDeClicGeneral.target.classList.contains("boton-nota-compuesto")) {
            if (!notaSecretaGeneradaUnoNivel3 || !notaSecretaGeneradaDosNivel3) {
                cuadroDeMensajeVisualNivel3.textContent = "⚠️ Primero haz clic en 'Escuchar Intervalo Compuesto'.";
                return;
            }
            
            if (window.notaQueElUsuarioEligioUnoNivel3 && window.notaQueElUsuarioEligioDosNivel3) return;

            const frecuenciaDelBotonPresionado = parseFloat(eventoDeClicGeneral.target.getAttribute("data-frecuencia"));
            const nombreEscritoDelBotonPresionado = eventoDeClicGeneral.target.textContent;

            window.reproducirTono(frecuenciaDelBotonPresionado);
            eventoDeClicGeneral.target.classList.add("seleccionada");

            if (!window.notaQueElUsuarioEligioUnoNivel3) {
                window.notaQueElUsuarioEligioUnoNivel3 = { nombre: nombreEscritoDelBotonPresionado, frecuencia: frecuenciaDelBotonPresionado };
                cuadroDeMensajeVisualNivel3.textContent = `Nota 1: ${nombreEscritoDelBotonPresionado}. Selecciona la segunda nota.`;
                if (botonParaBorrarSeleccionNivel3) botonParaBorrarSeleccionNivel3.classList.remove("oculto");
            } 
            else if (!window.notaQueElUsuarioEligioDosNivel3 && window.notaQueElUsuarioEligioUnoNivel3.nombre !== nombreEscritoDelBotonPresionado) {
                window.notaQueElUsuarioEligioDosNivel3 = { nombre: nombreEscritoDelBotonPresionado, frecuencia: frecuenciaDelBotonPresionado };
                cuadroDeMensajeVisualNivel3.textContent = `Seleccionaste dos notas. ¿Qué intervalo compuesto es?`;
                if (panelDesplegableDeOpcionesNivel3) panelDesplegableDeOpcionesNivel3.classList.remove("oculto");
            }
        }
    });

    // Acción borrar selección del Nivel 3
    if (botonParaBorrarSeleccionNivel3) {
        botonParaBorrarSeleccionNivel3.addEventListener("click", () => {
            window.notaQueElUsuarioEligioUnoNivel3 = null;
            window.notaQueElUsuarioEligioDosNivel3 = null;
            
            document.querySelectorAll(".boton-nota-compuesto").forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
            if (panelDesplegableDeOpcionesNivel3) panelDesplegableDeOpcionesNivel3.classList.add("oculto");
            if (botonParaBorrarSeleccionNivel3) botonParaBorrarSeleccionNivel3.classList.add("oculto");
            
            cuadroDeMensajeVisualNivel3.textContent = "Selección borrada. Vuelve a elegir las dos notas.";
            cuadroDeMensajeVisualNivel3.className = "mensaje-neutro";
        });
    }

    // Igual al Nivel 2: Compara la distancia física elegida contra el valor teórico del botón amarillo del Nivel 3
    listaDeBotonesDeOpcionesNivel3.forEach(botonDeOpcionIndividual => {
        botonDeOpcionIndividual.addEventListener("click", async () => {
            if (!notaSecretaGeneradaUnoNivel3 || !window.notaQueElUsuarioEligioDosNivel3) return;
            
            const cantidadDeSemitonosDeLaOpcionElegida = parseInt(botonDeOpcionIndividual.getAttribute("data-intervalo"));
            
            const indiceDeLaNotaElegidaUno = window.bancoNotas24.findIndex(notaDelBanco => notaDelBanco.frecuencia === notaSecretaGeneradaUnoNivel3.frecuencia);
            const indiceDeLaNotaElegidaDos = window.bancoNotas24.findIndex(notaDelBanco => notaDelBanco.frecuencia === window.notaQueElUsuarioEligioDosNivel3.frecuencia);
            
            const cantidadDeSemitonosRealesDelUsuario = Math.abs(indiceDeLaNotaElegidaUno - indiceDeLaNotaElegidaDos);

            if (cantidadDeSemitonosDeLaOpcionElegida === cantidadDeSemitonosRealesDelUsuario) {
                // Acierto (El nivel 3 da 20 puntos de recompensa)
                cuadroDeMensajeVisualNivel3.textContent = `🎉 ¡Correcto! Intervalo compuesto exacto. (+20 pts)`;
                cuadroDeMensajeVisualNivel3.className = "mensaje-exito";
                contadorDePuntosTotalesNivel3 += 20;
                if (etiquetaPuntajeMostradoNivel3) etiquetaPuntajeMostradoNivel3.textContent = contadorDePuntosTotalesNivel3;
                await window.guardarPuntajeGenerico(20, 'Intervalos Compuestos', 'acierto');
            } else {
                // Fallo
                cuadroDeMensajeVisualNivel3.textContent = `❌ Fallaste. Era otro intervalo. (0 pts)`;
                cuadroDeMensajeVisualNivel3.className = "mensaje-error";
                await window.guardarPuntajeGenerico(0, 'Intervalos Compuestos', 'fallo');
            }

            // Reseteo al terminar
            notaSecretaGeneradaUnoNivel3 = null;
            notaSecretaGeneradaDosNivel3 = null;
            window.notaQueElUsuarioEligioUnoNivel3 = null;
            window.notaQueElUsuarioEligioDosNivel3 = null;
            
            document.querySelectorAll(".boton-nota-compuesto").forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
            if (panelDesplegableDeOpcionesNivel3) panelDesplegableDeOpcionesNivel3.classList.add("oculto");
            if (botonParaBorrarSeleccionNivel3) botonParaBorrarSeleccionNivel3.classList.add("oculto");
        });
    });
});