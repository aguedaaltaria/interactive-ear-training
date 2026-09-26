from database import RUTA_DB, inicializar_base_datos
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import sqlite3
import webbrowser
from threading import Timer
import os

# 1. Configuramos Flask para que apunte a la carpeta 'frontend' ubicada un nivel más arriba
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
FRONTEND_DIR = os.path.abspath(os.path.join(BASE_DIR, '../frontend'))

app = Flask(__name__, static_folder=FRONTEND_DIR, template_folder=FRONTEND_DIR)
CORS(app)

inicializar_base_datos()

def obtener_conexion():
  conexion_base_datos = sqlite3.connect(RUTA_DB)
  conexion_base_datos.row_factory = sqlite3.Row
  return conexion_base_datos


# 2. Ruta principal que sirve directamente el index.html del Frontend
@app.route('/', methods=['GET'])
def servir_frontend():
  return send_from_directory(app.static_folder, 'index.html')


# 3. Ruta para servir los archivos estáticos (CSS, JS, etc.)
@app.route('/<path:nombre_archivo>', methods=['GET'])
def servir_archivos_estaticos(nombre_archivo):
  return send_from_directory(app.static_folder, nombre_archivo)


@app.route('/api/health', methods=['GET'])
def health_check():
  return jsonify({'estado': 'activo', 'servicio': 'ear-training-api'}), 200


@app.route('/api/puntajes', methods=['GET'])
def listar_puntajes():
  conexion_base_datos = obtener_conexion()
  cursor = conexion_base_datos.cursor()
  cursor.execute('SELECT id, nivel, puntaje, fecha FROM puntajes ORDER BY fecha DESC LIMIT 20')
  filas_recuperadas = cursor.fetchall()
  conexion_base_datos.close()
  puntajes = [dict(fila) for fila in filas_recuperadas]
  return jsonify({'puntajes': puntajes}), 200


@app.route('/api/puntajes', methods=['POST'])
def guardar_puntaje():
  datos_peticion = request.get_json()

  if not datos_peticion or 'puntaje' not in datos_peticion:
    return jsonify({'error': 'Falta el campo obligatorio (puntaje)'}), 400

  puntaje = int(datos_peticion['puntaje'])
  nivel = datos_peticion.get('nivel', 'Entrenamiento Auditivo')

  conexion_base_datos = obtener_conexion()
  cursor = conexion_base_datos.cursor()
  cursor.execute('INSERT INTO puntajes (nivel, puntaje) VALUES (?, ?)', (nivel, puntaje))
  conexion_base_datos.commit()
  nuevo_id = cursor.lastrowid
  conexion_base_datos.close()

  return jsonify({
      'mensaje': 'Puntaje guardado exitosamente',
      'id': nuevo_id,
      'nivel': nivel,
      'puntaje': puntaje,
  }), 201


if __name__ == '__main__':
  # Como Flask corre en el puerto 5001, abrimos directamente esa dirección
  def abrir_navegador():
    webbrowser.open("http://localhost:5001/")

  Timer(1, abrir_navegador).start()

  print('\n🔗 Servidor unificado activo en: http://localhost:5001\n')
  app.run(host='0.0.0.0', port=5001, debug=True)