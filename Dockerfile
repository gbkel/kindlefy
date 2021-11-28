FROM node:14.17

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY ./package.json /usr/src/app
COPY ./package-lock.json /usr/src/app

# Install Calibre
RUN apt-get update
RUN apt-get install -y python wget gcc xz-utils imagemagick xdg-utils build-essential curl git-core
RUN wget -nv -O- https://raw.githubusercontent.com/kovidgoyal/calibre/master/setup/linux-installer.py | python -c "import sys; main=lambda:sys.stderr.write('Download failed\n'); exec(sys.stdin.read()); main()"

RUN npm ci

COPY . /usr/src/app

RUN npm run build

ENV NODE_ENV production

CMD [ "npm", "run", "start" ]
