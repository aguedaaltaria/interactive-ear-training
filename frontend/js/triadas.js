document.addEventListener("DOMContentLoaded", () => {
    const gridNotasTriadas = document.getElementById("grid-notas-triadas");
    const botonRetoTriadas = document.getElementById("boton-reto-triadas");
    const mensajeEstadoTriadas = document.getElementById("mensaje-estado-triadas");
    const spanPuntajeTriadas = document.querySelector("#marcador-puntaje-triadas span");
    const btnDeseleccionarTriadas = document.getElementById("btn-deseleccionar-triadas");
    const botonesCualidad = document.querySelectorAll(".btn-cualidad");
    const botonVolverTriadas = document.getElementById("btn-volver-triadas");
    const menuNiveles = document.getElementById("menu-niveles");
    const vistaTriadas = document.getElementById("vista-triadas");

    let notasAcordeSecreto = [];
    let cualidadSecreta = null;
    let notasUsuarioTriadas = [];
    let cualidadUsuarioSeleccionada = null;
    let puntajeTriadasTotal = 0;

    if (botonVolverTriadas) {
        botonVolverTriadas.addEventListener("click", () => {
            if (vistaTriadas) vistaTriadas.classList.add("oculto");
            if (menuNiveles) menuNiveles.classList.remove("oculto");
        });
    }

    function inicializarBotonesTriadas() {
        if (!gridNotasTriadas) return;
        gridNotasTriadas.innerHTML = "";
        window.bancoNotas24.forEach((nota, index) => {
            const boton = document.createElement("button");
            boton.className = "boton-nota-triada";
            boton.textContent = nota.nombre;
            boton.setAttribute("data-index", index);
            boton.setAttribute("data-frecuencia", nota.frecuencia);
            gridNotasTriadas.appendChild(boton);
        });
    }
    inicializarBotonesTriadas();

    if (botonRetoTriadas) {
        botonRetoTriadas.addEventListener("click", () => {
            if (notasAcordeSecreto.length === 0) {
                const indexRaiz = Math.floor(Math.random() * 18);
                const cualidades = [
                    { nombre: "mayor", semitonos3: 4, semitonos5: 7 },
                    { nombre: "menor", semitonos3: 3, semitonos5: 7 },
                    { nombre: "disminuida", semitonos3: 3, semitonos5: 6 },
                    { nombre: "aumentada", semitonos3: 4, semitonos5: 8 }
                ];
                const cualidadObj = cualidades[Math.floor(Math.random() * cualidades.length)];
                cualidadSecreta = cualidadObj.nombre;

                const idx1 = indexRaiz;
                const idx2 = indexRaiz + cualidadObj.semitonos3;
                const idx3 = indexRaiz + cualidadObj.semitonos5;

                notasAcordeSecreto = [
                    window.bancoNotas24[idx1],
                    window.bancoNotas24[idx2],
                    window.bancoNotas24[idx3]
                ];

                notasUsuarioTriadas = [];
                cualidadUsuarioSeleccionada = null;
                document.querySelectorAll(".boton-nota-triada").forEach(b => b.classList.remove("seleccionada"));
                botonesCualidad.forEach(b => b.classList.remove("seleccionada"));
                if (btnDeseleccionarTriadas) btnDeseleccionarTriadas.classList.add("oculto");
            }

            mensajeEstadoTriadas.textContent = "🔊 Reproduciendo acorde con notas largas y acorde conjunto...";
            mensajeEstadoTriadas.className = "mensaje-neutro";

            window.reproducirSecuenciaAcorde(notasAcordeSecreto.map(n => n.frecuencia));
        });
    }

    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("boton-nota-triada")) {
            if (notasAcordeSecreto.length === 0) {
                mensajeEstadoTriadas.textContent = "⚠️ Primero haz clic en 'Escuchar Acorde'.";
                return;
            }
            if (notasUsuarioTriadas.length >= 3) return;

            const freqBoton = parseFloat(e.target.getAttribute("data-frecuencia"));
            const nombreBoton = e.target.textContent;

            window.reproducirTono(freqBoton);
            e.target.classList.add("seleccionada");
            if (btnDeseleccionarTriadas) btnDeseleccionarTriadas.classList.remove("oculto");

            notasUsuarioTriadas.push({ nombre: nombreBoton, frecuencia: freqBoton });
            mensajeEstadoTriadas.textContent = `Notas seleccionadas (${notasUsuarioTriadas.length}/3). Elige las que faltan y la cualidad.`;

            if (notasUsuarioTriadas.length === 3 && cualidadUsuarioSeleccionada) {
                validarResultadoTriada();
            }
        }
    });

    botonesCualidad.forEach(btnCualidad => {
        btnCualidad.addEventListener("click", () => {
            if (notasAcordeSecreto.length === 0) {
                mensajeEstadoTriadas.textContent = "⚠️ Primero haz clic en 'Escuchar Acorde'.";
                return;
            }
            botonesCualidad.forEach(b => b.classList.remove("seleccionada"));
            btnCualidad.classList.add("seleccionada");
            cualidadUsuarioSeleccionada = btnCualidad.getAttribute("data-cualidad");

            if (notasUsuarioTriadas.length === 3 && cualidadUsuarioSeleccionada) {
                validarResultadoTriada();
            }
        });
    });

    if (btnDeseleccionarTriadas) {
        btnDeseleccionarTriadas.addEventListener("click", () => {
            notasUsuarioTriadas = [];
            cualidadUsuarioSeleccionada = null;
            document.querySelectorAll(".boton-nota-triada").forEach(b => b.classList.remove("seleccionada"));
            botonesCualidad.forEach(b => b.classList.remove("seleccionada"));
            btnDeseleccionarTriadas.classList.add("oculto");
            mensajeEstadoTriadas.textContent = "Selección borrada. Vuelve a elegir las 3 notas y la cualidad.";
        });
    }

    async function validarResultadoTriada() {
        const notasSecretasFreqs = notasAcordeSecreto.map(n => n.frecuencia).sort((a,b)=>a-b);
        const notasUsuarioFreqs = notasUsuarioTriadas.map(n => n.frecuencia).sort((a,b)=>a-b);

        const notasIguales = notasSecretasFreqs.every((f, i) => Math.abs(f - notasUsuarioFreqs[i]) < 0.1);
        const cualidadIgual = cualidadUsuarioSeleccionada === cualidadSecreta;

        if (notasIguales && cualidadIgual) {
            mensajeEstadoTriadas.textContent = `🎉 ¡Correcto! Acorde ${cualidadSecreta} identificado. (+30 pts)`;
            mensajeEstadoTriadas.className = "mensaje-exito";
            puntajeTriadasTotal += 30;
            if (spanPuntajeTriadas) spanPuntajeTriadas.textContent = puntajeTriadasTotal;
            await window.guardarPuntajeGenerico(30, "Tríadas Simples", "acierto");
        } else {
            mensajeEstadoTriadas.textContent = `❌ Fallaste. Era acorde ${cualidadSecreta}. (0 pts)`;
            mensajeEstadoTriadas.className = "mensaje-error";
            await window.guardarPuntajeGenerico(0, "Tríadas Simples", "fallo");
        }

        notasAcordeSecreto = [];
        notasUsuarioTriadas = [];
        cualidadUsuarioSeleccionada = null;
        document.querySelectorAll(".boton-nota-triada").forEach(b => b.classList.remove("seleccionada"));
        botonesCualidad.forEach(b => b.classList.remove("seleccionada"));
        if (btnDeseleccionarTriadas) btnDeseleccionarTriadas.classList.add("oculto");
    }
});