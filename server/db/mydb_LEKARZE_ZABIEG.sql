-- MySQL dump 10.13  Distrib 8.0.18, for Linux (x86_64)
--
-- Host: localhost    Database: mydb
-- ------------------------------------------------------
-- Server version	8.0.18

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
-- Table structure for table `LEKARZE_ZABIEG`
--

DROP TABLE IF EXISTS `LEKARZE_ZABIEG`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `LEKARZE_ZABIEG` (
  `id` int(11) NOT NULL,
  `pesel` varchar(11) NOT NULL,
  `specjalizacja` varchar(45) NOT NULL,
  PRIMARY KEY (`id`,`pesel`,`specjalizacja`),
  KEY `pesel_fk_idx` (`pesel`),
  KEY `specjalizacja_fk_idx` (`specjalizacja`),
  CONSTRAINT `pesel_fk_2` FOREIGN KEY (`pesel`) REFERENCES `PRACOWNICY` (`pesel`) ON UPDATE CASCADE,
  CONSTRAINT `specjalizacja_fk_2` FOREIGN KEY (`specjalizacja`) REFERENCES `SPECJALIZACJE_LEKARZY` (`nazwa_specjalizacji`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LEKARZE_ZABIEG`
--

LOCK TABLES `LEKARZE_ZABIEG` WRITE;
/*!40000 ALTER TABLE `LEKARZE_ZABIEG` DISABLE KEYS */;
INSERT INTO `LEKARZE_ZABIEG` VALUES (0,'11111111111','kardiologia'),(5,'11111111111','kardiologia'),(6,'11111111111','kardiologia'),(7,'11111111111','kardiologia'),(8,'11111111111','kardiologia'),(3,'22222222222','laryngologia'),(4,'22222222222','laryngologia'),(1,'33333333333','laryngologia'),(2,'33333333333','laryngologia'),(6,'33333333333','neurologia'),(7,'33333333333','neurologia'),(8,'33333333333','neurologia');
/*!40000 ALTER TABLE `LEKARZE_ZABIEG` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-01-19 13:02:32
