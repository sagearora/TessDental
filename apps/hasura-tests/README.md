# Hasura Integration Tests

This workspace contains integration tests for the Hasura GraphQL backend. These tests verify:

- GraphQL API functionality
- Database constraints
- Row-level security permissions
- Role-based access control (RBAC)

## Running Tests

From the root of the monorepo:

```bash
pnpm test:hasura
```

Or from this directory:

```bash
pnpm test
```

## Test Environment

Tests run against a dedicated test Hasura instance defined in `infra/compose/docker-compose.test.yml`. The test stack includes:

- PostgreSQL test database (port 5434)
- Hasura GraphQL Engine test instance (port 8082)

## Test Structure

Tests are located in `src/` and use:
- **Vitest** for the test framework
- **graphql-request** for GraphQL API calls
- **Node.js** environment (not browser)

## Adding New Tests

Create new test files in `src/` following the pattern:
- `*.integration.test.ts` for integration tests
- Use the `makeClient()` helper to create GraphQL clients with appropriate headers
