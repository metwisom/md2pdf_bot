FROM ubuntu

ENV TZ="Europe/Moscow"

WORKDIR /app

COPY package.json tsconfig.json .env /app/
COPY src/ /app/src/

RUN apt update
RUN apt install -y nodejs
RUN apt install -y npm
RUN apt install -y pandoc
RUN apt install -y texlive-xetex
RUN apt install -y librsvg2-bin
RUN apt install -y inkscape
RUN apt install -y librsvg2-bin
RUN npm i
RUN  npm tsc

CMD node --env-file=.env dist/main.js
#CMD ls -la
