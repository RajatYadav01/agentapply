# ==========================================
# STAGE 1: Prune Monorepo
# ==========================================
FROM node:24-alpine AS pruner
WORKDIR /app
RUN npm install -g pnpm turbo
COPY . .
# Prune monorepo to ONLY include @agentapply/ats and its direct workspace deps
RUN turbo prune --scope=@agentapply/ats --docker

# ==========================================
# STAGE 2: Build Application
# ==========================================
FROM node:24-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm

# Install dependencies using pruned lockfile
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

# Copy pruned source code & build
COPY --from=pruner /app/out/full/ .

RUN pnpm --filter=@agentapply/ats build

# ==========================================
# STAGE 3: Production Runner
# ==========================================
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs

# Copy pruned workspace structure and built outputs
COPY --from=builder --chown=expressjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=expressjs:nodejs /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder --chown=expressjs:nodejs /app/apps/ats ./apps/ats
COPY --from=builder --chown=expressjs:nodejs /app/packages ./packages
COPY --from=builder --chown=expressjs:nodejs /app/node_modules ./node_modules

# Ensure the expressjs user owns the entire working directory for Prisma, pnpm, or node need to write temporary files in /app)
RUN chown -R expressjs:nodejs /app

USER expressjs

EXPOSE 5005

CMD ["node", "apps/ats/dist/src/index.js"]