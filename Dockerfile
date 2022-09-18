FROM node:14.17

# Install Calibre
RUN apt-get update
RUN apt-get install -y sudo python wget gcc xz-utils imagemagick xdg-utils build-essential curl git-core dbus fcitx-rime fonts-wqy-microhei jq  libnss3 libxkbcommon-x11-0 libxcb-icccm4 libxcb-image0 libxcb-keysyms1 libxcb-randr0 libxcb-render-util0 libxcb-xinerama0 ttf-wqy-zenhei xz-utils
RUN sudo -v && wget -nv -O- https://download.calibre-ebook.com/linux-installer.sh | sudo sh /dev/stdin version=5.44.0
ENV XDG_RUNTIME_DIR '/tmp/runtime-root'

# Install Git
RUN apt-get install -y git-all

# Run Kindlefy
COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["sh", "/entrypoint.sh"]
