import MySQLdb
import time
import os

def recreate_database():
    max_attempts = 30
    attempts = 0
    
    print("Tentative de connexion à MySQL...")
    while attempts < max_attempts:
        try:
            # Connexion au serveur MySQL
            conn = MySQLdb.connect(
                host="db",  # utilisez 'db' comme nom d'hôte dans Docker
                user="root",
                passwd="",
                port=3306
            )
            cursor = conn.cursor()
            
            # Créer une nouvelle base de données
            cursor.execute("CREATE DATABASE IF NOT EXISTS django_api_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
            print("Base de données créée avec succès")
            
            # Fermer la connexion
            cursor.close()
            conn.close()
            
            print("Recréation terminée avec succès")
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