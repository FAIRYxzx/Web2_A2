-- 创建数据库
CREATE DATABASE charityevents_db;
USE charityevents_db;

CREATE TABLE event_categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(100) NOT NULL
);

CREATE TABLE charity_organisations (
    org_id INT PRIMARY KEY AUTO_INCREMENT,
    org_name VARCHAR(200) NOT NULL,
    mission TEXT,
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20),
    address VARCHAR(255) NULL
);

CREATE TABLE charity_events (
    event_id INT PRIMARY KEY AUTO_INCREMENT,
    org_id INT NOT NULL,
    category_id INT NOT NULL,
    event_name VARCHAR(255) NOT NULL,
    event_description TEXT NOT NULL,
    event_purpose TEXT NOT NULL,
    event_date DATETIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    ticket_price DECIMAL(10,2) NOT NULL, 
    is_suspended TINYINT(1) DEFAULT 0,
    FOREIGN KEY (org_id) REFERENCES charity_organisations(org_id),
    FOREIGN KEY (category_id) REFERENCES event_categories(category_id)
);
