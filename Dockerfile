FROM node
WORKDIR /app
COPY Back-end/package.json /app/
RUN npm install
COPY . /app/
CMD ["npm", "start"]