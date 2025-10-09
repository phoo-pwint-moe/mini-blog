FROM node:20-alpine
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy code
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start React in dev mode (Vite)
CMD ["npm", "run", "dev", "--", "--host"]

