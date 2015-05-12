FROM rails:onbuild

COPY ./config/feeder.supervisor.conf /etc/supervisor/conf.d/feeder.conf
RUN mkdir -p /usr/src/app/log/

RUN apt-get update && apt-get install -y redis-server supervisor

WORKDIR /usr/src/app

CMD ["/usr/bin/supervisord","-c","/etc/supervisor/supervisord.conf"]