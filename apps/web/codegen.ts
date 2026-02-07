import type { CodegenConfig } from '@graphql-codegen/cli'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Load .env file from apps/web directory or fallback to infra/compose/.env
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Try apps/web/.env first, then infra/compose/.env
const localEnvPath = path.resolve(__dirname, '.env')
const composeEnvPath = path.resolve(__dirname, '../../../infra/compose/.env')

// Load environment variables (compose env will override local if both exist)
dotenv.config({ path: localEnvPath })
dotenv.config({ path: composeEnvPath })

// Support both VITE_ prefixed (for frontend) and direct env vars (for codegen)
// Use 127.0.0.1 instead of localhost to avoid IPv6 connection issues
const hasuraUrl = process.env.VITE_HASURA_URL || process.env.HASURA_URL || 'http://127.0.0.1:8080/v1/graphql'
const adminSecret = process.env.VITE_HASURA_ADMIN_SECRET || process.env.HASURA_GRAPHQL_ADMIN_SECRET

const config: CodegenConfig = {
    schema: [
        {
            [hasuraUrl]: {
                headers: adminSecret
                    ? {
                        'x-hasura-admin-secret': adminSecret,
                    }
                    : {},
            },
        },
    ],
    documents: ['src/**/*.graphql'],
    generates: {
        'src/gql/generated.tsx': {
            plugins: [
                'typescript',
                'typescript-operations',
                'typescript-react-apollo',
            ],
            config: {
                useTypeImports: true,
                enumsAsTypes: true,

                withHooks: true,
                withHOC: false,
                withComponent: false,

                // ✅ critical: don't generate Apollo.useX
                noNamespaces: true,

                // ✅ Apollo v4: pull React hooks from the React entrypoint
                apolloReactHooksImportFrom: "@apollo/client/react",
                apolloReactCommonImportFrom: "@apollo/client/react",
                apolloClientImportPath: "@apollo/client/react",
                scalars: {
                    uuid: 'string',
                    timestamptz: 'string',
                    bigint: 'number',
                },
            },
        },
    },
}

export default config
