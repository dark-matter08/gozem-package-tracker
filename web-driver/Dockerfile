FROM node:21-alpine3.18

WORKDIR /app

COPY package*.json ./

RUN npm install -g @angular/cli

RUN npm install

COPY . .

EXPOSE 4201

CMD ["ng", "serve", "--host", "0.0.0.0", "--port" "4201"]