# 🎹 Entrenador Auditivo Interactivo

Una aplicación web *full-stack* diseñada para el entrenamiento auditivo musical progresivo. Desarrollada con un enfoque técnico en la generación de audio nativo y un backend robusto para el seguimiento del aprendizaje del usuario. 

La aplicación abarca desde la identificación de notas cromáticas simples hasta la deconstrucción de acordes avanzados de jazz (novenas y treceavas) utilizando reglas dinámicas de *shell voicings*.

## ✨ Características Principales

* **Motor Acústico Propio:** Utiliza la Web Audio API nativa de JavaScript (ondas senoidales, controles de ganancia y difuminado de volumen) para generar el sonido en tiempo real, sin depender de archivos MP3 externos.
* **Progresión de 8 Niveles:**
  1. Notas Cromáticas
  2. Intervalos Simples
  3. Intervalos Compuestos
  4. Tríadas Simples e Inversiones
  5. Tríadas Suspendidas (Sus2 y Sus4)
  6. Acordes de Séptima (Tétradas)
  7. Acordes de Novena (Generación dinámica con omisión de 5ta)
  8. Acordes de Treceava (Reglas de omisión de jazz para 5ta, 9na y 11va)
* **Gestión de Usuarios y Estadísticas:** Backend integrado con SQLite que permite crear perfiles de usuario, mantener sesiones activas y guardar un historial de aciertos y fallos para alimentar un panel de estadísticas global.
* **Interfaz Dinámica:** Diseño responsivo con ventanas modales, autocompletado de usuarios en tiempo real y retroalimentación visual inmediata.

## 🛠️ Tecnologías Utilizadas

* **Frontend:** HTML5, CSS3 (Variables, Grid/Flexbox), Vanilla JavaScript (Web Audio API).
* **Backend:** Python 3, Flask, flask-cors.
* **Base de Datos:** SQLite.
* **Gestor de Paquetes:** `uv`.

## ⚙️ Instalación y Ejecución local

Sigue estos pasos para correr el proyecto en tu entorno local:

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/aguedaaltaria/interactive-ear-training.git
   cd interactive-ear-training
