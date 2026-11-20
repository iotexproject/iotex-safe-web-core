FROM node:16-alpine
RUN apk add --no-cache libc6-compat git python3 py3-pip make g++
WORKDIR /app
COPY . .

# install deps
# --ignore-engines: js-cookie 3.0.7 declares engines.node >=20, but it is a
# browser library bundled by Next.js and never runs on this Node. The Pages
# build (iotex-web-ops safe-wallet/deploy-frontend.sh) uses the same flag.
RUN yarn install --ignore-engines && \
    yarn build && \
    yarn export

ENV NODE_ENV production

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

EXPOSE 3000

ENV PORT 3000

CMD ["yarn", "static-serve", "-p", "$PORT"]
