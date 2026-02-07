FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files for monorepo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/auth/package.json apps/auth/tsconfig.json apps/auth/

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY apps/auth/src apps/auth/src

# Build
WORKDIR /app/apps/auth
RUN pnpm build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/auth/package.json apps/auth/

# Install pnpm
RUN npm install -g pnpm

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod --filter @tessdental/auth

# Copy built files
COPY --from=builder /app/apps/auth/dist ./apps/auth/dist

EXPOSE 4000

WORKDIR /app/apps/auth

CMD ["node", "--enable-source-maps", "dist/index.js"]
