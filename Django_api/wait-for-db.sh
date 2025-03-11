#!/bin/bash

# Variable pour le nombre maximal de tentatives
max_attempts=60  # Augmenté à 60 secondes
attempts=0

echo "Waiting for MySQL to be ready..."

# Attendre que le serveur MySQL soit prêt
while ! mysqladmin ping -h db -u root --silent; do
    attempts=$((attempts+1))
    if [ $attempts -eq $max_attempts ]; then
        echo "MySQL not available after $max_attempts attempts, giving up"
        exit 1
    fi
    echo "MySQL not ready yet (attempt $attempts/$max_attempts)... waiting 1 second..."
    sleep 1
done

echo "MySQL server is up!"

# Maintenant, attendez que la base de données soit créée et accessible
attempts=0
while ! mysql -h db -u root -e "USE django_api_db;" 2>/dev/null; do
    attempts=$((attempts+1))
    if [ $attempts -eq $max_attempts ]; then
        echo "Database django_api_db not available after $max_attempts attempts, creating it now"
        mysql -h db -u root -e "CREATE DATABASE IF NOT EXISTS django_api_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
        break
    fi
    echo "Database django_api_db not ready yet (attempt $attempts/$max_attempts)... waiting 1 second..."
    sleep 1
done

echo "MySQL is ready! Starting Django application..."

# Exécute la commande passée en arguments
exec "$@"