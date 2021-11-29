FROM lscr.io/linuxserver/calibre:latest

ENV XDG_RUNTIME_DIR '/tmp/runtime-root'

# Install NodeJS
RUN curl -fsSL https://deb.nodesource.com/setup_14.x | sudo bash -
RUN apt-get install -y --force-yes nodejs

# Run Kindlefy
COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["sh", "/entrypoint.sh"]
