r <- plumber::plumb("api.R"); r$run(port=8080, host = "0.0.0.0")

