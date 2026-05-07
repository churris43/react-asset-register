FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install --save-dev @types/node

COPY . .
RUN cd src/ && npx prisma generate

EXPOSE 3000

RUN npm run build
CMD ["npm", "run", "start"]