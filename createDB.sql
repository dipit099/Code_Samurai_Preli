CREATE TABLE "User" (
    user_id INTEGER PRIMARY KEY,
    user_name VARCHAR(255) ,
		wallet_id INTEGER,
    balance INTEGER 
		
		
);



CREATE TABLE "Station" (
    station_id INTEGER PRIMARY KEY,
    station_name VARCHAR(255) ,
    longitude FLOAT ,
    latitude FLOAT 
);

CREATE TABLE "Train" (
    train_id INTEGER PRIMARY KEY,
    train_name VARCHAR(255),
    capacity INTEGER,
    service_start TIME CHECK (service_start >= '00:00' AND service_start <= '23:59'),
    service_ends TIME CHECK (service_ends >= '00:00' AND service_ends <= '23:59'),
    num_stations INTEGER
);



CREATE TABLE "Stops" (
    stop_id SERIAL PRIMARY KEY,
    train_id INTEGER,
    station_id INTEGER,
    arrival_time TIME CHECK (arrival_time >= '00:00' AND arrival_time <= '23:59'),
    departure_time TIME CHECK (departure_time >= '00:00' AND departure_time <= '23:59'),
    fare INTEGER    
);

