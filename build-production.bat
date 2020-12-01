ECHO Building backend
call yarn nx build api --prod
ECHO Building frontend
call yarn nx build lundin --prod
ECHO Archiving build artifacts
call tar -czf dist.tar.gz dist
ECHO Finished
PAUSE