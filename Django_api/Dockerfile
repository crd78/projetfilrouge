FROM python:3.10

RUN apt-get update && apt-get install -y default-mysql-client dos2unix

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

# Convertir les scripts en format Unix et les rendre exécutables
RUN dos2unix wait-for-db.sh && chmod +x wait-for-db.sh

EXPOSE 8000
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "django_project.wsgi:application"]