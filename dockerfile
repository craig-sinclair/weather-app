FROM node:latest

WORKDIR /app
RUN npm install -g expo-cli

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8081 8082

CMD ["npx", "expo", "start", "--tunnel"]