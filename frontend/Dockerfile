# ── Stage unique : Nginx sert les fichiers statiques ──
FROM nginx:1.25-alpine

# Supprime la config par défaut
RUN rm /etc/nginx/conf.d/default.conf

# Config Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/emojihub.conf

# Fichiers statiques
COPY index.html /usr/share/nginx/html/index.html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]