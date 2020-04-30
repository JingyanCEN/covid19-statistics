FROM node:13

WORKDIR /usr/src/app
COPY ./ ./
#RUN npm i
#RUN npm run build
#RUN node upload.js

CMD ["node","app.js"]