# Package Tracker REST API CRUD Operations with Node.JS, Express, Socket.io, TypeScript (Version-1)
# Package Tracker Web Pages - Drive, Client, Admin Angular, Socket.io, TypeScript (Version-1)

# Download and setup

Step-1 After Pull & Build Required Images
  ```bash
    docker compose up --build -d
  ```
# Migration and db setup
Step-1: cd in to the database folder
  ```bash
      cd database
  ```

Step-2: run script to upload database values
  ```bash
      ./restore.sh
  ```

Step-3: After making changes, backup data with
  ```bash
      ./backup.sh
  ```

Step-4: clean database
  ```bash
      docker volume rm gozem-package-tracker_mongo-data
  ```