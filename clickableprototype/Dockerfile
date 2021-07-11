FROM alpine:3.7

FROM rocker/r-ver:4.0.4

RUN apt-get update -qq && apt-get install -y \
  libssl-dev \
  libcurl4-gnutls-dev \
  curl \
  libxt-dev \
  libssl-dev

RUN R -e "install.packages(c('dplyr', 'plumber', 'readr', 'stringr'))"

COPY . /app

EXPOSE 8080

WORKDIR /app/backend/code

ENTRYPOINT ["Rscript", "runApi.R"]