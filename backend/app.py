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


@app.route('/api/usuarios', methods=['GET'])
def listar_usuarios():
    conexion = obtener_conexion()
    cursor = conexion.cursor()
    cursor.execute('SELECT id, nombre FROM usuarios ORDER BY nombre ASC')
    usuarios = [dict(fila) for fila in cursor.fetchall()]
    conexion.close()
    return jsonify({'usuarios': usuarios}), 200

@app.route('/api/usuarios', methods=['POST'])
def registrar_usuario():
    datos = request.get_json()
    if not datos or 'nombre' not in datos:
        return jsonify({'error': 'Falta el nombre de usuario'}), 400
    
    nombre = datos['nombre'].strip().lower()
    
    if ' ' in nombre:
        return jsonify({'error': 'El nombre de usuario no debe contener espacios'}), 400

    conexion = obtener_conexion()
    cursor = conexion.cursor()
    
    try:
        # Intentar insertar el nuevo usuario
        cursor.execute('INSERT INTO usuarios (nombre) VALUES (?)', (nombre,))
        conexion.commit()
        usuario_id = cursor.lastrowid
    except sqlite3.IntegrityError:
        # Si ya existe, lo recuperamos
        cursor.execute('SELECT id FROM usuarios WHERE nombre = ?', (nombre,))
        usuario_id = cursor.fetchone()['id']
    
    conexion.close()
    return jsonify({'mensaje': 'Usuario listo', 'usuario_id': usuario_id, 'nombre': nombre}), 200

@app.route('/api/puntajes', methods=['GET'])
def listar_puntajes():
    usuario_id = request.args.get('usuario_id')
    conexion = obtener_conexion()
    cursor = conexion.cursor()
    
    if usuario_id:
        cursor.execute('SELECT id, nivel, puntaje, fecha FROM puntajes WHERE usuario_id = ? ORDER BY fecha DESC LIMIT 20', (usuario_id,))
    else:
        cursor.execute('SELECT id, nivel, puntaje, fecha FROM puntajes ORDER BY fecha DESC LIMIT 20')
        
    filas = cursor.fetchall()
    conexion.close()
    return jsonify({'puntajes': [dict(f) for f in filas]}), 200

@app.route('/api/puntajes', methods=['POST'])
def guardar_puntaje():
    datos = request.get_json()
    if not datos or 'puntaje' not in datos or 'usuario_id' not in datos:
        return jsonify({'error': 'Faltan campos obligatorios'}), 400

    usuario_id = int(datos['usuario_id'])
    puntaje = int(datos['puntaje'])
    nivel = datos.get('nivel', 'Notas Cromáticas')
    resultado = datos.get('resultado', 'acierto')

    conexion = obtener_conexion()
    cursor = conexion.cursor()
    cursor.execute('INSERT INTO puntajes (usuario_id, nivel, puntaje, resultado) VALUES (?, ?, ?, ?)', (usuario_id, nivel, puntaje, resultado))
    conexion.commit()
    nuevo_id = cursor.lastrowid
    conexion.close()

    return jsonify({'mensaje': 'Registro guardado', 'id': nuevo_id, 'nivel': nivel, 'puntaje': puntaje, 'resultado': resultado}), 201


@app.route('/api/estadisticas/<int:usuario_id>', methods=['GET'])
def obtener_estadisticas(usuario_id):
    conexion = obtener_conexion()
    cursor = conexion.cursor()

    # 1. Puntaje Global Histórico (Suma total de todos los puntos)
    cursor.execute('SELECT SUM(puntaje) as total_puntos FROM puntajes WHERE usuario_id = ?', (usuario_id,))
    resultado_puntos = cursor.fetchone()
    total_puntos = resultado_puntos['total_puntos'] if resultado_puntos['total_puntos'] else 0

    # 2. Tasa de Precisión y Total de Fallos
    cursor.execute('''
        SELECT 
            COUNT(*) as total_jugadas, 
            SUM(CASE WHEN resultado = 'acierto' THEN 1 ELSE 0 END) as total_aciertos 
        FROM puntajes 
        WHERE usuario_id = ?
    ''', (usuario_id,))
    resultado_precision = cursor.fetchone()
    total_jugadas = resultado_precision['total_jugadas'] or 0
    total_aciertos = resultado_precision['total_aciertos'] or 0
    
    # Restamos para obtener los fallos exactos
    total_fallos = total_jugadas - total_aciertos
    
    tasa_precision = 0
    if total_jugadas > 0:
        tasa_precision = round((total_aciertos / total_jugadas) * 100)

    # 3. Nivel Más Jugado
    cursor.execute('''
        SELECT nivel, COUNT(*) as cantidad 
        FROM puntajes 
        WHERE usuario_id = ? 
        GROUP BY nivel 
        ORDER BY cantidad DESC 
        LIMIT 1
    ''', (usuario_id,))
    resultado_nivel = cursor.fetchone()
    nivel_favorito = resultado_nivel['nivel'] if resultado_nivel else "Aún no hay datos"

    # 4. Racha de Aciertos Actual
    cursor.execute('''
        SELECT resultado 
        FROM puntajes 
        WHERE usuario_id = ? 
        ORDER BY fecha DESC, id DESC
    ''', (usuario_id,))
    historial_resultados = cursor.fetchall()
    
    racha_actual = 0
    for fila in historial_resultados:
        if fila['resultado'] == 'acierto':
            racha_actual += 1
        else:
            break # Si encontramos un fallo, la racha se rompe

    conexion.close()

    return jsonify({
        'total_puntos': total_puntos,
        'tasa_precision': f"{tasa_precision}%",
        'total_fallos': total_fallos,
        'nivel_favorito': nivel_favorito,
        'racha_actual': racha_actual
    }), 200



if __name__ == '__main__':
  # Como Flask corre en el puerto 5001, abrimos directamente esa dirección
  def abrir_navegador():
    webbrowser.open("http://localhost:5001/")

  Timer(1, abrir_navegador).start()

  print('\n🔗 Servidor unificado activo en: http://localhost:5001\n')
  app.run(host='0.0.0.0', port=5001, debug=True)