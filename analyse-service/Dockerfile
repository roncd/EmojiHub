FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Pas de port /tourne en fond (cron)
CMD ["node", "src/app.js"]