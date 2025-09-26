FROM node:18-alpine 
RUN apk add --no-cache curl git 
WORKDIR /app  
COPY package*.json ./  
RUN npm install --production  
COPY . .  
EXPOSE 3000 3001  
CMD ["sh", "-c", "node src/app-enhanced-v2.js & node src/app-enhanced-api-v2.js & wait"] 
