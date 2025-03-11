#!/bin/bash

# Variable pour le nombre maximal de tentatives
max_attempts=30
attempts=0

echo "Waiting for MySQL to be ready..."

# Boucle jusqu'à ce que MySQL soit disponible ou que le nombre maximal de tentatives soit atteint
while ! python -c "import MySQLdb; MySQLdb.connect(host='db', user='root', passwd='', db='django_api_db', port=3306)" 2>/dev/null; do
    attempts=$((attempts+1))
    if [ $attempts -eq $max_attempts ]; then
        echo "MySQL not available after $max_attempts attempts, giving up"
        exit 1
    fi
    echo "MySQL not ready yet (attempt $attempts/$max_attempts)... waiting 1 second..."
    sleep 1
done

echo "MySQL is ready! Starting Django application..."

# Exécute la commande passée en arguments
exec "$@"