# Utiliser une image Python officielle
FROM python:3.10

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de l'application
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier tout le code source
COPY . .

# Exposer le port de Django
EXPOSE 8000

# Commande de démarrage
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "django_project.wsgi:application"]
