FROM node:25-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install --save-dev @types/node

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
