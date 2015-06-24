FROM golang:latest

RUN go get github.com/ant0ine/go-json-rest/rest
RUN go get github.com/jinzhu/gorm

COPY . /go

WORKDIR /go

RUN go install github.com/mlapierre/reader_api

ENTRYPOINT /go/bin/reader_api

EXPOSE 3001
