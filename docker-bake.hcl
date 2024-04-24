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

target "build-driver" {
  inherits = ["docker-metadata-action"]
  context = "./web-driver"
  compose-file = "docker-compose.yml"  
  platforms = [
    "linux/amd64",
  ]
}

target "build-admin" {
  inherits = ["docker-metadata-action"]
  context = "./web-admin"
  compose-file = "docker-compose.yml"  
  platforms = [
    "linux/amd64",
  ]
}