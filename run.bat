@echo off

node index2.js

START t

ping 127.0.0.1 -n 30 > nul

taskkill /F /IM wmplayer.exe
taskkill /FI "WindowTitle eq Administrator:  miditime"
