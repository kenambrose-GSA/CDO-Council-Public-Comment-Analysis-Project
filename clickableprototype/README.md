# CDO Special Projects Repo

## Dockerize API
```
docker build -t cdo-api .
docker run --rm -p 8080:8080 -d cdo-api #4321:8080 if local
```

## Dockerize everything

```
docker-compose build
docker-compose up -d
```

```
docker-compose down
docker-compose stop
docker-compose rm
```