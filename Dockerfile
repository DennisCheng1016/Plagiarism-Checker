FROM node
WORKDIR /app
COPY Back-end/package.json /app/
RUN npm install
COPY Back-end/. /app/
CMD ["npm", "start"]