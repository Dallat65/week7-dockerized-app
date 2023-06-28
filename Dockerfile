# base image
FROM node:16-alpine

#my app
WORKDIR /myapp

#install dependencies
COPY package.json .

#npm install
RUN yarn install

#copy all files
COPY . .

#expose port  
EXPOSE 3010

# start app
CMD [ "yarn", "start" ]

#run the app