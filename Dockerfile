FROM node:20

ENV TZ="Europe/Moscow"

WORKDIR /app

COPY package.json tsconfig.json .env /app/
COPY src/ /app/src/

RUN apt update
RUN apt install -y pandoc
RUN apt install -y texlive-xetex
RUN npm i
RUN npx tsc

CMD node --env-file=.env dist/main.js
