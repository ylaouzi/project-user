# Build stage
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Install yarn if needed
RUN apk add --no-cache yarn

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN yarn prisma generate

# Production stage
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install yarn
RUN apk add --no-cache yarn

# Copy package files
COPY package.json yarn.lock ./

# Install production dependencies only
RUN yarn install --production

# Copy built files and Prisma generated files from build stage
COPY --from=build /app/src /app/src
COPY --from=build /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=build /app/node_modules/@prisma /app/node_modules/@prisma

# Copy Prisma schema
COPY prisma /app/prisma

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["yarn", "dev"]