FROM node:14.17

RUN mkdir -p /github/workspace

WORKDIR /github/workspace

COPY ./package.json /github/workspace
COPY ./package-lock.json /github/workspace

# Install Calibre
RUN apt-get update
RUN apt-get install -y python wget gcc xz-utils imagemagick xdg-utils build-essential curl git-core
RUN wget -nv -O- https://raw.githubusercontent.com/kovidgoyal/calibre/master/setup/linux-installer.py | python -c "import sys; main=lambda:sys.stderr.write('Download failed\n'); exec(sys.stdin.read()); main()"

RUN npm ci

COPY . /github/workspace

RUN npm run build

ENV NODE_ENV production

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["sh", "/entrypoint.sh"]

