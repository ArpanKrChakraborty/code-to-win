:: Run Batch File
@echo off
setlocal enabledelayedexpansion
:: Arguments:fileNameNoExtension, input, output, result, finalResult, No , timeLimit
set fileNameNoExtension=%1
set input=%2
set output=%3
set result=%4
set finalResult=%5
set no=%6
set /A timeLimit=%7
set ext=%8
set flags=%9
set /A tlms=%timeLimit%*1000
set "escapeb=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^="
set "escapec=^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>"
if %no%==1 echo Compilation Successful^^! > %finalResult% && CLS && echo Running Against Test-Cases: && echo (Process Will be halted automatically after 1 min to avoid infinte loop execution)

if %ext%==cpp (
    set STARTTIME=!time!
    %fileNameNoExtension% < %input% > %result% 2>&1
    set ENDTIME=!time!
)   

if %ext%==c set STARTTIME=!time! & %fileNameNoExtension% < %input% > %result% 2>&1 & set ENDTIME=!time!

if %ext%==java set STARTTIME=!time! & java %fileNameNoExtension% < %input% > %result% 2>&1 & set ENDTIME=!time!

if %ext%==python set STARTTIME=!time! & py %flags% %fileNameNoExtension%.py < %input% > %result% 2>&1 & set ENDTIME=!time!

rem Get start time:
for /F "tokens=1-4 delims=:.," %%a in ("%STARTTIME%") do (
   set /A "start=(((%%a*60)+1%%b %% 100)*60+1%%c %% 100)*100+1%%d %% 100"
)

rem Get end time:
for /F "tokens=1-4 delims=:.," %%a in ("%ENDTIME%") do (
   set /A "end=(((%%a*60)+1%%b %% 100)*60+1%%c %% 100)*100+1%%d %% 100"
)

rem Get elapsed time:
set /A elapsed=end-start

rem Show elapsed time:
set /A hh=elapsed/(60*60*100), rest=elapsed%%(60*60*100), mm=rest/(60*100), rest%%=60*100, ss=rest/100, cc=rest%%100
if %mm% lss 10 set mm=0%mm%
if %ss% lss 10 set ss=0%ss%
if %cc% lss 10 set cc=0%cc%

rem total centiseconds
set /a tcc=%hh%*360000 + %mm%*6000 + %ss%*100 + %cc%

rem total ms
set /a ms=%tcc%*10

fc /A %result% %output% 
if %errorlevel%==0 set verdict=AC (Accepted) & set DIFFACTIVE=0
if %errorlevel%==1 set verdict=WA (Wrong Answer) & set DIFFACTIVE=1
if %ms% GTR %tlms% set verdict=TLE (Time Limit Exceeded)
echo %escapec% >> %finalResult% & echo Test Case %no%: >> %finalResult% & echo %escapeb% >> %finalResult% & echo Input: >> %finalResult% & type %input% >> %finalResult% & echo. >> %finalResult% & echo %escapeb% >> %finalResult% & echo Expected Output: >> %finalResult% & type %output% >> %finalResult%  & echo. >> %finalResult% & echo %escapeb% >> %finalResult%  &  echo Your Answer: >> %finalResult% & type %result% >> %finalResult% & echo. >> %finalResult% &  echo %escapeb% >> %finalResult%  & echo Verdict:%verdict% >> %finalResult% & echo Process Run Time: %ms% ms >> %finalResult% 
if %DIFFACTIVE%==1 echo %escapeb% >> %finalResult% & echo Difference (Your Answer Vs Expected Output): >> %finalResult% & fc /A %result% %output% >> %finalResult% & echo %escapec% >> %finalResult% & echo. >> %finalResult%
if %DIFFACTIVE%==0 echo %escapec% >> %finalResult% & echo. >> %finalResult%
endlocal