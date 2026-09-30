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
    charity_goal DECIMAL(12,2) NOT NULL,
    current_progress DECIMAL(12,2) DEFAULT 0.00,
    is_suspended TINYINT(1) DEFAULT 0,
    FOREIGN KEY (org_id) REFERENCES charity_organisations(org_id),
    FOREIGN KEY (category_id) REFERENCES event_categories(category_id)
);

INSERT INTO event_categories (category_name) 
VALUES 
('Charity Gala'),
('Charity Auction'),
('Fun Run'),
('Material Donation'),
('Community Service'),
('Volunteer Program');

INSERT INTO charity_organisations(org_name, mission, contact_email, contact_phone, address)
VALUES
(
    'Hope Community Foundation',
    'Dedicated to supporting homeless families and providing food assistance for low-income households in the city.',
    'contact@hopecommunity.org',
    '0411-222-333',
    '123 Oak Street, Downtown District'
),
(
    'Bright Future Children Aid',
    'Focus on improving education and mental health support for disadvantaged children and teenagers.',
    'info@brightfuture.org',
    '0411-333-444',
    '456 Pine Avenue, North Suburb'
),
(
    'Green Earth Volunteer Alliance',
    'Committed to environmental protection, community greening and sustainable lifestyle promotion.',
    'team@greenearth.org',
    '0411-444-555',
    '789 Maple Road, West Park Area'
),
(
    'Senior Care Welfare Society',
    'Provide daily care and companion services for elderly citizens living alone in the community.',
    'support@seniorcare.org',
    '0411-555-666',
    NULL
);

INSERT INTO charity_events(org_id, category_id, event_name, event_description, event_purpose, event_date, location, ticket_price, charity_goal, current_progress, is_suspended)
VALUES
(
    1, 3, 'City 5K Fun Run 2026',
    'A 5-kilometer casual running event open to citizens of all ages, with on-site snack stations and souvenir medals.',
    'Raise public awareness of poverty issues; all ticket revenue will be used for community food bank supplies.',
    '2026-10-15 08:00:00',
    'Central City Park',
    25.00,
    15000.00,
    6200.00,
    0
),
(
    1, 1, 'Annual Charity Gala Dinner',
    'Formal banquet night with charity speeches, silent auction sessions and live band performance.',
    'Raise funds for the winter heating assistance program for low-income families.',
    '2026-11-02 18:30:00',
    'Grand City Ballroom',
    120.00,
    30000.00,
    11500.00,
    0
),
(
    2, 2, 'Children Charity Art Auction',
    'Auction of paintings and handcrafts donated by primary school students, plus artworks from local artists.',
    'All proceeds will be used to build reading rooms in rural primary schools and purchase children books.',
    '2026-10-22 19:00:00',
    'City Art Center Hall',
    0.00,
    8000.00,
    3400.00,
    0
),
(
    2, 4, 'Winter Warmth Material Donation',
    'Collect winter coats, scarves, gloves and stationery for children in mountainous areas.',
    'Gather living supplies and learning materials to help children in remote areas get through the cold winter.',
    '2026-11-20 09:00:00',
    'Bright Future Center Lobby',
    0.00,
    5000.00,
    4200.00,
    0
),
(
    3, 6, 'River Bank Cleaning Volunteer Program',
    'One-day volunteer activity to clean up garbage along the city river bank; tools and training provided.',
    'Improve the river ecological environment, and promote public awareness of environmental protection.',
    '2026-10-08 09:30:00',
    'Riverside Green Park',
    0.00,
    4000.00,
    1800.00,
    0
),
(
    3, 5, 'Community Greening Service Day',
    'Volunteers help plant flowers and trees in old residential areas, and teach residents gardening knowledge.',
    'Improve the living environment of old communities, and build a green and beautiful neighborhood.',
    '2026-09-10 08:30:00',
    'Old Town East Community',
    0.00,
    3500.00,
    3500.00,
    0
),
(
    4, 1, 'Charity Gala for Senior Citizens',
    'A gala with classic song performances and afternoon tea, specially prepared for local elderly residents.',
    'Enrich the spiritual life of empty-nest elderly, and raise funds for the community senior care service.',
    '2026-12-18 14:00:00',
    'Harbour View Hotel Function Room',
    15.00,
    12000.00,
    7800.00,
    0
),
(
    4, 5, 'Home Companion Volunteer Service',
    'Volunteers visit homebound elderly regularly, help with housework and provide emotional companionship.',
    'Relieve the loneliness of the elderly living alone, and help them solve daily life inconveniences.',
    '2026-11-18 09:00:00',
    'South Street Community',
    0.00,
    9500.00,
    1300.00,
    1
);
