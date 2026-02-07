# TessDental

A pnpm monorepo for TessDental application.

## Prerequisites

- Node.js 18+ 
- pnpm 9.15.0
- Docker and Docker Compose
- Hasura CLI (for Hasura operations)

## Initial Setup

1. Copy the environment file:
```bash
cp infra/compose/.env.example infra/compose/.env
```

2. Start infrastructure:
```bash
pnpm infra:up
```

3. Apply Hasura migrations and metadata (in a new terminal):
```bash
export HASURA_GRAPHQL_ADMIN_SECRET=change_me_admin_secret
pnpm hasura:migrate:apply
pnpm hasura:metadata:apply
```

4. Start development:
```bash
pnpm dev
```

This will:
- Start Postgres + Hasura via Docker Compose
- Start the Vite web app

## Available Scripts

- `pnpm dev` - Start infrastructure and web app
- `pnpm dev:web` - Start only the web app
- `pnpm infra:up` - Start Docker services
- `pnpm infra:down` - Stop Docker services
- `pnpm infra:logs` - View Docker logs
- `pnpm hasura:console` - Open Hasura console
- `pnpm test` - Run unit/integration tests
- `pnpm test:e2e` - Run E2E tests

## Project Structure

```
TessDental/
  apps/
    web/          # Vite React app
  infra/
    compose/      # Docker Compose files
    hasura/       # Hasura config, migrations, metadata
```

## Access Points

- Web app: http://localhost:5173
- Hasura Console: http://localhost:8080/console
- GraphQL Endpoint: http://localhost:8080/v1/graphql
