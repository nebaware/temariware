# Use a lightweight, secure Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package definitions first to leverage Docker cache
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Define environment variables (Defaults, can be overridden)
ENV NODE_ENV=production

# Start the application
CMD ["node", "server.js"]