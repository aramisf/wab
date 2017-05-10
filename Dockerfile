FROM node:7.10

RUN apt-get update && apt-get -y upgrade

ENV APP_HOME /wab

WORKDIR $APP_HOME

COPY . $APP_HOME

RUN npm install

EXPOSE 8080
