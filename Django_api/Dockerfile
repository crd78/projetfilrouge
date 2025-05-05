FROM python:3.10

RUN apt-get update && apt-get install -y default-mysql-client

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

EXPOSE 8000
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "django_project.wsgi:application"]