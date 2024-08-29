# Use the official Node.js image as a base
FROM node:18

# Create and set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock) into the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code into the working directory
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build
# Expose the port your app runs on
EXPOSE 3000

# Command to run your app
CMD ["npm", "start"]
