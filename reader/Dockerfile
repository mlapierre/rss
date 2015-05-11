FROM node:0.12.2

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install
RUN npm install -g bower 

COPY bower.json /usr/src/app/
COPY .bowerrc /usr/src/app/
RUN bower install --allow-root

COPY . /usr/src/app

CMD [ "npm", "start" ]

EXPOSE 8000
