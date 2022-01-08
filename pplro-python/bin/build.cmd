@echo off

echo "----- Removing dist folder"
DEL /S /Q dist
rmdir /S /Q dist
echo "----- Compiling binary"
pyinstaller --noconfirm --console --clean --paths src __main__.spec
@REM echo "----- Copying files"
@REM COPY  config.ini dist\__main__
@REM mkdir -p dist\__main__
@REM echo D | xcopy /S /Q pplro\data dist\__main__\src\data
echo "----- Done!"