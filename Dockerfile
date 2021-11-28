FROM node:14.17

# Install Calibre
RUN apt-get update
RUN apt-get install -y python wget gcc xz-utils imagemagick xdg-utils build-essential curl git-core dbus fcitx-rime fonts-wqy-microhei jq  libnss3 libqpdf21 libxkbcommon-x11-0 libxcb-icccm4 libxcb-image0 libxcb-keysyms1 libxcb-randr0 libxcb-render-util0 libxcb-xinerama0 ttf-wqy-zenhei xz-utils
RUN wget -nv -O- https://raw.githubusercontent.com/kovidgoyal/calibre/master/setup/linux-installer.py | python -c "import sys; main=lambda:sys.stderr.write('Download failed\n'); exec(sys.stdin.read()); main()"

# Run Kindlefy
COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["sh", "/entrypoint.sh"]
