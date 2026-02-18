FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/pdf-service/package.json apps/pdf-service/tsconfig.json apps/pdf-service/

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

COPY apps/pdf-service/src apps/pdf-service/src

WORKDIR /app/apps/pdf-service
RUN pnpm build

# Production stage
FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/pdf-service/package.json apps/pdf-service/

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile --prod --filter @tessdental/pdf-service

COPY --from=builder /app/apps/pdf-service/dist ./apps/pdf-service/dist

EXPOSE 4020

WORKDIR /app/apps/pdf-service

CMD ["node", "--enable-source-maps", "dist/index.js"]
