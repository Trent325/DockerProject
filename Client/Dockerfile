# Step 1: Build the React application
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React application
RUN npm run build

# Step 2: Serve the React application
FROM node:18 AS production

# Install serve globally
RUN npm install -g serve

# Set the working directory
WORKDIR /app

# Copy the built files from the build stage
COPY --from=build /app/dist /app/dist

# Expose port 5000 (default port for serve)
EXPOSE 5000

# Start serve to serve the build directory
CMD ["serve", "-s", "dist", "-l", "5000"]
