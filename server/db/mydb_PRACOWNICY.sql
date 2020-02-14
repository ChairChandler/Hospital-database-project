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
-- Table structure for table `PRACOWNICY`
--

DROP TABLE IF EXISTS `PRACOWNICY`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PRACOWNICY` (
  `pesel` varchar(11) NOT NULL,
  `imie` varchar(45) NOT NULL,
  `nazwisko` varchar(45) NOT NULL,
  `etat` varchar(45) NOT NULL,
  `data_zatrudnienia` date NOT NULL,
  `zarobki_pod` int(10) unsigned NOT NULL,
  `zarobki_dod` int(10) unsigned DEFAULT NULL,
  `zatrudniony` tinyint(4) DEFAULT '1',
  PRIMARY KEY (`pesel`),
  KEY `etat_fk_idx` (`etat`),
  KEY `placa_pod_fk_idx` (`zarobki_pod`),
  CONSTRAINT `etat_fk` FOREIGN KEY (`etat`) REFERENCES `ETATY` (`nazwa_etatu`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PRACOWNICY`
--

LOCK TABLES `PRACOWNICY` WRITE;
/*!40000 ALTER TABLE `PRACOWNICY` DISABLE KEYS */;
INSERT INTO `PRACOWNICY` VALUES ('11111111111','Adam','Lewandowski','lekarz','2020-01-19',5000,1000,1),('22222222222','Robert','Nowak','lekarz','2020-01-01',5000,500,1),('33333333333','Eryk','Kowalski','lekarz','2019-12-27',5000,3000,1),('44444444444','Bartek','Kamiński','administrator','2019-09-03',3000,0,1),('55555555555','Elżbieta','Wójcik','obsluga recepcji','2020-01-19',3000,0,1),('66666666666','Tomasz','Grodzki','sprzątacz','2020-01-19',2000,0,1);
/*!40000 ALTER TABLE `PRACOWNICY` ENABLE KEYS */;
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
