
FROM ubuntu:14.04.2

# Install Calibre
RUN apt-get update
RUN apt-get install -y python wget gcc xz-utils imagemagick xdg-utils build-essential curl git-core
RUN wget -nv -O- https://raw.githubusercontent.com/kovidgoyal/calibre/master/setup/linux-installer.py | python -c "import sys; main=lambda:sys.stderr.write('Download failed\n'); exec(sys.stdin.read()); main()"

# Install NodeJS
RUN curl -fsSL https://deb.nodesource.com/setup_14.x | sudo bash -
RUN apt install -y nodejs

# Run Kindlefy
COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["sh", "/entrypoint.sh"]
