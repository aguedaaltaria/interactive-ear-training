import sqlite3
import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
RUTA_DB = os.path.join(BASE_DIR, 'ear_training.db')

def obtener_conexion():
    conexion = sqlite3.connect(RUTA_DB)
    conexion.row_factory = sqlite3.Row
    return conexion

def inicializar_base_datos():
    conexion = obtener_conexion()
    cursor = conexion.cursor()
    
    # Tabla de usuarios
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT UNIQUE NOT NULL
        )
    ''')
    
    # Tabla de puntajes e intentos
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS puntajes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER,
            nivel TEXT NOT NULL,
            puntaje INTEGER NOT NULL,
            resultado TEXT DEFAULT 'acierto',
            fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
        )
    ''')
    
    # Comprobación de seguridad por si la tabla ya existía sin la columna resultado
    cursor.execute("PRAGMA table_info(puntajes)")
    columnas = [column[1] for column in cursor.fetchall()]
    if 'resultado' not in columnas:
        cursor.execute("ALTER TABLE puntajes ADD COLUMN resultado TEXT DEFAULT 'acierto'")

    conexion.commit()
    conexion.close()

if __name__ == '__main__':
    inicializar_base_datos()