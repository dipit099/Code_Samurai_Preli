# Samurai Train Service Backend

## Overview
The Samurai Train Service Backend is a backend system developed to manage train schedules, ticket purchases, route planning, and wallet transactions for the Samurai Train service in Bangladesh. This project aims to enhance the efficiency and functionality of the train service to meet the increasing demands of commuters. Pdf link: 
[ Preliminary Round Problem Statement.pdf](https://github.com/dipit099/Code_Samurai_Preli/files/14231344/Updated.Preliminary.Round.Problem.Statement.pdf)

## Features
- **User Management**: Allows users to register and manage their accounts, including wallet balances.
- **Station Management**: Enables the management of train stations, including location information and associated services.
- **Train Management**: Facilitates the management of trains, schedules, routes, and seating capacity.
- **Ticketing System**: Provides users with the ability to purchase tickets using their wallet balance.
- **Route Planning**: Offers users the option to plan optimal routes between stations based on cost or time.

## Technologies Used
- **Programming Language**: JavaScript (Node.js)
- **Web Framework**: Express.js
- **Database**: PostgreSQL
- **Containerization**: Docker

## Setup Instructions
1. Clone the repository to your local machine.
2. Install Node.js and npm if not already installed.
3. Install PostgreSQL database and configure the connection settings.
4. Set up environment variables required for the application (e.g., database connection string, API keys).
5. Run `npm install` to install dependencies.
7. Start the application using `nodemon index`.
8. The application should now be accessible at `http://localhost:8000`.

## How to Run the Application with Docker

1. Make sure `Docker Desktop` is installed on your machine.
2. Open a terminal or command prompt and navigate to the root directory of the project.
3. Build the Docker image using the following command: `docker compose up -d --build`
4.  After the image is built successfully, check the list of Docker images using: `docker images`
5. The application should now be accessible at `http://localhost:8000`.
6. To stop the running containers, use: `docker compose down`

   
Make sure to follow these steps in sequence to successfully run the application using Docker.

## Data Models

### User

The user object represents the person using the app. It includes:

- `user_id`: User's ID
- `user_name`: User's full name
- `balance`: User's wallet balance

### Station

The station object represents a metro station where trains can stop. It includes:

- `station_id`: Station's ID
- `station_name`: Station's name
- `longitude`: Longitude coordinate
- `latitude`: Latitude coordinate

### Train

The train object represents a metro train and contains a series of stations. It includes:

- `train_id`: Train's ID
- `train_name`: Train's name
- `capacity`: Seating capacity
- `stops`: List of stops including station ID, arrival time, departure time, and fare.


## Contributors

Team Name: CODE_CRUSADERS

Institution Name: Bangladesh University of Engineering and Technology (BUET)

Email:-

sdipit099@gmail.com (Dipit Saha)

altairahad001@gmail.com (Abrar Jahin)

hmdmehedi10107@gmail.com (Md. Mehedi Hasan)






















