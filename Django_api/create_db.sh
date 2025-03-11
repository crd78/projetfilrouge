#!/bin/bash
set -e

echo "Arrêt des conteneurs existants..."
docker-compose down

echo "Suppression des volumes persistants..."
docker volume rm django_api_mysql_data || true

echo "Reconstruction des images..."
docker-compose build --no-cache

echo "Démarrage du service de configuration de la base de données..."
docker-compose up -d db
sleep 5  # Donner le temps à MySQL de démarrer

echo "Configuration de la base de données..."
docker-compose run --rm db-setup

echo "Démarrage de tous les services..."
docker-compose up -d

echo "Configuration terminée! Les services sont maintenant disponibles:"
echo "- API Django: http://localhost:8000"
echo "- phpMyAdmin: http://localhost:8081 (serveur: db, utilisateur: root, pas de mot de passe)"