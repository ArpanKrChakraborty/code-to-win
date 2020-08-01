@echo off
:: Compile the file and send appropriate error code
:: argument list: {fileType Ex:cpp,java,c,py}  {Name of the file with extension} {Name of the file without extension} {comm file location} {cpp_version} {c_version}
set ext=%1
set fileNameWithExtension= %2
set fileNameWithoutExtension=%3
set commfile=%4
set cppversion=%5
set cversion=%6
set flags=%7
echo Error: Compile Error (CPE) > %commfile%
if %ext%==cpp g++ %flags% -std=%cppversion% %fileNameWithExtension% -o %fileNameWithoutExtension% 2>> %commfile%
if %ext%==c gcc %flags% -std=%cversion% -w %fileNameWithExtension% -o %fileNameWithoutExtension% 2>> %commfile%
if %ext%==java javac %flags% %fileNameWithExtension% 2>> %commfile%
if %errorlevel%==0  exit 0
if %errorlevel%==1 exit 1