cd /d "C:\xampp\htdocs\event-gallery\event-gallery\backend"

:: Cria pasta de log caso não exista
if not exist "logfiles" mkdir "logfiles"

:: Define o nome do arquivo de log com data e hora
set "LOGFILE=%~dp0logfiles\server_log_%date:~-4,4%-%date:~-7,2%-%date:~-10,2%_%time:~0,2%-%time:~3,2%.txt"

:: Remove espaços do nome do arquivo (por causa do formato de hora)
set "LOGFILE=%LOGFILE: =0%"

echo Iniciando servidor... > "%LOGFILE%"
echo ---------------------------------------- >> "%LOGFILE%"
echo Data: %date% Hora: %time% >> "%LOGFILE%"
echo ---------------------------------------- >> "%LOGFILE%"
echo. >> "%LOGFILE%"

:: Executa o npm start e redireciona toda a saída (stdout e stderr) para o log
call npm start >> "%LOGFILE%" 2>&1

echo. >> "%LOGFILE%"
echo ---------------------------------------- >> "%LOGFILE%"
echo Servidor finalizado em %date% %time% >> "%LOGFILE%"
echo ---------------------------------------- >> "%LOGFILE%"
pause
