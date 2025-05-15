# Nextop

Nextop is a boilerplate built on [Next.js](https://nextjs.org), designed to streamline the development of modern web applications by providing a robust set of features and integrations out of the box.

## Features

- AI Agent
- Bun
- Dark theme provider
- Docker
- File upload
- Global progress bar
- I18n
- Multiple markdown editors
- Next.js v15
- Nuqs
- Prisma
- Session management
- Shadcn UI
- Sonner toast
- Tailwind CSS v4
- Web parser

## Screenshots

![Home](./docs/images/ai-agent.png)
![Markdown Editor](./docs/images/markdown-editor.png)
![Appearance](./docs/images/appearance.png)

## Getting Started

First, run the development server:

```bash
bun ci
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

```bash
cp .env.example .env
```

See more in [Next.js Environment Variables](https://nextjs.org/docs/pages/guides/environment-variables#environment-variable-load-order).

## Before Publishing

1. Change the `SESSION_SECRET` in the Environment Variables to a random string(`openssl rand -base64 32`).
2. No unauthenticated uploading (`/api/upload`).
3. No unauthenticated API calls.
4. Do not commit any secrets in the source code.
5. Do not expose any sensitive information in the client-side code.

## Deploy

```yaml
services:
  app:
    build:
      context: PROJECT_PATH
    restart: unless-stopped
    volumes:
      - ./volumes/runtime:/app/runtime
    environment:
      - PORT=3000
      - ENABLE_DEMO=false
      - SESSION_SECRET=
```

Learn more env config in [.env.example](.env.example).
