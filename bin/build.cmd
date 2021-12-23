@echo off

echo "----- Removing dist folder"
DEL /S /Q dist
rmdir /S /Q dist
echo "----- Compiling binary"
pyinstaller --noconfirm --console --clean --paths pplo pplo\__main__.py
echo "----- Copying files"
COPY  config.ini dist\__main__
mkdir -p dist\__main__
echo D | xcopy /S /Q pplo\data dist\__main__\pplo\data
echo "----- Done!"