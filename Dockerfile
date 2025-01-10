FROM node:20

ENV TZ="Europe/Moscow"

RUN apt update && apt install -yq libgconf-2-4 pandoc texlive-xetex

RUN apt-get update && apt-get install -y wget --no-install-recommends \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-unstable --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get purge --auto-remove -y curl wget \
    && rm -rf /src/*.deb

RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /tmp

ADD puppeteer-config.json  /puppeteer-config.json

USER pptruser

WORKDIR /app

COPY package.json tsconfig.json .env /app/
COPY src/ /app/src/

RUN npm i
RUN npx tsc

CMD node --env-file=.env dist/main.js
