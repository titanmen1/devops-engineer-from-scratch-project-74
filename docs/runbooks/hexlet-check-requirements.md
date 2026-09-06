# Требования автотестов Хекслета (hexlet-check) к этому проекту

## Цель

Зафиксировать, что именно проверяет `hexlet/project-action` в проекте
«Docker Compose», — эти требования не выводятся ни из `steps/*.md`, ни из кода
репозитория, а выясняются только по логам упавших прогонов.

## Предусловия

- Репозиторий на GitHub с рабочим `.github/workflows/hexlet-check.yml`
- Секрет `HEXLET_ID` в репозитории (создаётся Хекслетом при старте проекта)
- Локально: Docker с Compose v2, `gh` CLI для чтения логов

## Что делает hexlet-check

Порядок команд (виден в логе прогона):

```bash
docker compose -f docker-compose.yml run --rm app make setup
cd code && docker compose pull
cd code && docker compose -f docker-compose.yml -f docker-compose.override.yml \
  -f ../__fixtures__/docker-compose.override.yml build
cd code/app && make setup            # на голом раннере, без Docker
docker compose -f docker-compose.yml config --services
docker compose -f docker-compose.yml run --rm test
# и отдельно: поднимает весь стек и дёргает https://localhost/ через caddy
```

Отсюда вытекают жёсткие требования:

1. **Сервис `test` обязателен** в `docker-compose.yml`. Проверка вызывает
   `run --rm test`; сервиса `app` с `command: make test` недостаточно.
2. **`env_file: .env` использовать нельзя.** Проверка не создаёт `.env`, и
   compose падает с `env file /project/code/.env not found`. Переменные задавать
   через `environment:` со значениями по умолчанию: `${VAR:-default}`.
3. **`cd code/app && make setup` выполняется на раннере вне Docker.** В PATH там
   только `node`/`npm`; ни `pnpm`, ни `corepack` нет.
4. **Приложение должно быть npm-версией** `js-fastify-blog` (с
   `package-lock.json`). Свежий клон upstream уже на pnpm — с ним падает и п.3, и
   `npm ci` в `Dockerfile.production`. Рабочая npm-версия лежит в эталонном
   решении: `__data__/../code/app`; в upstream такой ревизии нет.
5. **Миграции нужно накатывать перед тестами.** `server/plugin.js` их не
   применяет, тесты идут в пустую базу и падают с `42P01 relation "articles"
   does not exist`. Команда сервиса `test`:
   `sh -c "make db-migrate && make test"`.
6. **dev-сервису нужен `NODE_ENV: development` в `environment`.** `app` из
   `docker-compose.override.yml` делит `image:` с продакшеном и наследует его
   `ENV NODE_ENV=production`; тогда `npm install` пропускает devDependencies, и
   `make dev` падает на `ERR_MODULE_NOT_FOUND: @tailwindcss/vite`, а caddy
   отдаёт 502. Отдельное имя образа для dev не подходит: `docker compose pull`
   в проверке попытается скачать несуществующий репозиторий и упадёт с
   `pull access denied`.

## Проверка

```bash
make test                                    # ожидается: Tests 9 passed
docker compose -f docker-compose.yml config --services   # app, db, test
make setup && make up                        # затем:
curl -sk -o /dev/null -w '%{http_code}\n' https://localhost/   # 200
curl -s  -o /dev/null -w '%{http_code}\n' http://localhost/    # 308
```

Статус прогонов:

```bash
gh run list --repo <owner>/<repo> --limit 5
gh run view <run-id> --log-failed | tail -60
```

## Грабли

- **`make setup` надо запускать через dev-конфигурацию**, то есть
  `docker compose run` без `-f docker-compose.yml`. С флагом берётся
  продакшен-сервис без volume, и `node_modules` остаются внутри образа, а не в
  `./app` — dev потом падает.
- **`cp -n` на macOS (BSD) возвращает код 1**, когда файл уже существует, и
  ломает `make`. Портируемый вариант: `test -f .env || cp .env.example .env`.
- **На GitHub Actions нет бинарника `docker-compose`** — только плагин
  `docker compose`. Makefile должен использовать v2-синтаксис.
- **Секрет, записанный пустым, выглядит как существующий.** `gh secret list`
  покажет `DOCKERHUB_TOKEN`, а CI упадёт на `Password required`. Пересоздать:
  `gh secret set DOCKERHUB_TOKEN --repo <owner>/<repo> --body "<TOKEN>"`
  (токен брать на hub.docker.com → Account Settings → Personal access tokens).
- **`postgres:latest` (18.x) не запускается** с volume на
  `/var/lib/postgresql/data`: в 18-й версии данные лежат в подкаталоге с номером
  версии. Либо монтировать `/var/lib/postgresql`, либо закрепить `postgres:16`.
- **`extends` резолвится до мержа override-файлов**, поэтому сервис `test`
  наследует продакшен-вариант `app`, а не dev — это нужное поведение.
- **Образ должен быть под linux/amd64.** Раннер Хекслета — amd64; образ,
  собранный на Apple Silicon обычным `docker build`, кладётся в реестр только
  как arm64, и проверка падает с `no matching manifest for linux/amd64`.
  Собирать так:
  `docker buildx build --platform linux/amd64,linux/arm64 -f Dockerfile.production -t <repo>:latest --push .`
  В CI за это отвечают `setup-qemu-action` + `platforms:` в `build-push-action`.
- **Образ в Docker Hub надо обновлять до пуша кода.** Обе проверки делают
  `docker compose pull` и берут `latest` из реестра; если там лежит образ от
  прошлой версии приложения, прогон упадёт на командах, которых в нём ещё нет
  (например `make: No rule to make target 'db-migrate'`).

## Откат

Все изменения — в git. Вернуться к предыдущему состоянию приложения:

```bash
git log --oneline -- app
git revert <commit>
```
