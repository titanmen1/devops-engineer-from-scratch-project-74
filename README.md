# Упаковка в Docker Compose

[![hexlet-check](https://github.com/titanmen1/devops-engineer-from-scratch-project-74/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/titanmen1/devops-engineer-from-scratch-project-74/actions)
[![push](https://github.com/titanmen1/devops-engineer-from-scratch-project-74/actions/workflows/push.yml/badge.svg)](https://github.com/titanmen1/devops-engineer-from-scratch-project-74/actions/workflows/push.yml)

Автоматизация развертывания и обновления локального окружения с помощью Docker Compose, Github Actions (CI), Makefile

Учебный проект Хекслета: https://ru.hexlet.io/programs/devops-engineer-from-scratch
Как это должно работать: https://asciinema.org/a/zVrFYtslVReMsTyqEEetdWUY5

В контейнере упаковано приложение [js-fastify-blog](https://github.com/hexlet-components/js-fastify-blog).
Готовый образ для продакшена: [titanmen/devops-engineer-from-scratch-project-74](https://hub.docker.com/r/titanmen/devops-engineer-from-scratch-project-74)

## Стек

- Node.js 26, Fastify, PostgreSQL
- Docker, Docker Compose
- Caddy (reverse proxy, https из коробки)
- Github Actions (CI/CD)

## Требования

- Docker
- Docker Compose версии не ниже 1.27.0

## Установка

```bash
git clone https://github.com/titanmen1/devops-engineer-from-scratch-project-74.git
cd devops-engineer-from-scratch-project-74
make setup
```

`make setup` сам копирует `.env.example` в `.env`, если файла ещё нет, и ставит зависимости.

## Использование

```bash
# Запуск окружения (app + db + caddy)
make up

# Приложение конфигурируется переменными окружения из .env
# https://localhost — главная страница (самоподписной сертификат)

# Тесты (внутри Docker, тот же образ, что и в CI)
make test

# Остановка
make down
```

<!-- Добавьте запись asciinema — именно это смотрит работодатель -->

---

<details>
<summary>Автоматические тесты Хекслета</summary>

Тесты запускаются на каждый коммит. За запуск отвечает файл `.github/workflows/hexlet-check.yml` — не удаляйте и не переименовывайте ни его, ни репозиторий.

</details>

## О Хекслете

[Хекслет](https://ru.hexlet.io/) — школа программирования: авторские программы обучения с практикой, поддержкой наставников и реальными проектами, которые остаются в резюме. Этот репозиторий — один из таких проектов.
