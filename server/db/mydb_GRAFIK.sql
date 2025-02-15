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
-- Table structure for table `GRAFIK`
--

DROP TABLE IF EXISTS `GRAFIK`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `GRAFIK` (
  `pesel` varchar(11) NOT NULL,
  `poniedzialek` enum('NIE','TAK') NOT NULL,
  `wtorek` enum('NIE','TAK') NOT NULL,
  `sroda` enum('NIE','TAK') NOT NULL,
  `czwartek` enum('NIE','TAK') NOT NULL,
  `piatek` enum('NIE','TAK') NOT NULL,
  PRIMARY KEY (`pesel`),
  CONSTRAINT `pesel_fk_3` FOREIGN KEY (`pesel`) REFERENCES `PRACOWNICY` (`pesel`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GRAFIK`
--

LOCK TABLES `GRAFIK` WRITE;
/*!40000 ALTER TABLE `GRAFIK` DISABLE KEYS */;
INSERT INTO `GRAFIK` VALUES ('11111111111','TAK','TAK','TAK','TAK','TAK'),('22222222222','NIE','NIE','TAK','TAK','TAK'),('33333333333','NIE','TAK','NIE','NIE','NIE'),('44444444444','NIE','TAK','TAK','TAK','NIE'),('55555555555','TAK','TAK','TAK','TAK','TAK'),('66666666666','TAK','TAK','TAK','TAK','TAK');
/*!40000 ALTER TABLE `GRAFIK` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-01-19 13:02:33
