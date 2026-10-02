-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: charityevents_db
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `charity_events`
--

DROP TABLE IF EXISTS `charity_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `charity_events` (
  `event_id` int NOT NULL AUTO_INCREMENT,
  `org_id` int NOT NULL,
  `category_id` int NOT NULL,
  `event_name` varchar(255) NOT NULL,
  `event_description` text NOT NULL,
  `event_purpose` text NOT NULL,
  `event_start_datetime` datetime NOT NULL,
  `event_end_datetime` datetime DEFAULT NULL,
  `location` varchar(255) NOT NULL,
  `ticket_price` decimal(10,2) NOT NULL,
  `charity_goal` decimal(12,2) NOT NULL,
  `current_progress` decimal(12,2) DEFAULT '0.00',
  `is_suspended` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`event_id`),
  KEY `org_id` (`org_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `charity_events_ibfk_1` FOREIGN KEY (`org_id`) REFERENCES `charity_organisations` (`org_id`),
  CONSTRAINT `charity_events_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `event_categories` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `charity_events`
--

LOCK TABLES `charity_events` WRITE;
/*!40000 ALTER TABLE `charity_events` DISABLE KEYS */;
INSERT INTO `charity_events` VALUES (1,1,3,'City 5K Fun Run 2026','A 5-kilometer casual running event open to citizens of all ages, with on-site snack stations and souvenir medals.','Raise public awareness of poverty issues; all ticket revenue will be used for community food bank supplies.','2026-10-15 08:00:00','2026-10-15 12:00:00','Central City Park',25.00,15000.00,6200.00,0),(2,1,1,'Annual Charity Gala Dinner','Formal banquet night with charity speeches, silent auction sessions and live band performance.','Raise funds for the winter heating assistance program for low-income families.','2026-11-02 18:30:00','2026-11-02 22:30:00','Grand City Ballroom',120.00,30000.00,11500.00,0),(3,2,2,'Children Charity Art Auction','Auction of paintings and handcrafts donated by primary school students, plus artworks from local artists.','All proceeds will be used to build reading rooms in rural primary schools and purchase children books.','2026-10-22 19:00:00','2026-10-22 22:00:00','City Art Center Hall',0.00,8000.00,3400.00,0),(4,2,4,'Winter Warmth Material Donation','Collect winter coats, scarves, gloves and stationery for children in mountainous areas.','Gather living supplies and learning materials to help children in remote areas get through the cold winter.','2026-11-20 09:00:00','2026-11-20 17:00:00','Bright Future Center Lobby',0.00,5000.00,4200.00,0),(5,3,6,'River Bank Cleaning Volunteer Program','One-day volunteer activity to clean up garbage along the city river bank; tools and training provided.','Improve the river ecological environment, and promote public awareness of environmental protection.','2026-10-08 09:30:00','2026-10-08 15:30:00','Riverside Green Park',0.00,4000.00,1800.00,0),(6,3,5,'Community Greening Service Day','Volunteers help plant flowers and trees in old residential areas, and teach residents gardening knowledge.','Improve the living environment of old communities, and build a green and beautiful neighborhood.','2026-09-10 08:30:00','2026-09-10 16:00:00','Old Town East Community',0.00,3500.00,3500.00,0),(7,4,1,'Charity Gala for Senior Citizens','A gala with classic song performances and afternoon tea, specially prepared for local elderly residents.','Enrich the spiritual life of empty-nest elderly, and raise funds for the community senior care service.','2026-12-18 14:00:00','2026-12-18 17:30:00','Harbour View Hotel Function Room',15.00,12000.00,7800.00,0),(8,4,5,'Home Companion Volunteer Service','Volunteers visit homebound elderly regularly, help with housework and provide emotional companionship.','Relieve the loneliness of the elderly living alone, and help them solve daily life inconveniences.','2026-11-18 09:00:00','2026-11-18 12:00:00','South Street Community',0.00,9500.00,1300.00,1);
/*!40000 ALTER TABLE `charity_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `charity_organisations`
--

DROP TABLE IF EXISTS `charity_organisations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `charity_organisations` (
  `org_id` int NOT NULL AUTO_INCREMENT,
  `org_name` varchar(200) NOT NULL,
  `mission` text,
  `contact_email` varchar(100) DEFAULT NULL,
  `contact_phone` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`org_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `charity_organisations`
--

LOCK TABLES `charity_organisations` WRITE;
/*!40000 ALTER TABLE `charity_organisations` DISABLE KEYS */;
INSERT INTO `charity_organisations` VALUES (1,'Hope Community Foundation','Dedicated to supporting homeless families and providing food assistance for low-income households in the city.','contact@hopecommunity.org','0411-222-333','123 Oak Street, Downtown District'),(2,'Bright Future Children Aid','Focus on improving education and mental health support for disadvantaged children and teenagers.','info@brightfuture.org','0411-333-444','456 Pine Avenue, North Suburb'),(3,'Green Earth Volunteer Alliance','Committed to environmental protection, community greening and sustainable lifestyle promotion.','team@greenearth.org','0411-444-555','789 Maple Road, West Park Area'),(4,'Senior Care Welfare Society','Provide daily care and companion services for elderly citizens living alone in the community.','support@seniorcare.org','0411-555-666',NULL);
/*!40000 ALTER TABLE `charity_organisations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_categories`
--

DROP TABLE IF EXISTS `event_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) NOT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_categories`
--

LOCK TABLES `event_categories` WRITE;
/*!40000 ALTER TABLE `event_categories` DISABLE KEYS */;
INSERT INTO `event_categories` VALUES (1,'Charity Gala'),(2,'Charity Auction'),(3,'Fun Run'),(4,'Material Donation'),(5,'Community Service'),(6,'Volunteer Program');
/*!40000 ALTER TABLE `event_categories` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-02 22:08:53
