FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app
# Copiar manifiestos
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* ./
# Permitir scripts de build (necesario para esbuild)
RUN pnpm config set ignore-scripts false
# Instalar TODAS las dependencias (necesitamos devDependencies para el build)
RUN pnpm install --frozen-lockfile

# Copiar código fuente
COPY . .
# Construir la aplicación TanStack Start para producción
RUN pnpm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copiar dependencias y el resultado del build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

# El comando por defecto para arrancar
CMD ["node", ".output/server/index.mjs"]
