FROM node:25-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--turbo", "-H", "0.0.0.0", "-p", "5173"]