FROM rails:4.2.1

RUN apt-get update && apt-get install -y nodejs --no-install-recommends && rm -rf /var/lib/apt/lists/*
RUN apt-get update && apt-get install -y mysql-client postgresql-client sqlite3 --no-install-recommends && rm -rf /var/lib/apt/lists/*
RUN apt-get update && apt-get install -y redis-server supervisor vim

COPY ./config/feeder.supervisor.conf /etc/supervisor/conf.d/feeder.conf
RUN mkdir -p /usr/src/app/log/
WORKDIR /usr/src/app

COPY Gemfile /usr/src/app/
COPY Gemfile.lock /usr/src/app/
RUN bundle install

COPY . /usr/src/app

EXPOSE 3000

CMD ["/usr/bin/supervisord","-c","/etc/supervisor/supervisord.conf"]