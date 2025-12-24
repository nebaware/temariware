mkdir dist 2>nul
copy index.html dist\
xcopy /E /I public dist\public 2>nul
echo Build complete