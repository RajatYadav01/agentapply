# ==========================================
# STAGE 1: Prune Monorepo
# ==========================================
FROM node:24-alpine AS pruner
WORKDIR /app
RUN npm install -g pnpm turbo
COPY . .

# Prune monorepo to ONLY include @agentapply/web and its workspace dependencies
RUN turbo prune @agentapply/web --docker

# ==========================================
# STAGE 2: Build React App
# ==========================================
FROM node:24-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm

# Install dependencies using pruned lockfile
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

# Copy pruned source code
COPY --from=pruner /app/out/full/ .

# Inject build-time environment variables
ARG VITE_BASE_URL
ARG VITE_API_URL
ARG VITE_ATS_URL

ENV VITE_BASE_URL=$VITE_BASE_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_ATS_URL=$VITE_ATS_URL

# Build static production assets (outputs to apps/web/dist or apps/web/build)
RUN pnpm --filter=@agentapply/web build

# ==========================================
# STAGE 3: Production Nginx Runner
# ==========================================
FROM nginx:alpine AS runner

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy build output from builder stage to Nginx web root
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]