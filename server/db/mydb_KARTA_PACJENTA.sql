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
-- Table structure for table `KARTA_PACJENTA`
--

DROP TABLE IF EXISTS `KARTA_PACJENTA`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `KARTA_PACJENTA` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_lekarze_zabieg` int(11) NOT NULL,
  `pesel_pacjenta` varchar(11) NOT NULL,
  `typ_zabiegu` varchar(45) NOT NULL,
  `data_wizyty` date NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_lekarze_zabieg_UNIQUE` (`id_lekarze_zabieg`),
  KEY `pesel_pacjent_fk_idx` (`pesel_pacjenta`),
  KEY `pesel_lekarza_fk_idx` (`id_lekarze_zabieg`),
  KEY `typ_zabiegu_fk_idx` (`typ_zabiegu`),
  CONSTRAINT `id_lekarze_zabieg_fk` FOREIGN KEY (`id_lekarze_zabieg`) REFERENCES `LEKARZE_ZABIEG` (`id`),
  CONSTRAINT `typ_zabiegu_fk` FOREIGN KEY (`typ_zabiegu`) REFERENCES `ZABIEGI` (`typ`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `KARTA_PACJENTA`
--

LOCK TABLES `KARTA_PACJENTA` WRITE;
/*!40000 ALTER TABLE `KARTA_PACJENTA` DISABLE KEYS */;
INSERT INTO `KARTA_PACJENTA` VALUES (26,0,'00000000000','Badanie EKG','2020-01-20'),(27,1,'00000000000','Badanie zatok','2020-01-21'),(28,2,'43242342342','Badanie zatok','2020-01-21'),(29,3,'00000000000','Badanie zatok','2020-01-22'),(30,4,'00000000000','Badanie zatok','2020-01-22'),(31,5,'43242342342','Badanie EKG','2020-01-20'),(32,6,'00000000000','Wizyty - leczenie udaru','2020-01-28'),(33,7,'43242342342','Wizyty - leczenie udaru','2020-01-28'),(34,8,'00000000000','Wizyty - leczenie udaru','2020-02-04');
/*!40000 ALTER TABLE `KARTA_PACJENTA` ENABLE KEYS */;
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
