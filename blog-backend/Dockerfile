# Use Node 20 Alpine
FROM node:20-alpine
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Install ts-node-dev for hot reload
RUN npm install ts-node-dev --save-dev

# Expose backend port
EXPOSE 4000

# Start NestJS with hot reload
CMD ["npx", "ts-node-dev", "--respawn", "--transpile-only", "src/main.ts"]

