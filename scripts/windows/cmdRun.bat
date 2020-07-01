:: Run Batch File
@echo off
@setlocal
:: Arguments:fileNameNoExtension, input, output, result, finalResult, No , timeLimit
set fileNameNoExtension=%1
set input=%2
set output=%3
set result=%4
set finalResult=%5
set no=%6
set verdict=WA (Wrong Answer)
set timeLimit=%7
if %no%==1 echo Compilation Successful! > %finalResult% && CLS && echo Running Against Test-Cases: && echo (Process Will be halted automatically after 1 min to avoid infinte loop execution)
set start=%time%
%fileNameNoExtension% < %input% > %result% 
set end=%time%
set options="tokens=1-4 delims=:.,"
for /f %options% %%a in ("%start%") do set start_h=%%a&set /a start_m=100%%b %% 100&set /a start_s=100%%c %% 100&set /a start_ms=100%%d %% 100
for /f %options% %%a in ("%end%") do set end_h=%%a&set /a end_m=100%%b %% 100&set /a end_s=100%%c %% 100&set /a end_ms=100%%d %% 100

set /a hours=%end_h%-%start_h%
set /a mins=%end_m%-%start_m%
set /a secs=%end_s%-%start_s%
set /a ms=%end_ms%-%start_ms%
if %ms% lss 0 set /a secs = %secs% - 1 & set /a ms = 100%ms%
if %secs% lss 0 set /a mins = %mins% - 1 & set /a secs = 60%secs%
if %mins% lss 0 set /a hours = %hours% - 1 & set /a mins = 60%mins%
if %hours% lss 0 set /a hours = 24%hours%
if 1%ms% lss 100 set ms=0%ms%

:: Mission accomplished
set /a totalsecs = %hours%*3600 + %mins%*60 + %secs%
if %totalsecs%.%ms% GTR %timeLimit% set verdict=TLE (Time Limit Exceeded)
fc /A %result% %output% 
if %errorlevel%==0 echo Test Case %no%: >> %finalResult% &&  echo Input: >> %finalResult% && type %input% >> %finalResult%  && echo Output: >> %finalResult% && type %output% >> %finalResult% &&  echo Answer: >> %finalResult% && type %result% >> %finalResult% &&  echo. >> %finalResult% && echo Verdict:AC (Accepted) >> %finalResult% && echo Process Run Time: %totalsecs%.%ms% secs >> %finalResult% && echo. >> %finalResult%
if %errorlevel%==1 echo Test Case %no%: >> %finalResult% &&  echo Input: >> %finalResult% && type %input% >> %finalResult%  && echo Output: >> %finalResult% && type %output% >> %finalResult% &&  echo Answer: >> %finalResult% && type %result% >> %finalResult% && echo. >> %finalResult% && echo Verdict:%verdict% >> %finalResult% && echo Process Run Time: %totalsecs%.%ms% secs >> %finalResult% && echo. >> %finalResult%
