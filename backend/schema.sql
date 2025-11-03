CREATE DATABASE IF NOT EXISTS events_database;

USE events_database;

CREATE TABLE IF NOT EXISTS event_groups (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  events JSON, 
  date_creation DATE NOT NULL,
  date_deletion DATE DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS events (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_req VARCHAR(255) NOT NULL,
  name TEXT NOT NULL,
  images JSON NOT NULL,
  documents JSON,
  description TEXT,
  principal_photo INT NOT NULL,
  date_creation DATE NOT NULL,
  date_event DATE NOT NULL,
  date_deletion DATE DEFAULT NULL,
  group_id INT, 
  FOREIGN KEY (group_id) REFERENCES event_groups(id) ON DELETE SET NULL
);