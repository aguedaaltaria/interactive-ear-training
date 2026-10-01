import sqlite3
import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
RUTA_DB = os.path.join(BASE_DIR, 'ear_training.db')

def inicializar_base_datos():
    conexion = sqlite3.connect(RUTA_DB)
    cursor = conexion.cursor()
    
    # Tabla de usuarios con nombre único
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT UNIQUE NOT NULL
        )
    ''')
    
    # Tabla de puntajes vinculada al usuario
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS puntajes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER,
            nivel TEXT NOT NULL,
            puntaje INTEGER NOT NULL,
            fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
        )
    ''')
    
    conexion.commit()
    conexion.close()