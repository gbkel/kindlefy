FROM node:14.17

# Install Calibre
RUN apt-get update
RUN apt-get install -y sudo python wget gcc xz-utils imagemagick xdg-utils build-essential curl git-core dbus fcitx-rime fonts-wqy-microhei jq  libnss3 libxkbcommon-x11-0 libxcb-icccm4 libxcb-image0 libxcb-keysyms1 libxcb-randr0 libxcb-render-util0 libxcb-xinerama0 ttf-wqy-zenhei xz-utils
RUN sudo -v && wget -nv -O- https://raw.githubusercontent.com/kovidgoyal/calibre/master/setup/linux-installer.py | sudo python -c "import sys; main=lambda:sys.stderr.write('Download failed\n'); exec(sys.stdin.read()); main()"
ENV XDG_RUNTIME_DIR '/tmp/runtime-root'

# Run Kindlefy
COPY . .
ENTRYPOINT ["sh", "/entrypoint.sh"]
