import MySQLdb
import time
import os

def recreate_database():
    max_attempts = 30
    attempts = 0
    db_name = "django_api_db"
    
    print("Tentative de connexion à MySQL...")
    while attempts < max_attempts:
        try:
            # Connexion au serveur MySQL
            conn = MySQLdb.connect(
                host="db",
                user="root",
                passwd="",
                port=3306  # Port à l'intérieur du conteneur
            )
            cursor = conn.cursor()
            
            # Vérifier si la base de données existe déjà
            cursor.execute("SHOW DATABASES LIKE %s", (db_name,))
            result = cursor.fetchone()
            
            if result:
                print(f"La base de données '{db_name}' existe déjà. Aucune action nécessaire.")
            else:
                # Créer la base de données seulement si elle n'existe pas
                cursor.execute(f"CREATE DATABASE {db_name} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
                print(f"Base de données '{db_name}' créée avec succès")
            
            # Fermer la connexion
            cursor.close()
            conn.close()
            
            print("Configuration de la base de données terminée avec succès")
            return True
        except Exception as e:
            attempts += 1
            if attempts >= max_attempts:
                print(f"Échec de connexion après {max_attempts} tentatives: {str(e)}")
                return False
            print(f"Connexion échouée (tentative {attempts}/{max_attempts}). Attente de 1 seconde...")
            time.sleep(1)

if __name__ == "__main__":
    recreate_database()