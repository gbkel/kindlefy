FROM node:14.17

# Install Calibre
RUN apt-get update
RUN apt-get install -y sudo python wget gcc xz-utils imagemagick xdg-utils build-essential curl git-core dbus fcitx-rime fonts-wqy-microhei jq  libnss3 libxkbcommon-x11-0 libxcb-icccm4 libxcb-image0 libxcb-keysyms1 libxcb-randr0 libxcb-render-util0 libxcb-xinerama0 ttf-wqy-zenhei xz-utils
RUN sudo -v && wget -nv -O- https://raw.githubusercontent.com/kovidgoyal/calibre/master/setup/linux-installer.py | sudo python -c "import sys; main=lambda:sys.stderr.write('Download failed\n'); exec(sys.stdin.read()); main()"
ENV XDG_RUNTIME_DIR '/tmp/runtime-root'

# Install Git
RUN apt-get install -y git-all

# Install Kindle Comic Converter
RUN apt-get install -y python3 python3-dev python3-pip python3-pyqt5 libpng-dev libjpeg-dev p7zip-full unrar
RUN pip3 install --upgrade pillow python-slugify psutil scandir raven
RUN wget https://ia801700.us.archive.org/14/items/kindlegen/kindlegen
RUN mv kindlegen /usr/local/bin
RUN wget -o kcc.deb https://kcc.iosphe.re/Linux
RUN apt install -y ./kcc.deb
RUN git clone https://github.com/ciromattia/kcc.git
RUN mv kcc /kcc

# Run Kindlefy
COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["sh", "/entrypoint.sh"]
