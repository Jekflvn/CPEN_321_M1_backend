# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory in container
WORKDIR /app

# Copy package files first (for better Docker layer caching)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy TypeScript config and source code
COPY tsconfig.json ./
COPY src/ ./src/

# Install dev dependencies for build
RUN npm ci

# Build TypeScript to JavaScript
RUN npm run build

# Remove dev dependencies to reduce image size
RUN npm ci --only=production && npm cache clean --force

# Create uploads directory
RUN mkdir -p uploads/images

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/hobbies', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["npm", "start"]