FROM node:8.15.0-alpine

# Set the working directory to /usr/app
WORKDIR /usr/app

# Copy the package.json file to /usr/app
COPY package.json .

# Install node_modules
RUN npm install

# Copy all the files from the project’s root to /usr/app
COPY . .
