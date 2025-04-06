FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY package-lock.json ./
RUN npm install

COPY . .

COPY prisma ./prisma

RUN npx prisma generate
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

ENV NODE_ENV=production

CMD ["node", "dist/main"]
CMD npx prisma migrate deploy && node dist/main
