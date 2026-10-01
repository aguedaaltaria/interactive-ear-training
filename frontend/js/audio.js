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
    // 0. DECLARACIONES Y GESTIÓN DE USUARIO ACTIVO
    // ------------------------------------------------------
    let usuarioActualId = localStorage.getItem("ear_training_usuario_id");
    let usuarioActualNombre = localStorage.getItem("ear_training_usuario_nombre");

    const vistaUsuario = document.getElementById("vista-usuario");
    const menuNiveles = document.getElementById("menu-niveles");
    const vistaJuego = document.getElementById("vista-juego");
    const vistaIntervalos = document.getElementById("vista-intervalos");
    const inputUsuario = document.getElementById("input-usuario");
    const btnIngresar = document.getElementById("btn-ingresar");
    const mensajeErrorUsuario = document.getElementById("mensaje-error-usuario");
    
    const indicadorUsuarioFlotante = document.getElementById("indicador-usuario-flotante");
    const nombreUsuarioBadge = document.getElementById("nombre-usuario-badge");
    const btnCambiarUsuario = document.getElementById("btn-cambiar-usuario");

    const vistaCompuestos = document.getElementById("vista-intervalos-compuestos");
    const botonVolverCompuestos = document.getElementById("btn-volver-compuestos");

    // Si ya hay un usuario guardado al cargar la página
    if (usuarioActualId && usuarioActualNombre) {
        if (vistaUsuario) vistaUsuario.classList.add("oculto");
        if (menuNiveles) menuNiveles.classList.remove("oculto");
        mostrarBadgeUsuario(usuarioActualNombre);
        cargarHistorial();
    }

    function mostrarBadgeUsuario(nombre) {
        if (nombreUsuarioBadge && indicadorUsuarioFlotante) {
            nombreUsuarioBadge.textContent = nombre;
            indicadorUsuarioFlotante.classList.remove("oculto");
        }
        const badgeCompuestos = document.getElementById("nombre-usuario-badge-compuestos");
        const indicadorCompuestos = document.getElementById("indicador-usuario-flotante-compuestos");
        if (badgeCompuestos && indicadorCompuestos) {
            badgeCompuestos.textContent = nombre;
            indicadorCompuestos.classList.remove("oculto");
        }
    }

    // Botón para cambiar de usuario
    if (btnCambiarUsuario) {
        btnCambiarUsuario.addEventListener("click", () => {
            localStorage.removeItem("ear_training_usuario_id");
            localStorage.removeItem("ear_training_usuario_nombre");
            
            if (vistaJuego) vistaJuego.classList.add("oculto");
            if (vistaIntervalos) vistaIntervalos.classList.add("oculto");
            if (menuNiveles) menuNiveles.classList.add("oculto");
            if (indicadorUsuarioFlotante) indicadorUsuarioFlotante.classList.add("oculto");
            
            if (vistaUsuario) vistaUsuario.classList.remove("oculto");
            if (inputUsuario) inputUsuario.value = "";
        });
    }

    if (btnIngresar) {
        btnIngresar.addEventListener("click", async () => {
            const nombreIngresado = inputUsuario.value.trim().toLowerCase();

            if (!nombreIngresado) {
                mensajeErrorUsuario.textContent = "⚠️ Por favor ingresa un nombre de usuario.";
                mensajeErrorUsuario.classList.remove("oculto");
                return;
            }

            if (nombreIngresado.includes(" ")) {
                mensajeErrorUsuario.textContent = "⚠️ El nombre de usuario no debe contener espacios.";
                mensajeErrorUsuario.classList.remove("oculto");
                return;
            }

            try {
                const respuesta = await fetch("http://localhost:5001/api/usuarios", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nombre: nombreIngresado })
                });

                const resultado = await respuesta.json();

                if (respuesta.ok) {
                    usuarioActualId = resultado.usuario_id;
                    usuarioActualNombre = resultado.nombre;

                    localStorage.setItem("ear_training_usuario_id", usuarioActualId);
                    localStorage.setItem("ear_training_usuario_nombre", usuarioActualNombre);

                    vistaUsuario.classList.add("oculto");
                    menuNiveles.classList.remove("oculto");
                    mostrarBadgeUsuario(usuarioActualNombre);

                    cargarHistorial();
                } else {
                    mensajeErrorUsuario.textContent = `⚠️ ${resultado.error}`;
                    mensajeErrorUsuario.classList.remove("oculto");
                }
            } catch (error) {
                console.error("Error al registrar usuario:", error);
                mensajeErrorUsuario.textContent = "⚠️ Error al conectar con el servidor.";
                mensajeErrorUsuario.classList.remove("oculto");
            }
        });
    }

    // ------------------------------------------------------
    // AUTOCOMPLETADO DE USUARIOS
    // ------------------------------------------------------
    const contenedorSugerencias = document.getElementById("sugerencias-usuarios");
    let listaUsuariosGlobal = [];

    // Función para obtener la lista de usuarios registrados del servidor
    async function cargarUsuariosExistentes() {
        try {
            const respuesta = await fetch("http://localhost:5001/api/usuarios");
            const resultado = await respuesta.json();
            if (respuesta.ok) {
                listaUsuariosGlobal = resultado.usuarios; // [{id, nombre}, ...]
            }
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
        }
    }

    // Cargamos los usuarios al iniciar la vista
    cargarUsuariosExistentes();

    if (inputUsuario) {
        inputUsuario.addEventListener("input", () => {
            const textoEscrito = inputUsuario.value.trim().toLowerCase();
            contenedorSugerencias.innerHTML = "";

            if (textoEscrito.length === 0) {
                contenedorSugerencias.style.display = "none";
                return;
            }

            // Filtrar usuarios que comiencen con el texto escrito
            const filtrados = listaUsuariosGlobal.filter(u => u.nombre.startsWith(textoEscrito));

            if (filtrados.length > 0) {
                contenedorSugerencias.style.display = "block";
                filtrados.forEach(usuario => {
                    const divItem = document.createElement("div");
                    divItem.className = "sugerencia-item";
                    divItem.textContent = usuario.nombre;
                    
                    // Al hacer clic en la sugerencia, se autocompleta el input y se oculta la lista
                    divItem.addEventListener("click", () => {
                        inputUsuario.value = usuario.nombre;
                        contenedorSugerencias.style.display = "none";
                    });

                    contenedorSugerencias.appendChild(divItem);
                });
            } else {
                contenedorSugerencias.style.display = "none";
            }
        });

        // Ocultar sugerencias si se hace clic fuera del input
        document.addEventListener("click", (e) => {
            if (e.target !== inputUsuario && e.target !== contenedorSugerencias) {
                contenedorSugerencias.style.display = "none";
            }
        });
    }

    // ------------------------------------------------------
    // 1. SELECTORES DE VISTAS Y MENÚ PRINCIPAL
    // ------------------------------------------------------
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

    // Botón para escuchar el intervalo
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

    // Selección de notas en la cuadrícula (Limitada estrictamente a 2 notas)
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("boton-nota-intervalo")) {
            if (!notaSeleccionada1 || !notaSeleccionada2) {
                mensajeEstadoIntervalo.textContent = "⚠️ Primero haz clic en 'Escuchar Intervalo'.";
                mensajeEstado.className = "mensaje-error";
                return;
            }

            if (window.usuarioNota1 && window.usuarioNota2) {
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
        if (!usuarioActualId) return;
        try {
            const respuesta = await fetch(`http://localhost:5001/api/puntajes?usuario_id=${usuarioActualId}`);
            const resultado = await respuesta.json();
            
            const listaNivel1 = document.getElementById("lista-historial");
            const listaNivel2 = document.getElementById("lista-historial-intervalos");
            const listaNivel3 = document.getElementById("lista-historial-compuestos");
            
            let contenidoHTML = "";

            if (resultado.puntajes.length === 0) {
                contenidoHTML = "<li style='justify-content: center; color: var(--color-texto-suave);'>No hay puntajes registrados aún para este usuario.</li>";
            } else {
                resultado.puntajes.forEach(item => {
                    const iconoEstado = item.resultado === 'fallo' ? '❌' : '✅';
                    contenidoHTML += `<li><span>${iconoEstado} Nivel: ${item.nivel}</span> <strong>+${item.puntaje} pts</strong> <small>${item.fecha}</small></li>`;
                });
            }

            if (listaNivel1) listaNivel1.innerHTML = contenidoHTML;
            if (listaNivel2) listaNivel2.innerHTML = contenidoHTML;
            if (listaNivel3) listaNivel3.innerHTML = contenidoHTML;

        } catch (error) {
            console.error("Error al cargar el historial:", error);
        }
    }

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
        if (!usuarioActualId) return;
        try {
            await fetch("http://localhost:5001/api/puntajes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    usuario_id: usuarioActualId,
                    puntaje: puntosGanados, 
                    nivel: nivelActual 
                })
            });
            cargarHistorial();
        } catch (error) {
            console.error("Error al guardar puntaje:", error);
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
            } else if (tipoNivel === "intervalos-compuestos") {
                nivelActual = "Intervalos Compuestos";
                vistaCompuestos.classList.remove("oculto");
                mensajeEstadoCompuestos.textContent = "Haz clic en 'Escuchar Intervalo Compuesto' para comenzar.";
                mensajeEstadoCompuestos.className = "mensaje-neutro";
            }
        });
    });

    if (botonVolverCompuestos) {
        botonVolverCompuestos.addEventListener("click", () => {
            vistaCompuestos.classList.add("oculto");
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
    // ------------------------------------------------------
    // 7. LÓGICA DEL NIVEL 3: INTERVALOS COMPUESTOS (> 12 semitones)
    // ------------------------------------------------------
    const gridNotasCompuestos = document.getElementById("grid-notas-compuestos");
    const botonRetoCompuestos = document.getElementById("boton-reto-compuestos");
    const mensajeEstadoCompuestos = document.getElementById("mensaje-estado-compuestos");
    const panelOpcionesCompuestos = document.getElementById("panel-opciones-compuestos");
    const spanPuntajeCompuestos = document.querySelector("#marcador-puntaje-compuestos span");
    const btnDeseleccionarCompuestos = document.getElementById("btn-deseleccionar-compuestos");
    const botonesOpcionCompuesto = document.querySelectorAll(".btn-opcion-compuesto");

    let notaCompuesta1 = null;
    let notaCompuesta2 = null;
    let puntajeCompuestosTotal = 0;

    function inicializarBotonesCompuestos() {
        if (!gridNotasCompuestos) return;
        gridNotasCompuestos.innerHTML = "";
        bancoNotas24.forEach((nota, index) => {
            const boton = document.createElement("button");
            boton.className = "boton-nota-compuesto";
            boton.textContent = nota.nombre;
            boton.setAttribute("data-index", index);
            boton.setAttribute("data-frecuencia", nota.frecuencia);
            gridNotasCompuestos.appendChild(boton);
        });
    }

    inicializarBotonesCompuestos();

    if (botonRetoCompuestos) {
        botonRetoCompuestos.addEventListener("click", () => {
            // Generar intervalo compuesto (distancia entre 13 y 24 semitones)
            const index1 = Math.floor(Math.random() * 10); // Notas más graves para permitir el salto
            const semitonosCompuestos = Math.floor(Math.random() * 12) + 13; // Entre 13 y 24
            let index2 = index1 + semitonosCompuestos;
            if (index2 >= bancoNotas24.length) index2 = bancoNotas24.length - 1;

            notaCompuesta1 = bancoNotas24[index1];
            notaCompuesta2 = bancoNotas24[index2];

            mensajeEstadoCompuestos.textContent = "🔊 Reproduciendo intervalo compuesto... Selecciona las dos notas.";
            mensajeEstadoCompuestos.className = "mensaje-neutro";

            reproducirSecuenciaIntervalo(notaCompuesta1.frecuencia, notaCompuesta2.frecuencia);
        });
    }

    // Selección en cuadrícula de Nivel 3
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("boton-nota-compuesto")) {
            if (!notaCompuesta1 || !notaCompuesta2) {
                mensajeEstadoCompuestos.textContent = "⚠️ Primero haz clic en 'Escuchar Intervalo Compuesto'.";
                return;
            }

            if (window.compuestoNota1 && window.compuestoNota2) return;

            const freqBoton = parseFloat(e.target.getAttribute("data-frecuencia"));
            const nombreBoton = e.target.textContent;

            reproducirTono(freqBoton);
            e.target.classList.add("seleccionada");

            if (!window.compuestoNota1) {
                window.compuestoNota1 = { nombre: nombreBoton, frecuencia: freqBoton };
                mensajeEstadoCompuestos.textContent = `Nota 1: ${nombreBoton}. Selecciona la segunda nota.`;
                btnDeseleccionarCompuestos.classList.remove("oculto");
            } else if (!window.compuestoNota2 && window.compuestoNota1.nombre !== nombreBoton) {
                window.compuestaNota2 = { nombre: nombreBoton, frecuencia: freqBoton };
                mensajeEstadoCompuestos.textContent = `Seleccionaste: ${window.compuestoNota1.nombre} y ${window.compuestaNota2.nombre}. ¿Qué intervalo es?`;
                panelOpcionesCompuestos.classList.remove("oculto");
            }
        }
    });

    if (btnDeseleccionarCompuestos) {
        btnDeseleccionarCompuestos.addEventListener("click", () => {
            window.compuestoNota1 = null;
            window.compuestaNota2 = null;
            document.querySelectorAll(".boton-nota-compuesto").forEach(b => b.classList.remove("seleccionada"));
            panelOpcionesCompuestos.classList.add("oculto");
            btnDeseleccionarCompuestos.classList.add("oculto");
            mensajeEstadoCompuestos.textContent = "Selección borrada. Vuelve a elegir las dos notas.";
        });
    }

    botonesOpcionCompuesto.forEach(btnOpcion => {
        btnOpcion.addEventListener("click", async () => {
            const semitonosElegidos = parseInt(btnOpcion.getAttribute("data-intervalo"));
            const idx1 = bancoNotas24.findIndex(n => n.frecuencia === notaCompuesta1.frecuencia);
            const idx2 = bancoNotas24.findIndex(n => n.frecuencia === window.compuestaNota2.frecuencia);
            const semitonosReales = Math.abs(idx1 - idx2);

            if (semitonosElegidos === semitonosReales) {
                mensajeEstadoCompuestos.textContent = `🎉 ¡Correcto! Es un intervalo compuesto exacto. (+20 pts)`;
                mensajeEstadoCompuestos.className = "mensaje-exito";
                puntajeCompuestosTotal += 20;
                spanPuntajeCompuestos.textContent = puntajeCompuestosTotal;
                await guardarPuntajeConResultado(20, 'acierto');
            } else {
                mensajeEstadoCompuestos.textContent = `❌ Fallaste. Era otro intervalo compuesto. (0 pts)`;
                mensajeEstadoCompuestos.className = "mensaje-error";
                // Ya no restamos puntos, solo registramos el fallo
                await guardarPuntajeConResultado(0, 'fallo');
            }

            notaCompuesta1 = null;
            notaCompuesta2 = null;
            window.compuestoNota1 = null;
            window.compuestaNota2 = null;
            document.querySelectorAll(".boton-nota-compuesto").forEach(b => b.classList.remove("seleccionada"));
            panelOpcionesCompuestos.classList.add("oculto");
            btnDeseleccionarCompuestos.classList.add("oculto");
        });
    });

    async function guardarPuntajeConResultado(puntos, resultado) {
        if (!usuarioActualId) return;
        try {
            await fetch("http://localhost:5001/api/puntajes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    usuario_id: usuarioActualId,
                    puntaje: puntos, 
                    nivel: nivelActual,
                    resultado: resultado 
                })
            });
            cargarHistorial();
        } catch (error) {
            console.error("Error al registrar puntaje y resultado:", error);
        }
    }
});