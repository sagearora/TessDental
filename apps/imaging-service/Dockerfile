FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files for monorepo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/imaging-service/package.json apps/imaging-service/tsconfig.json apps/imaging-service/

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY apps/imaging-service/src apps/imaging-service/src

# Build
WORKDIR /app/apps/imaging-service
RUN pnpm build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/imaging-service/package.json apps/imaging-service/

# Install pnpm
RUN npm install -g pnpm

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod --filter @tessdental/imaging-service

# Copy built files
COPY --from=builder /app/apps/imaging-service/dist ./apps/imaging-service/dist

EXPOSE 4010

WORKDIR /app/apps/imaging-service

CMD ["node", "--enable-source-maps", "dist/index.js"]
