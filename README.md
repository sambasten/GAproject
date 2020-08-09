## Global Accelerex Technical Test
This project was bootstrapped with Nodejs and Typescript and deployed to dockerhub

### Installation
You need to have [Docker](https://hub.docker.com/editions/community/docker-ce-desktop-windows) installed in host PC.

### Usage
CMD to root directory
Login to Docker hub on CLI with `docker login`
Pull the image of this project from dockerhub with the command `docker pull sambasten/gaproject:latest`
Run the pulled image to launch a container from it `docker run -it sambasten/gaproject:latest`
Visit `http://localhost:5000` on browser to view app


