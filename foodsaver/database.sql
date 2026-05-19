-- =============================================
-- FOOD SAVER DATABASE SETUP
-- Run this entire file in MySQL Workbench
-- =============================================

-- 1. Create the database
CREATE DATABASE IF NOT EXISTS foodsaver;
USE foodsaver;

-- 2. Users table (people who sign up on the site)
CREATE TABLE IF NOT EXISTS users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100)  NOT NULL,
  email       VARCHAR(100)  NOT NULL UNIQUE,
  password    VARCHAR(255)  NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Donations table (food donations submitted by users)
CREATE TABLE IF NOT EXISTS donations (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  user_id         INT,
  food_type       VARCHAR(100)  NOT NULL,
  quantity        VARCHAR(50)   NOT NULL,
  pickup_address  TEXT          NOT NULL,
  status          VARCHAR(50)   DEFAULT 'Pending',
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 4. Delivery agents table
CREATE TABLE IF NOT EXISTS delivery_agents (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100)  NOT NULL,
  email       VARCHAR(100)  NOT NULL UNIQUE,
  password    VARCHAR(255)  NOT NULL,
  phone       VARCHAR(20),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100),
  email       VARCHAR(100),
  message     TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- Done! Your database is ready.
-- Now go fill in your password in the .env file
-- and run: node server.js
-- =============================================
