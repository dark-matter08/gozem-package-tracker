target "docker-metadata-action" {}

target "build-backend" {
  inherits = ["docker-metadata-action"]
  context = "./backend"
  compose-file = "docker-compose.yml"  
  platforms = [
    "linux/amd64",
  ]
}

target "build-client" {
  inherits = ["docker-metadata-action"]
  context = "./web-client"
  compose-file = "docker-compose.yml"  
  platforms = [
    "linux/amd64",
  ]
}