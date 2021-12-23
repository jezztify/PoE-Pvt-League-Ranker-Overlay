@echo off

echo "----- Removing dist folder"
DEL /S dist
echo "----- Compiling binary"
pyinstaller --noconfirm --onefile --console --clean --paths pplo pplo\__main__.py
echo "----- Copying files"
COPY  config.ini dist\
mkdir -p dist\pplo
COPY  pplo\data dist\pplo
echo "----- Done!"