FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
# Debug our directory structure
RUN ls -la && echo "Current directory structure" && ls -la src/

# Modify vite config to include root directory and output directory
RUN echo 'import { defineConfig } from "vite"; import react from "@vitejs/plugin-react"; export default defineConfig({ root: "src", plugins: [react()], build: { outDir: "/build-output" } });' > vite.config.js

# Build with clear output directory
RUN mkdir -p /build-output && \
    npx vite build && \
    echo "Build complete, checking outputs:" && \
    ls -la /build-output

FROM node:20-alpine
WORKDIR /app
# Copy only what we need from builder
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /build-output ./dist
# Simple vite config for preview
RUN echo 'import { defineConfig } from "vite"; export default defineConfig({ server: { port: 5173, host: "0.0.0.0" } });' > vite.config.js

ENV VITE_API_HTTP=http://api-server:3000
ENV VITE_API_WS=ws://api-server:3000/ws
EXPOSE 5173
CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "5173"] 