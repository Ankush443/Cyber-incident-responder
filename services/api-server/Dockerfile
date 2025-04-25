FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npx prisma generate

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
ENV DATABASE_URL=postgres://postgres:password@postgres:5432/incidentdb
ENV JWT_SECRET=supersecretjwt
ENV FLUVIO_ADDR=fluvio:9003
EXPOSE 3000
CMD ["node", "dist/main.js"] 