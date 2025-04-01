DROP DATABASE IF EXISTS CallCenterDB;
CREATE DATABASE CallCenterDB;
USE CallCenterDB;


-- Teams Table
CREATE TABLE Teams (
    id_team INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL
);

-- Users Table
CREATE TABLE Users (
    id_user INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'TeamLeader', 'Agent') NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    id_team INT, 
    FOREIGN KEY (id_team) REFERENCES Teams(id_team) ON DELETE SET NULL
);


-- Clients Table
CREATE TABLE Clients (
    id_client INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL
);

-- Projects Table
CREATE TABLE Projects (
    id_project INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    id_client INT,
    FOREIGN KEY (id_client) REFERENCES Clients(id_client) ON DELETE SET NULL
);

-- Emotions Table
CREATE TABLE Emotions (
    id_emotions INT PRIMARY KEY AUTO_INCREMENT,
    happiness FLOAT,
    sadness FLOAT,
    anger FLOAT,
    neutrality FLOAT,
    text_sentiment ENUM('positive', 'negative', 'neutral'),
    text_sentiment_score FLOAT,
    overall_sentiment_score FLOAT
);

-- Calls Table
CREATE TABLE Calls (
    id_call INT PRIMARY KEY AUTO_INCREMENT,
    date DATETIME NOT NULL,
    duration INT NOT NULL,
    silence_percentage FLOAT NOT NULL,
    id_user INT,
    id_client INT,
    id_emotions INT,
    FOREIGN KEY (id_user) REFERENCES Users(id_user) ON DELETE SET NULL,
    FOREIGN KEY (id_client) REFERENCES Clients(id_client) ON DELETE SET NULL,
    FOREIGN KEY (id_emotions) REFERENCES Emotions(id_emotions) ON DELETE SET NULL
);

-- Transcripts Table
CREATE TABLE Transcripts (
    id_transcript INT PRIMARY KEY AUTO_INCREMENT,
    text TEXT NOT NULL,
    language VARCHAR(50) NOT NULL,
    num_speakers INT NOT NULL,
    id_call INT UNIQUE,
    FOREIGN KEY (id_call) REFERENCES Calls(id_call) ON DELETE CASCADE
);


-- Speaker Analysis Table
CREATE TABLE Speaker_Analysis (
    id_speaker_analysis INT PRIMARY KEY AUTO_INCREMENT,
    role ENUM('Agent', 'Client') NOT NULL,
    id_call INT,
    id_emotions INT,
    FOREIGN KEY (id_call) REFERENCES Calls(id_call) ON DELETE CASCADE,
    FOREIGN KEY (id_emotions) REFERENCES Emotions(id_emotions) ON DELETE CASCADE
);

-- Voice Table
CREATE TABLE Voice (
    id_voice INT PRIMARY KEY AUTO_INCREMENT,
    pitch FLOAT,
    pitch_std_dev FLOAT,
    loudness FLOAT,
    zcr FLOAT,
    hnr FLOAT,
    tempo FLOAT,
    id_speaker_analysis INT,
    FOREIGN KEY (id_speaker_analysis) REFERENCES Speaker_Analysis(id_speaker_analysis) ON DELETE CASCADE
);

-- Reports Table
CREATE TABLE Reports (
    id_report INT PRIMARY KEY AUTO_INCREMENT,
    path VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    id_call INT,
    FOREIGN KEY (id_call) REFERENCES Calls(id_call) ON DELETE CASCADE
);

-- Key Words Table
CREATE TABLE Key_Words (
    id_word INT PRIMARY KEY AUTO_INCREMENT,
    word VARCHAR(255) NOT NULL,
    id_report INT,
    FOREIGN KEY (id_report) REFERENCES Reports(id_report) ON DELETE CASCADE
);

-- Suggestions Table
CREATE TABLE Suggestions (
    id_suggestion INT PRIMARY KEY AUTO_INCREMENT,
    suggestion VARCHAR(255) NOT NULL,
    id_report INT,
    FOREIGN KEY (id_report) REFERENCES Reports(id_report) ON DELETE CASCADE
);