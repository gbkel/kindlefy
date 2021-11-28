
FROM ubuntu:14.04.2

# Install Calibre
RUN apt-get update
RUN apt-get install -y python wget gcc xz-utils imagemagick xdg-utils build-essential curl git-core
RUN wget -nv -O- https://raw.githubusercontent.com/kovidgoyal/calibre/master/setup/linux-installer.py | python -c "import sys; main=lambda:sys.stderr.write('Download failed\n'); exec(sys.stdin.read()); main()"

# Install NodeJS
ENV USER nodejs
ENV NODE_VERSION 14.17
RUN useradd --create-home --shell /bin/bash $USER
USER $USER
RUN cd \
    && mkdir tools \
    && curl -SLO "http://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.gz" \
    && tar -xzf "node-v$NODE_VERSION-linux-x64.tar.gz" -C /home/$USER/tools/ \
    && rm "node-v$NODE_VERSION-linux-x64.tar.gz"
ENV PATH $PATH:/home/$USER/tools/node-v$NODE_VERSION-linux-x64/bin

# Run Kindlefy
COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["sh", "/entrypoint.sh"]
