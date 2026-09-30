# ─── Stage: Production Image ───────────────────────────────────────────────────
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy dependency manifests first for better layer caching.
# This layer is only re-built when package*.json changes.
COPY package.json package-lock.json ./

# Install ONLY production dependencies (excludes nodemon, etc.)
RUN npm ci --only=production

# Copy the rest of the application source
COPY . .

# Expose the API port
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
