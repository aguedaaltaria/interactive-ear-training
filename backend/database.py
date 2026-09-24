import os
import sqlite3

RUTA_DB = os.path.join(os.path.dirname(__file__), 'database.sqlite')


def inicializar_base_datos():
  """Conecta a sqlite3 y asegura la estructura de persistencia local."""
  connection = sqlite3.connect(RUTA_DB)
  cursor = connection.cursor()

  cursor.execute("""
        CREATE TABLE IF NOT EXISTS puntajes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nivel TEXT NOT NULL,
            puntaje INTEGER NOT NULL,
            fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

  connection.commit()
  connection.close()


if __name__ == '__main__':
  inicializar_base_datos()
  print('Base de datos inicializada correctamente.')