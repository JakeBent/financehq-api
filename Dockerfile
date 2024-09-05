FROM node:alpine as builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npm run build

# Development
FROM builder as development
ENV NODE_ENV=development

EXPOSE 3000

CMD ["npm", "run", "dev"]

# Production
FROM builder as production
ENV NODE_ENV=production

CMD ["npm", "start"]
