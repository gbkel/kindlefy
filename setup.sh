apt-get update

apt-get install -y python wget gcc xz-utils imagemagick xdg-utils build-essential curl git-core

wget -nv -O- https://raw.githubusercontent.com/kovidgoyal/calibre/master/setup/linux-installer.py | python -c "import sys; main=lambda:sys.stderr.write('Download failed\n'); exec(sys.stdin.read()); main()"
