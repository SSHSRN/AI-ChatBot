# Fetching the latest node image on alpine linux
FROM node:alpine AS development

# Declaring env
ENV NODE_ENV development

# Setting up the work directory (a new directory will be created)
WORKDIR /app

# Installing dependencies
COPY ./package.json /app
RUN npm install --silent

# Copying all the files in our project
COPY . .

# Make port 3001 available to the world outside this container
EXPOSE 3001

# Starting our application
CMD node index.js
