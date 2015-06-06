FROM postgres:9.3

#RUN mkdir -p /dbdata

#ENV PGDATA /dbdata

ENTRYPOINT ["/docker-entrypoint.sh"]

EXPOSE 5432

CMD ["postgres"]
#CMD "ENV"

# psql -U postgres -c "CREATE USER rss WITH PASSWORD 'lemmein';"
# createdb -U postgres -O rss rss_dev