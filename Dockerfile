FROM alpine:3.10

RUN apk update
RUN apk add --no-cache nodejs yarn vim

RUN yarn global add @salesforce/lwc-jest@0.5.1
# RUN yarn global add sfdx-cli@7.14.0
# RUN yarn global add prettier prettier-plugin-apex

COPY sfdxproject $ROOT/sfdxproject
