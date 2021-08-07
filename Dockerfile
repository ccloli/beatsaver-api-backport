FROM node:14-alpine

# wtf the node image doesn't come with openssl???
RUN apk add openssl

ENV NODE_ENV=production \
    HTTP_ENABLE=true \
    HTTP_PORT=80 \
    HTTPS_ENABLE=true \
    HTTPS_PORT=443 \
    HTTPS_KEY=./beatsaver.com.key \
    HTTPS_CERT=./beatsaver.com.crt

WORKDIR /app

COPY . .

RUN npm i --production
RUN (test -f "$HTTPS_KEY" && test -f "$HTTPS_CERT") || openssl req -new -x509 -subj '/CN=beatsaver.com' -nodes -out beatsaver.com.crt -keyout beatsaver.com.key

EXPOSE 80/tcp 443/tcp

CMD ["npm", "start"]
