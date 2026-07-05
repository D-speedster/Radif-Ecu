# ══════════════════════════════════════════════════════════════════════════════
# Stage 1 — Builder: compile the Vite/React app
# ══════════════════════════════════════════════════════════════════════════════
FROM node:20-alpine AS builder

WORKDIR /app

# Copy manifests first for dependency-layer caching
COPY package.json package-lock.json ./

# Install ALL dependencies (including devDeps needed for the build)
RUN npm ci

# Inject the API base URL.
# Using a relative path (/api) means every browser request goes to the same
# origin that served the page, so Nginx can proxy it — no CORS, no hardcoded IPs.
ENV VITE_API_URL=/api

# Copy source files and build
COPY . .
RUN npm run build
# Output is in /app/dist

# ══════════════════════════════════════════════════════════════════════════════
# Stage 2 — Runner: serve the static assets with Nginx
# ══════════════════════════════════════════════════════════════════════════════
FROM nginx:alpine AS runner

# Remove the default Nginx welcome page config
RUN rm /etc/nginx/conf.d/default.conf

# Copy compiled React app from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy our custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
