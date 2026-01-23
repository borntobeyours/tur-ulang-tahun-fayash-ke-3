# Build Stage
FROM public.ecr.aws/docker/library/node:20-alpine as builder

WORKDIR /app

COPY package.json ./

# Build arguments
ARG GEMINI_API_KEY
ENV GEMINI_API_KEY=$GEMINI_API_KEY

# Install dependencies
RUN npm install

COPY . .

# Build the application
RUN npm run build

# Production Stage
FROM public.ecr.aws/nginx/nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
