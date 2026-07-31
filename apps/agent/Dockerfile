# ==========================================
# STAGE 1: Prune Monorepo
# ==========================================
FROM node:24-alpine AS pruner
WORKDIR /app
RUN npm install -g pnpm turbo
COPY . .
RUN turbo prune @agentapply/agent-v1 --docker

# ==========================================
# STAGE 2: Build
# ==========================================
FROM node:24-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full/ .

RUN pnpm --filter=@agentapply/types build
RUN pnpm --filter=@agentapply/config build
RUN pnpm --filter=@agentapply/logger build
RUN pnpm --filter=@agentapply/db build
RUN pnpm --filter=@agentapply/agent-v1 build

# ==========================================
# STAGE 3: Runner
# ==========================================
FROM mcr.microsoft.com/playwright:v1.62.0-noble AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1011 nodejs
RUN adduser --system --uid 1011 expressjs

# Copy built application and workspace dependencies
COPY --from=builder --chown=expressjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=expressjs:nodejs /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder --chown=expressjs:nodejs /app/apps/agent ./apps/agent
COPY --from=builder --chown=expressjs:nodejs /app/packages ./packages
COPY --from=builder --chown=expressjs:nodejs /app/node_modules ./node_modules

# Ensure the expressjs user owns the entire working directory for Prisma, pnpm, or node need to write temporary files in /app)
RUN chown -R expressjs:nodejs /app

USER expressjs

EXPOSE 4005

CMD ["node", "apps/agent/v1/dist/src/index.js"]