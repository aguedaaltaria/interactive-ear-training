document.addEventListener("DOMContentLoaded", () => {
    const botonesSeleccionNivel = document.querySelectorAll(".boton-nivel:not(.bloqueado)");
    const menuNiveles = document.getElementById("menu-niveles");
    const vistaJuego = document.getElementById("vista-juego");
    const vistaIntervalos = document.getElementById("vista-intervalos");
    const vistaCompuestos = document.getElementById("vista-intervalos-compuestos");
    const botonVolverJuego = document.getElementById("btn-volver");
    const botonVolverIntervalos = document.getElementById("btn-volver-intervalos");
    const botonVolverCompuestos = document.getElementById("btn-volver-compuestos");
    const botonVolverTriadas = document.getElementById("btn-volver-triadas");
    const vistaTriadas = document.getElementById("vista-triadas");

    let nivelActual = "Notas Cromáticas";

    botonesSeleccionNivel.forEach(boton => {
        boton.addEventListener("click", () => {
            const tipoNivel = boton.getAttribute("data-nivel");
            menuNiveles.classList.add("oculto");

            if (tipoNivel === "notas-cromaticas") {
                nivelActual = "Notas Cromáticas";
                vistaJuego.classList.remove("oculto");
            } else if (tipoNivel === "intervalos-simples") {
                nivelActual = "Intervalos Simples";
                vistaIntervalos.classList.remove("oculto");
            } else if (tipoNivel === "intervalos-compuestos") {
                nivelActual = "Intervalos Compuestos";
                vistaCompuestos.classList.remove("oculto");
            } else if (tipoNivel === "triadas-simples") {
                nivelActual = "Tríadas Simples";
                const vistaTriadas = document.getElementById("vista-triadas");
                if (vistaTriadas) vistaTriadas.classList.remove("oculto");
            }
        });
    });

    if (botonVolverJuego) {
        botonVolverJuego.addEventListener("click", () => {
            vistaJuego.classList.add("oculto");
            menuNiveles.classList.remove("oculto");
        });
    }

    if (botonVolverIntervalos) {
        botonVolverIntervalos.addEventListener("click", () => {
            vistaIntervalos.classList.add("oculto");
            menuNiveles.classList.remove("oculto");
        });
    }

    if (botonVolverCompuestos) {
        botonVolverCompuestos.addEventListener("click", () => {
            if (vistaCompuestos) vistaCompuestos.classList.add("oculto");
            if (menuNiveles) menuNiveles.classList.remove("oculto");
        });
    }

    if (botonVolverTriadas) {
        botonVolverTriadas.addEventListener("click", () => {
            if (vistaTriadas) vistaTriadas.classList.add("oculto");
            if (menuNiveles) menuNiveles.classList.remove("oculto");
        });
    }

    // Nivel 1: Notas Cromáticas
    const botonesNotas = document.querySelectorAll(".contenedor-botones .boton-nota");
    const botonReto = document.getElementById("boton-reto");
    const mensajeEstado = document.getElementById("mensaje-estado");
    const spanPuntajeTotal = document.querySelector("#marcador-puntaje span");
    const bancoNotas = [
        { nombre: "Do", frecuencia: 261.63 }, { nombre: "Do# / Reb", frecuencia: 277.18 },
        { nombre: "Re", frecuencia: 293.66 }, { nombre: "Re# / Mib", frecuencia: 311.13 },
        { nombre: "Mi", frecuencia: 329.63 }, { nombre: "Fa", frecuencia: 349.23 },
        { nombre: "Fa# / Solb", frecuencia: 369.99 }, { nombre: "Sol", frecuencia: 392.00 },
        { nombre: "Sol# / Lab", frecuencia: 415.30 }, { nombre: "La", frecuencia: 440.00 },
        { nombre: "La# / Sib", frecuencia: 466.16 }, { nombre: "Si", frecuencia: 493.88 }
    ];
    let notaSecreta = null;
    let puntajeTotal = 0;

    if (botonReto) {
        botonReto.addEventListener("click", () => {
            notaSecreta = bancoNotas[Math.floor(Math.random() * bancoNotas.length)];
            mensajeEstado.textContent = "🔊 ¡Nota secreta reproducida! ¿Cuál fue?";
            mensajeEstado.className = "mensaje-neutro";
            window.reproducirTono(notaSecreta.frecuencia);
        });
    }

    botonesNotas.forEach(boton => {
        boton.addEventListener("click", () => {
            if (!notaSecreta) return;
            const notaSeleccionada = boton.getAttribute("data-nota");
            if (notaSeleccionada === notaSecreta.nombre) {
                mensajeEstado.textContent = `🎉 ¡Correcto! Era la nota ${notaSecreta.nombre}. (+10 pts)`;
                mensajeEstado.className = "mensaje-exito";
                puntajeTotal += 10;
                spanPuntajeTotal.textContent = puntajeTotal;
                window.guardarPuntajeGenerico(10, "Notas Cromáticas", "acierto");
            } else {
                mensajeEstado.textContent = `❌ Fallaste. Era la nota ${notaSecreta.nombre}.`;
                mensajeEstado.className = "mensaje-error";
                window.guardarPuntajeGenerico(0, "Notas Cromáticas", "fallo");
            }
        });
    });

    // Nivel 2: Intervalos Simples
    const botonRetoIntervalo = document.getElementById("boton-reto-intervalo");
    const mensajeEstadoIntervalo = document.getElementById("mensaje-estado-intervalo");
    const panelOpcionesIntervalos = document.getElementById("panel-opciones-intervalos");
    const spanPuntajeIntervalos = document.querySelector("#marcador-puntaje-intervalos span");
    const botonesOpcionIntervalo = document.querySelectorAll(".btn-opcion-intervalo");
    const btnDeseleccionar = document.getElementById("btn-deseleccionar");

    let notaSeleccionada1 = null;
    let notaSeleccionada2 = null;
    let intervaloObjetivo = null;
    let puntajeIntervalosTotal = 0;

    if (botonRetoIntervalo) {
        botonRetoIntervalo.addEventListener("click", () => {
            if (!notaSeleccionada1 || !notaSeleccionada2) {
                const index1 = Math.floor(Math.random() * window.bancoNotas24.length);
                intervaloObjetivo = Math.floor(Math.random() * 12) + 1;
                
                let index2 = index1 + intervaloObjetivo;
                if (index2 >= window.bancoNotas24.length) {
                    index2 = index1 - intervaloObjetivo;
                    intervaloObjetivo = Math.abs(index1 - index2);
                }

                notaSeleccionada1 = window.bancoNotas24[index1];
                notaSeleccionada2 = window.bancoNotas24[index2];

                window.usuarioNota1 = null;
                window.usuarioNota2 = null;
                document.querySelectorAll(".boton-nota-intervalo").forEach(b => b.classList.remove("seleccionada"));
                if (panelOpcionesIntervalos) panelOpcionesIntervalos.classList.add("oculto");
                if (btnDeseleccionar) btnDeseleccionar.classList.add("oculto");
            }

            mensajeEstadoIntervalo.textContent = "🔊 Reproduciendo intervalo... Selecciona las dos notas en la cuadrícula.";
            mensajeEstadoIntervalo.className = "mensaje-neutro";

            window.reproducirSecuenciaAcorde([notaSeleccionada1.frecuencia, notaSeleccionada2.frecuencia]);
        });
    }

    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("boton-nota-intervalo")) {
            if (!notaSeleccionada1 || !notaSeleccionada2) {
                mensajeEstadoIntervalo.textContent = "⚠️ Primero haz clic en 'Escuchar Intervalo'.";
                return;
            }

            if (window.usuarioNota1 && window.usuarioNota2) return;

            const freqBoton = parseFloat(e.target.getAttribute("data-frecuencia"));
            const nombreBoton = e.target.textContent;

            window.reproducirTono(freqBoton);
            e.target.classList.add("seleccionada");

            if (!window.usuarioNota1) {
                window.usuarioNota1 = { nombre: nombreBoton, frecuencia: freqBoton };
                mensajeEstadoIntervalo.textContent = `Nota 1: ${nombreBoton}. Selecciona la segunda nota.`;
                if (btnDeseleccionar) btnDeseleccionar.classList.remove("oculto");
            } else if (!window.usuarioNota2 && window.usuarioNota1.nombre !== nombreBoton) {
                window.usuarioNota2 = { nombre: nombreBoton, frecuencia: freqBoton };
                mensajeEstadoIntervalo.textContent = `Seleccionaste: ${window.usuarioNota1.nombre} y ${window.usuarioNota2.nombre}. ¿Qué intervalo es?`;
                if (panelOpcionesIntervalos) panelOpcionesIntervalos.classList.remove("oculto");
            }
        }
    });

    if (btnDeseleccionar) {
        btnDeseleccionar.addEventListener("click", () => {
            window.usuarioNota1 = null;
            window.usuarioNota2 = null;
            document.querySelectorAll(".boton-nota-intervalo").forEach(b => b.classList.remove("seleccionada"));
            if (panelOpcionesIntervalos) panelOpcionesIntervalos.classList.add("oculto");
            if (btnDeseleccionar) btnDeseleccionar.classList.add("oculto");
            mensajeEstadoIntervalo.textContent = "Selección borrada. Vuelve a elegir las dos notas.";
            mensajeEstadoIntervalo.className = "mensaje-neutro";
        });
    }

    botonesOpcionIntervalo.forEach(btnOpcion => {
        btnOpcion.addEventListener("click", async () => {
            if (!notaSeleccionada1 || !window.usuarioNota2) return;
            const semitonosElegidos = parseInt(btnOpcion.getAttribute("data-intervalo"));
            const idx1 = window.bancoNotas24.findIndex(n => n.frecuencia === notaSeleccionada1.frecuencia);
            const idx2 = window.bancoNotas24.findIndex(n => n.frecuencia === window.usuarioNota2.frecuencia);
            const semitonosReales = Math.abs(idx1 - idx2);

            if (semitonosElegidos === semitonosReales) {
                mensajeEstadoIntervalo.textContent = `🎉 ¡Correcto! Es el intervalo correcto. (+15 pts)`;
                mensajeEstadoIntervalo.className = "mensaje-exito";
                puntajeIntervalosTotal += 15;
                if (spanPuntajeIntervalos) spanPuntajeIntervalos.textContent = puntajeIntervalosTotal;
                await window.guardarPuntajeGenerico(15, 'Intervalos Simples', 'acierto');
            } else {
                mensajeEstadoIntervalo.textContent = `❌ Fallaste. Era otro intervalo. (0 pts)`;
                mensajeEstadoIntervalo.className = "mensaje-error";
                await window.guardarPuntajeGenerico(0, 'Intervalos Simples', 'fallo');
            }

            notaSeleccionada1 = null;
            notaSeleccionada2 = null;
            window.usuarioNota1 = null;
            window.usuarioNota2 = null;
            document.querySelectorAll(".boton-nota-intervalo").forEach(b => b.classList.remove("seleccionada"));
            if (panelOpcionesIntervalos) panelOpcionesIntervalos.classList.add("oculto");
            if (btnDeseleccionar) btnDeseleccionar.classList.add("oculto");
        });
    });

    // Nivel 3: Intervalos Compuestos
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

    function inicializarGrid(idGrid, claseBoton) {
        const grid = document.getElementById(idGrid);
        if (!grid) return;
        grid.innerHTML = "";
        window.bancoNotas24.forEach((nota, index) => {
            const boton = document.createElement("button");
            boton.className = claseBoton;
            boton.textContent = nota.nombre;
            boton.setAttribute("data-index", index);
            boton.setAttribute("data-frecuencia", nota.frecuencia);
            grid.appendChild(boton);
        });
    }
    inicializarGrid("grid-notas-intervalos", "boton-nota-intervalo");
    inicializarGrid("grid-notas-compuestos", "boton-nota-compuesto");

    if (botonRetoCompuestos) {
        botonRetoCompuestos.addEventListener("click", () => {
            // Si ya hay un intervalo activo, NO generamos uno nuevo; repetimos el mismo.
            if (!notaCompuesta1 || !notaCompuesta2) {
                const index1 = Math.floor(Math.random() * (window.bancoNotas24.length - 13));
                const semitonosCompuestos = Math.floor(Math.random() * 12) + 13; 
                const index2 = index1 + semitonosCompuestos;
                notaCompuesta1 = window.bancoNotas24[index1];
                notaCompuesta2 = window.bancoNotas24[index2];

                window.compuestoNota1 = null;
                window.compuestaNota2 = null;
                document.querySelectorAll(".boton-nota-compuesto").forEach(b => b.classList.remove("seleccionada"));
                if (panelOpcionesCompuestos) panelOpcionesCompuestos.classList.add("oculto");
                if (btnDeseleccionarCompuestos) btnDeseleccionarCompuestos.classList.add("oculto");
            }

            mensajeEstadoCompuestos.textContent = "🔊 Reproduciendo intervalo compuesto... Selecciona las dos notas.";
            mensajeEstadoCompuestos.className = "mensaje-neutro";

            window.reproducirSecuenciaAcorde([notaCompuesta1.frecuencia, notaCompuesta2.frecuencia]);
        });
    }

    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("boton-nota-compuesto")) {
            if (!notaCompuesta1 || !notaCompuesta2) {
                mensajeEstadoCompuestos.textContent = "⚠️ Primero haz clic en 'Escuchar Intervalo Compuesto'.";
                return;
            }
            if (window.compuestoNota1 && window.compuestaNota2) return;

            const freqBoton = parseFloat(e.target.getAttribute("data-frecuencia"));
            const nombreBoton = e.target.textContent;

            window.reproducirTono(freqBoton);
            e.target.classList.add("seleccionada");

            if (!window.compuestoNota1) {
                window.compuestoNota1 = { nombre: nombreBoton, frecuencia: freqBoton };
                mensajeEstadoCompuestos.textContent = `Nota 1: ${nombreBoton}. Selecciona la segunda nota.`;
                if (btnDeseleccionarCompuestos) btnDeseleccionarCompuestos.classList.remove("oculto");
            } else if (!window.compuestaNota2 && window.compuestoNota1.nombre !== nombreBoton) {
                window.compuestaNota2 = { nombre: nombreBoton, frecuencia: freqBoton };
                mensajeEstadoCompuestos.textContent = `Seleccionaste dos notas. ¿Qué intervalo compuesto es?`;
                if (panelOpcionesCompuestos) panelOpcionesCompuestos.classList.remove("oculto");
            }
        }
    });

    if (btnDeseleccionarCompuestos) {
        btnDeseleccionarCompuestos.addEventListener("click", () => {
            window.compuestoNota1 = null;
            window.compuestaNota2 = null;
            document.querySelectorAll(".boton-nota-compuesto").forEach(b => b.classList.remove("seleccionada"));
            if (panelOpcionesCompuestos) panelOpcionesCompuestos.classList.add("oculto");
            if (btnDeseleccionarCompuestos) btnDeseleccionarCompuestos.classList.add("oculto");
            mensajeEstadoCompuestos.textContent = "Selección borrada. Vuelve a elegir las dos notas.";
        });
    }

    botonesOpcionCompuesto.forEach(btnOpcion => {
        btnOpcion.addEventListener("click", async () => {
            if (!notaCompuesta1 || !window.compuestaNota2) return;
            const semitonosElegidos = parseInt(btnOpcion.getAttribute("data-intervalo"));
            const idx1 = window.bancoNotas24.findIndex(n => n.frecuencia === notaCompuesta1.frecuencia);
            const idx2 = window.bancoNotas24.findIndex(n => n.frecuencia === window.compuestaNota2.frecuencia);
            const semitonosReales = Math.abs(idx1 - idx2);

            if (semitonosElegidos === semitonosReales) {
                mensajeEstadoCompuestos.textContent = `🎉 ¡Correcto! Intervalo compuesto exacto. (+20 pts)`;
                mensajeEstadoCompuestos.className = "mensaje-exito";
                puntajeCompuestosTotal += 20;
                if (spanPuntajeCompuestos) spanPuntajeCompuestos.textContent = puntajeCompuestosTotal;
                await window.guardarPuntajeGenerico(20, 'Intervalos Compuestos', 'acierto');
            } else {
                mensajeEstadoCompuestos.textContent = `❌ Fallaste. Era otro intervalo. (0 pts)`;
                mensajeEstadoCompuestos.className = "mensaje-error";
                await window.guardarPuntajeGenerico(0, 'Intervalos Compuestos', 'fallo');
            }

            notaCompuesta1 = null;
            notaCompuesta2 = null;
            window.compuestoNota1 = null;
            window.compuestaNota2 = null;
            document.querySelectorAll(".boton-nota-compuesto").forEach(b => b.classList.remove("seleccionada"));
            if (panelOpcionesCompuestos) panelOpcionesCompuestos.classList.add("oculto");
            if (btnDeseleccionarCompuestos) btnDeseleccionarCompuestos.classList.add("oculto");
        });
    });
});