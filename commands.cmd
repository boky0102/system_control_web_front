make server installer
pkg -t node*-win-x64 index.js --config package.json

make python server installer
pyinstaller -F main.py --clean