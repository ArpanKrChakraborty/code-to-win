@echo off
:: Compile and then run against testcases and give associated verdict
:: argument list: {fileType Ex:cpp,java,c,py}  {Name of the file with extension} {Name of the file without extension} {comm file location}
set ext=%1
set fileNameWithExtension= %2
set fileNameWithoutExtension=%3
set commfile=%4
echo Error: Compile Error (CPE) > %commfile%
if %ext%==cpp g++ -g -std=c++14 -w %fileNameWithExtension% -o %fileNameWithoutExtension% 2>> %commfile%
if %ext%==c gcc -std=c11 -w %fileNameWithExtension% -o %fileNameWithoutExtension% 2>> %commfile%
if %ext%==java javac %fileNameWithExtension% 2>> %commfile%
if %errorlevel%==0  exit 0
if %errorlevel%==1 exit 1