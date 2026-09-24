from database import RUTA_DB, inicializar_base_datos
from flask import Flask, jsonify, request
import sqlite3

app = Flask(__name__)

# Asegurar que la base de datos existe al arrancar la aplicación
inicializar_base_datos()


def obtener_conexion():
  """Crea y devuelve una conexión explícita a la base de datos SQLite."""
  conexion_base_datos = sqlite3.connect(RUTA_DB)
  conexion_base_datos.row_factory = (
      sqlite3.Row  # Permite acceder a las columnas por su nombre en texto
  )
  return conexion_base_datos


@app.route('/api/health', methods=['GET'])
def health_check():
  """Endpoint de diagnóstico para comprobar que la API está activa."""
  return jsonify({'estado': 'activo', 'servicio': 'ear-training-api'}), 200


@app.route('/api/puntajes', methods=['GET'])
def listar_puntajes():
  """Devuelve los últimos 20 puntajes registrados ordenados por fecha."""
  conexion_base_datos = obtener_conexion()
  cursor = conexion_base_datos.cursor()

  cursor.execute(
      'SELECT id, nivel, puntaje, fecha FROM puntajes ORDER BY fecha DESC LIMIT'
      ' 20'
  )
  filas_recuperadas = cursor.fetchall()
  conexion_base_datos.close()

  # Transformamos las filas de SQLite en diccionarios limpios para JSON
  puntajes = [dict(fila) for fila in filas_recuperadas]
  return jsonify({'puntajes': puntajes}), 200


@app.route('/api/puntajes', methods=['POST'])
def guardar_puntaje():
  """Recibe y guarda un nuevo puntaje en la base de datos SQLite."""
  datos_peticion = request.get_json()

  # Validación explícita de campos obligatorios
  if (
      not datos_peticion
      or 'nivel' not in datos_peticion
      or 'puntaje' not in datos_peticion
  ):
    return (
        jsonify({'error': 'Faltan campos obligatorios (nivel, puntaje)'}),
        400,
    )

  nivel = datos_peticion['nivel']
  puntaje = int(datos_peticion['puntaje'])

  conexion_base_datos = obtener_conexion()
  cursor = conexion_base_datos.cursor()

  # Inserción segura usando parámetros (?, ?) para prevenir inyección SQL
  cursor.execute(
      'INSERT INTO puntajes (nivel, puntaje) VALUES (?, ?)', (nivel, puntaje)
  )
  conexion_base_datos.commit()
  nuevo_id = cursor.lastrowid
  conexion_base_datos.close()

  return (
      jsonify({
          'mensaje': 'Puntaje guardado exitosamente',
          'id': nuevo_id,
          'nivel': nivel,
          'puntaje': puntaje,
      }),
      201,
  )


if __name__ == '__main__':
  app.run(host='0.0.0.0', port=5000, debug=True)