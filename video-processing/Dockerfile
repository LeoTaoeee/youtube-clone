#use node as a parent image
FROM node:18

#set working dir for container
WORKDIR /app

# Install ffmpeg in the container
RUN apt-get update && apt-get install -y ffmpeg

# Copy package.json and package-lock.json into the working directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Copy app source inside the docker image
COPY . .

# Make port 2468 available outside this container
EXPOSE 2468

# Define the command to run your app using CMD (only one CMD allowed)
CMD [ "npm", "start" ]