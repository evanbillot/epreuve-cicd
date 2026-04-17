# ---------- BUILD ----------
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY . .

# ---------- RUN ----------
FROM node:18-alpine

LABEL maintainer="devsecops@student.com"
LABEL version="1.0"

WORKDIR /app

# utilisateur non-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app .

USER appuser

EXPOSE 3000

# healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
CMD wget --spider http://localhost:3000/health || exit 1

CMD ["node", "server.js"]