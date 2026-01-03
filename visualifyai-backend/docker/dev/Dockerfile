FROM node:20-alpine

# create working directory
WORKDIR /usr/src/app

# copy package.json and package-lock.json
COPY package*.json ./

# install dependencies with all development dependencies
RUN npm ci

# create uploads directory
RUN mkdir -p uploads

# copy source code
COPY . .

# expose application port
EXPOSE 3000

# start application in development mode with hot-reload
CMD ["npm", "run", "start:staging"] 