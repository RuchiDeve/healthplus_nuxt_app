FROM ubuntu

COPY init.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

RUN apt-get update && apt-get install -y \
    build-essential \
    libssl-dev \
    zip \
    jpegoptim optipng pngquant gifsicle \
    vim \
    unzip \
    git \
    curl

RUN curl -sL https://deb.nodesource.com/setup_14.x | bash - 
RUN apt-get install -y nodejs

RUN node --version

# create destination directory
RUN mkdir -p /app && cd /app

WORKDIR /app

RUN git clone https://dennisohere:UVDXZcyzBpabuAYPmtB7@bitbucket.org/dennisohere/healthplus_nuxt_app.git .

# RUN apk add --update npm

# RUN npm install

RUN cp ./.env.prod ./.env

# build necessary, even if no static files are needed,
# since it builds the server as well
# RUN npm run build

# expose 5000 on container
EXPOSE 5000

# set app serving to permissive / assigned
ENV NUXT_HOST=0.0.0.0
# set app port
ENV NUXT_PORT=5000

# start the app
# CMD [ "npm", "run", "start"]

CMD ["/usr/local/bin/start.sh"]