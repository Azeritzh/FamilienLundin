# Lundin

Dette er koden bag FamilienLundin siden. Den er bygget med [Nx](https://nx.dev), og består af en [Angular](https://angular.io) frontend og en [NestJs](https://nestjs.com) backend.

## Opsætning

For at arbejde på projektet skal der bruges en række programmer. Sørg for at have installeret [git](https://git-scm.com/), [Node.js](https://nodejs.org) og [Yarn](https://yarnpkg.com/), og eventuelt [Visual Studio Code]() til at programmere i. Yarn er lidt speciel med hensyn til installering: man skal først installere Node, og derefter åbne en terminal og køre `npm install -g yarn`.

For at komme igang skal projektet først downloades. Åbn en terminal i den mappe, det skal ligge i, og kør `git clone https://github.com/Azeritzh/FamilienLundin.git` for at hente det ned. Resten skal foregå inde fra den mappe, så navigér derind i terminalen med `cd FamilienLundin`. Nu er næste trin at hente de biblioteker og værktøjer projektet har brug for; det sker ved at køre `yarn`. Når den en gang er færdig, er projektet klar til brug.

## Struktur

Dette er et såkaldt "monorepo", hvilket vil sige at det er et enkelt repository som indeholder adskillige projekter. De primære projekter vi har er frontenden, som findes under `apps/lundin` og backenden, som findes under `apps/api`. Derudover er der en `libs` mappe til diverse kodebiblioteker (det kunne f.eks. være logikken bag et spil).

## Udvikling

For at kunne køre og teste det kode man skriver, må man starte både backend og frontend. Kør backend med `yarn nx serve api` og frontend med `yarn nx serve lundin` (det kræver hver sin terminal. Ting der kører i en terminal kan stoppes igen med Ctrl+C). Derefter er siden tilgængelig på localhost:4200 i en browser. Siden kræver login, og der følger ingen data-filer med i projektet, så der skal oprettes en test bruger for at kunne logge ind. Det kan gør man ved at navigere til `localhost:3333/api/user/add-basic`.

## Produktion

Production håndteres ved at clone projektet på serveren, navigere ind i mappen og køre `yarn install --production` og derefter køre `./deploy-production.sh` (det kræver at man har kørt `build-production.bat` og committed det). Serveren startes med `nohup node dist/apps/api/main.js &` (`&` starter det som en baggrundsprocess, og `nohup` sørger for den ikke stopper når sessionen gør). Process id'en kan findes med `ps -x`, som viser kørende processer, og serveren stoppes så med `kill 1234` (hvor 1234 er processens id).

Skridt:
```
ssh pi@123.123.123.123
// skriv kode
ps -x
// find pid
kill 1234
cd FamilienLundin
git pull
./deploy-production.sh
nohup node dist/apps/api/main.js &
```