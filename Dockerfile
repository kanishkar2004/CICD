# Use Node 18 Alpine
FROM node:18-alpine
WORKDIR /usr/src/app
COPY app/package*.json ./
RUN npm install --production
COPY app/ .
EXPOSE 3000
CMD ["npm","start"]
