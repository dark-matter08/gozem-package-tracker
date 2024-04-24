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

# Access Points After Local Build

- 1: Backend BaseUrl: [`http://locahost:8004/api/v1`](http://locahost:8004/api/v1)
- 1.1: Backend - Docs: [`http://locahost:8004/docs`](http://locahost:8004/docs)
- 2: Web-Client: [`http://localhost:4200`](http://localhost:4200)
- 3: Web-Driver: [`http://localhost:4201`](http://localhost:4201)
- 4: Web-Admin: [`http://localhost:4202`](http://localhost:4202)

# Screenshots

- 1: Client Web Tracker

![Fully Tracked Package till delivery](/screenshots/Screenshot%202024-04-24%20at%2023.22.10.png "Fully Tracked Package till delivery")
![Package with unassigned delivery](/screenshots/Screenshot%202024-04-24%20at%2023.17.48.png "Package with unassigned delivery")

- 2: Driver Web Dashboard

![Driver Delivery with action buttons](/screenshots/Screenshot%202024-04-24%20at%2023.18.28.png "Driver Delivery with action buttons")

- 3: Admin Web Dashboard

![Admin home view packages and deliveries](/screenshots/Screenshot%202024-04-24%20at%2023.18.44.png "Admin home view packages and deliveries")
![Admin create package form](/screenshots/Screenshot%202024-04-24%20at%2023.19.56.png "Admin create package form")
![Admin create delivery selection form](/screenshots/Screenshot%202024-04-24%20at%2023.20.43.png "Admin create delivery selection form")




<!-- # Hosted Version Access Points

- 1: Backend BaseUrl: [`http://190.92.151.125:8004/api/v1`](http://190.92.151.125:8004/api/v1)
- 1.1: Backend - Docs: [`http://190.92.151.125:8004/docs`](http://190.92.151.125:8004/docs)
- 2: Web-Client: [`http://190.92.151.125:4200`](http://190.92.151.125:4200)
- 3: Web-Driver: [`http://190.92.151.125:4201`](http://190.92.151.125:4201)
- 4: Web-Admin: [`http://190.92.151.125:4202`](http://190.92.151.125:4202) -->