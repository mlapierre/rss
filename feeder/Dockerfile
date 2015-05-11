FROM rails:onbuild

RUN apt-get update && apt-get install -y redis-server supervisor

COPY ./config/feeder.supervisor.conf /etc/supervisor/conf.d/feeder.conf
RUN mkdir -p /usr/src/app/log/

CMD ["/usr/bin/supervisord","-c","/etc/supervisor/supervisord.conf"]