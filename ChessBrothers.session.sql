-- USERS
CREATE TABLE IF NOT EXISTS users (
    username        VARCHAR(50) PRIMARY KEY,
    firstname       VARCHAR(100),
    lastname        VARCHAR(100),
    email           VARCHAR(255) UNIQUE,
    gender          VARCHAR(20),
    password        VARCHAR(255),
    country         VARCHAR(100),
    phone           VARCHAR(30),
    city            VARCHAR(100),
    address         VARCHAR(255),
    zip             VARCHAR(20),
    latitude        DECIMAL(10, 7),
    longitude       DECIMAL(10, 7)
);

-- CHESS
CREATE TABLE IF NOT EXISTS chess (
    username     VARCHAR(50),
    elo          INT DEFAULT 1200,
    wins         INT DEFAULT 0,
    losses       INT DEFAULT 0,
    draws        INT DEFAULT 0,
    favoritetype VARCHAR(50),
    PRIMARY KEY (username),
    FOREIGN KEY (username) REFERENCES users(username)
);

-- CHESSLOCATION
CREATE TABLE IF NOT EXISTS chesslocation (
    location_id   SERIAL PRIMARY KEY,
    longitude     DECIMAL(10, 7),
    latitude      DECIMAL(10, 7),
    name          VARCHAR(255),
    location_type VARCHAR(50)
);

-- CHALLENGES
CREATE TABLE IF NOT EXISTS challenges (
    challenge_id SERIAL PRIMARY KEY,
    from_user    VARCHAR(50) NOT NULL,
    to_user      VARCHAR(50) NOT NULL,
    format       VARCHAR(50),
    location_id  INT,
    status       VARCHAR(50),
    sent_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (from_user) REFERENCES users(username),
    FOREIGN KEY (to_user)   REFERENCES users(username),
    FOREIGN KEY (location_id) REFERENCES chesslocation(location_id)
);


