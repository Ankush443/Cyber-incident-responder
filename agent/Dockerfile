FROM rust:1.81-alpine AS builder
WORKDIR /app
# Install necessary build tools for linking
RUN apk update && apk add --no-cache build-base
COPY Cargo.toml ./
COPY src ./src
RUN cargo build --release

FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/target/release/agent ./agent
ENV GATEWAY_WS_URL=ws://api-server:3000/ws
CMD ["./agent"] 