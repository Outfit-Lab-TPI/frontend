# Stage 1: Build the React application
FROM node:20-alpine AS builder
WORKDIR /app
ARG VITE_API_BASE_URL
ARG VITE_MP_PUBLIC_KEY
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_MP_PUBLIC_KEY=$VITE_MP_PUBLIC_KEY
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
