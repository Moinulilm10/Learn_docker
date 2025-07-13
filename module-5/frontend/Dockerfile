# Use stable Node version compatible with react-scripts
FROM node:16.20.2

# Set working directory
WORKDIR /app

# Copy package files first (improves caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app
COPY . .

# Expose the port used by create-react-app
EXPOSE 3000

# Start the development server
CMD ["npm", "start"]
