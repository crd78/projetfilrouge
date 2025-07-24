# Étape 1 : build de l'app
FROM node:18-alpine AS build

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Étape 2 : server avec nginx
FROM nginx:alpine

# Copier le build dans le dossier nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copier la config nginx par défaut
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
