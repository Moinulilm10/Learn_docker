# Use official Node.js LTS image
FROM node:16.20.2

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose the backend server port
EXPOSE 8000

# Start the server
CMD ["node", "app.js"]
