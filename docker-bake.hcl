bake {
  image "backend" {
    dockerfile = "./backend/Dockerfile"
    context = "."
  }

  image "client" {
    dockerfile = "./web-client/Dockerfile"
    context = "."
  }

  image "driver" {
    dockerfile = "./web-driver/Dockerfile"
    context = "."
  }

  image "admin" {
    dockerfile = "./web-admin/Dockerfile"
    context = "."
  }
}

