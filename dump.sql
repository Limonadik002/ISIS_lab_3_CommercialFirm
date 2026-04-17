-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: commercialfirm
-- ------------------------------------------------------
-- Server version	8.0.45

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
-- Table structure for table `client`
--

DROP TABLE IF EXISTS `client`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `client` (
  `Client_ID` int NOT NULL AUTO_INCREMENT,
  `LastName` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `FirstName` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `MiddleName` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TotalCarsPurchased` int DEFAULT '0',
  `Deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`Client_ID`),
  UNIQUE KEY `Phone` (`Phone`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client`
--

LOCK TABLES `client` WRITE;
/*!40000 ALTER TABLE `client` DISABLE KEYS */;
INSERT INTO `client` VALUES (1,'Иванов','Иван','Иванович','+7(901)123-45-67','ivanov.ivan@mail.ru',5,0),(2,'Петрова','Анна','Сергеевна','+7(902)234-56-78','petrova.anna@yandex.ru',4,0),(3,'Смирнов','Дмитрий','Алексеевич','+7(903)345-67-89','smirnov.d@bk.ru',3,0),(4,'Козлова','Елена','Владимировна','+7(904)456-78-90','kozlova.elena@gmail.com',3,0),(5,'Морозов','Александр','Петрович','+7(905)567-89-01','morozov.a@mail.ru',3,0),(6,'Волкова','Татьяна','Николаевна','+7(906)678-90-12','volkova.t@yandex.ru',3,0),(7,'Соколов','Андрей','Викторович','+7(907)789-01-23','sokolov.andrey@bk.ru',2,0),(8,'Михайлова','Ольга','Дмитриевна','+7(908)890-12-34','mihailova.olga@gmail.com',2,0),(9,'Новиков','Павел','Сергеевич','+7(909)901-23-45','novikov.pavel@mail.ru',2,0),(10,'Федорова','Наталья','Игоревна','+7(910)012-34-56','fedorova.n@yandex.ru',3,0),(12,'шушков','димас','серЁжевич','89289095147','stytovdima@yandex.ru',0,1);
/*!40000 ALTER TABLE `client` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `deal`
--

DROP TABLE IF EXISTS `deal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `deal` (
  `Deal_ID` int NOT NULL AUTO_INCREMENT,
  `Client_ID` int NOT NULL,
  `Employee_ID` int NOT NULL,
  `OrderStatus` tinyint(1) DEFAULT '1',
  `OrderDate` date NOT NULL,
  `Deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`Deal_ID`),
  KEY `Client_ID` (`Client_ID`),
  KEY `Employee_ID` (`Employee_ID`),
  CONSTRAINT `deal_ibfk_1` FOREIGN KEY (`Client_ID`) REFERENCES `client` (`Client_ID`) ON DELETE RESTRICT,
  CONSTRAINT `deal_ibfk_2` FOREIGN KEY (`Employee_ID`) REFERENCES `employees` (`Employee_ID`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deal`
--

LOCK TABLES `deal` WRITE;
/*!40000 ALTER TABLE `deal` DISABLE KEYS */;
INSERT INTO `deal` VALUES (1,1,2,1,'2026-01-15',0),(2,2,1,1,'2026-01-20',0),(3,3,3,0,'2026-02-01',0),(4,4,2,1,'2026-02-10',0),(5,5,4,1,'2026-02-15',0),(6,6,5,1,'2026-02-20',0),(7,7,1,0,'2026-02-25',0),(8,8,3,1,'2026-03-01',0),(9,9,4,1,'2026-03-05',0),(10,10,2,1,'2026-03-10',0),(11,1,5,1,'2026-03-12',0),(12,2,1,0,'2026-03-15',0),(13,3,3,1,'2026-03-18',0),(14,4,4,1,'2026-03-20',0),(15,5,2,1,'2026-03-22',0),(16,6,3,1,'2026-03-25',0),(17,7,5,1,'2026-03-28',0),(18,8,2,1,'2026-03-30',0),(19,9,1,1,'2026-04-02',0),(20,10,4,0,'2026-04-05',0),(21,1,3,1,'2026-04-08',0),(22,2,5,1,'2026-04-10',0),(23,3,2,1,'2026-04-12',0),(24,4,1,1,'2026-04-15',0),(25,5,4,0,'2026-04-18',0);
/*!40000 ALTER TABLE `deal` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_deal_insert` AFTER INSERT ON `deal` FOR EACH ROW BEGIN
    DECLARE total_quantity INT;
    
    IF NEW.OrderStatus = 1 THEN
        SELECT SUM(quantity) INTO total_quantity
        FROM modelsindeal
        WHERE Deal_ID = NEW.Deal_ID;
        
        UPDATE client 
        SET TotalCarsPurchased = TotalCarsPurchased + COALESCE(total_quantity, 0)
        WHERE Client_ID = NEW.Client_ID;
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_deal_update_status` AFTER UPDATE ON `deal` FOR EACH ROW BEGIN
    DECLARE total_quantity INT;
    
    IF OLD.OrderStatus = 0 AND NEW.OrderStatus = 1 THEN
        
        SELECT SUM(quantity) INTO total_quantity
        FROM modelsindeal
        WHERE Deal_ID = NEW.Deal_ID;
        
        UPDATE client 
        SET TotalCarsPurchased = TotalCarsPurchased + COALESCE(total_quantity, 0)
        WHERE Client_ID = NEW.Client_ID;
    END IF;
    
    IF OLD.OrderStatus = 1 AND NEW.OrderStatus = 0 THEN
        
        SELECT SUM(quantity) INTO total_quantity
        FROM modelsindeal
        WHERE Deal_ID = NEW.Deal_ID;
        
        UPDATE client 
        SET TotalCarsPurchased = TotalCarsPurchased - COALESCE(total_quantity, 0)
        WHERE Client_ID = NEW.Client_ID;
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `Employee_ID` int NOT NULL AUTO_INCREMENT,
  `LastName` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `FirstName` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `MiddleName` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`Employee_ID`),
  UNIQUE KEY `Phone` (`Phone`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (1,'Сидоров','Петр','Сергеевич','+7(911)123-45-67',0),(2,'Кузнецова','Мария','Алексеевна','+7(912)234-56-78',0),(3,'Васильев','Игорь','Николаевич','+7(913)345-67-89',0),(4,'Попова','Екатерина','Владимировна','+7(914)456-78-90',0),(5,'Михайлов','Денис','Олегович','+7(915)567-89-01',0),(6,'Алексеева','Светлана','Павловна','+7(916)678-90-12',0),(7,'Никитин','Артем','Сергеевич','+7(917)789-01-23',0);
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `model`
--

DROP TABLE IF EXISTS `model`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `model` (
  `Model_ID` int NOT NULL AUTO_INCREMENT,
  `PriceList_ID` int NOT NULL,
  `Color` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Model_name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Horsepower` int DEFAULT NULL,
  `Weight` int DEFAULT NULL,
  `Transmission` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `FuelType` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`Model_ID`),
  UNIQUE KEY `PriceList_ID` (`PriceList_ID`),
  CONSTRAINT `model_ibfk_1` FOREIGN KEY (`PriceList_ID`) REFERENCES `pricelist` (`PriceList_ID`) ON DELETE CASCADE,
  CONSTRAINT `model_chk_1` CHECK ((`Horsepower` > 0)),
  CONSTRAINT `model_chk_2` CHECK ((`Weight` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `model`
--

LOCK TABLES `model` WRITE;
/*!40000 ALTER TABLE `model` DISABLE KEYS */;
INSERT INTO `model` VALUES (1,1,'Белый','Toyota Camry',249,1550,'Автоматическая','Бензин',0),(2,2,'Черный','KIA Rio',123,1200,'Механическая','Бензин',0),(3,3,'Серебристый','BMW X5',340,2150,'Автоматическая','Дизель',0),(4,4,'Красный','Hyundai Solaris',123,1150,'Механическая','Бензин',0),(5,5,'Синий','Mercedes E-Class',249,1800,'Автоматическая','Дизель',0),(6,6,'Серый','Volkswagen Polo',110,1250,'Роботизированная','Бензин',0),(7,7,'Белый','Audi Q7',333,2200,'Автоматическая','Дизель',0),(8,8,'Черный','Skoda Octavia',150,1350,'Автоматическая','Бензин',0),(9,9,'Коричневый','Nissan Qashqai',144,1450,'Вариатор','Бензин',0),(10,10,'Зеленый','Volvo XC90',299,2050,'Автоматическая','Гибрид',0);
/*!40000 ALTER TABLE `model` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `modelsindeal`
--

DROP TABLE IF EXISTS `modelsindeal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `modelsindeal` (
  `Position_ID` int NOT NULL AUTO_INCREMENT,
  `Model_ID` int NOT NULL,
  `Deal_ID` int NOT NULL,
  `Quantity` int NOT NULL DEFAULT '1',
  `Deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`Position_ID`),
  KEY `Model_ID` (`Model_ID`),
  KEY `Deal_ID` (`Deal_ID`),
  CONSTRAINT `modelsindeal_ibfk_1` FOREIGN KEY (`Model_ID`) REFERENCES `model` (`Model_ID`) ON DELETE RESTRICT,
  CONSTRAINT `modelsindeal_ibfk_2` FOREIGN KEY (`Deal_ID`) REFERENCES `deal` (`Deal_ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `modelsindeal`
--

LOCK TABLES `modelsindeal` WRITE;
/*!40000 ALTER TABLE `modelsindeal` DISABLE KEYS */;
INSERT INTO `modelsindeal` VALUES (1,1,1,1,0),(2,3,1,1,0),(3,2,2,1,0),(4,4,3,2,0),(5,5,4,1,0),(6,6,5,1,0),(7,7,6,1,0),(8,8,7,1,0),(9,9,8,1,0),(10,10,9,1,0),(11,1,10,1,0),(12,2,11,2,0),(13,3,12,1,0),(14,4,13,1,0),(15,5,14,1,0),(16,6,15,1,0),(17,7,1,1,0),(18,8,2,1,0),(19,2,16,1,0),(20,4,16,1,0),(21,9,17,1,0),(22,10,18,2,0),(23,1,19,1,0),(24,3,20,1,0),(25,5,20,1,0),(26,7,21,1,0),(27,8,22,1,0),(28,9,23,1,0),(29,10,24,1,0),(30,2,25,1,0);
/*!40000 ALTER TABLE `modelsindeal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pricelist`
--

DROP TABLE IF EXISTS `pricelist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pricelist` (
  `PriceList_ID` int NOT NULL AUTO_INCREMENT,
  `Price` decimal(12,2) NOT NULL,
  `Deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`PriceList_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pricelist`
--

LOCK TABLES `pricelist` WRITE;
/*!40000 ALTER TABLE `pricelist` DISABLE KEYS */;
INSERT INTO `pricelist` VALUES (1,2500000.00,0),(2,1800000.00,0),(3,3200000.00,0),(4,1500000.00,0),(5,4500000.00,0),(6,2200000.00,0),(7,3800000.00,0),(8,1700000.00,0),(9,2900000.00,0),(10,4100000.00,0);
/*!40000 ALTER TABLE `pricelist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier_archive`
--

DROP TABLE IF EXISTS `supplier_archive`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier_archive` (
  `archive_id` int NOT NULL AUTO_INCREMENT,
  `Supplier_ID` int NOT NULL,
  `Name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Address` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Deleted_Date` datetime DEFAULT NULL,
  `Archived_Date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`archive_id`),
  UNIQUE KEY `Name` (`Name`),
  UNIQUE KEY `Address` (`Address`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier_archive`
--

LOCK TABLES `supplier_archive` WRITE;
/*!40000 ALTER TABLE `supplier_archive` DISABLE KEYS */;
INSERT INTO `supplier_archive` VALUES (1,1,'ООО \"АвтоИмпорт\"','г. Москва, ул. Ленина, д. 10','2026-03-20 16:47:42','2026-03-20 16:48:14'),(2,3,'ИП \"Немецкие авто\"','г. Москва, ул. Тверская, д. 5','2026-03-20 16:47:42','2026-03-20 16:48:14'),(3,6,'ООО \"Американские авто\"','г. Москва, ул. Новый Арбат, д. 15','2026-03-20 16:47:42','2026-03-20 16:48:14');
/*!40000 ALTER TABLE `supplier_archive` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplieroffer`
--

DROP TABLE IF EXISTS `supplieroffer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplieroffer` (
  `Offer_ID` int NOT NULL AUTO_INCREMENT,
  `Model_ID` int NOT NULL,
  `Supplier_ID` int NOT NULL,
  `Deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`Offer_ID`),
  KEY `Model_ID` (`Model_ID`),
  KEY `Supplier_ID` (`Supplier_ID`),
  CONSTRAINT `supplieroffer_ibfk_1` FOREIGN KEY (`Model_ID`) REFERENCES `model` (`Model_ID`) ON DELETE CASCADE,
  CONSTRAINT `supplieroffer_ibfk_2` FOREIGN KEY (`Supplier_ID`) REFERENCES `suppliers` (`Supplier_ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplieroffer`
--

LOCK TABLES `supplieroffer` WRITE;
/*!40000 ALTER TABLE `supplieroffer` DISABLE KEYS */;
INSERT INTO `supplieroffer` VALUES (1,1,2,0),(2,2,4,0),(3,3,3,1),(4,4,4,0),(5,5,3,1),(6,6,1,1),(7,7,3,1),(8,8,1,1),(9,9,5,0),(10,10,5,0),(11,1,1,1),(12,2,1,1),(13,3,1,1),(14,4,1,1),(15,5,1,1);
/*!40000 ALTER TABLE `supplieroffer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suppliers` (
  `Supplier_ID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Address` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Deleted` tinyint(1) DEFAULT '0',
  `Deleted_Date` datetime DEFAULT NULL,
  PRIMARY KEY (`Supplier_ID`),
  UNIQUE KEY `Name` (`Name`),
  UNIQUE KEY `Address` (`Address`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suppliers`
--

LOCK TABLES `suppliers` WRITE;
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
INSERT INTO `suppliers` VALUES (1,'ООО \"АвтоИмпорт\"','г. Москва, ул. Ленина, д. 10',1,'2026-03-20 16:48:49'),(2,'ЗАО \"Тойота Центр\"','г. Санкт-Петербург, пр. Невский, д. 25',0,NULL),(3,'ИП \"Немецкие авто\"','г. Москва, ул. Тверская, д. 5',1,'2026-03-20 16:48:49'),(4,'ООО \"Корейские автомобили\"','г. Казань, пр. Победы, д. 100',0,NULL),(5,'АО \"Французские авто\"','г. Краснодар, ул. Северная, д. 50',0,NULL),(6,'ООО \"Американские авто\"','г. Москва, ул. Новый Арбат, д. 15',1,'2026-03-20 16:48:49'),(7,'ЗАО \"Китайский автопром\"','г. Владивосток, ул. Светланская, д. 80',0,NULL);
/*!40000 ALTER TABLE `suppliers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `отчет_о_реализации`
--

DROP TABLE IF EXISTS `отчет_о_реализации`;
/*!50001 DROP VIEW IF EXISTS `отчет_о_реализации`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `отчет_о_реализации` AS SELECT 
 1 AS `Фирма`,
 1 AS `Наименование_автомобиля`,
 1 AS `Цена`,
 1 AS `Предпродажная_подготовка`,
 1 AS `Транспортная_подготовка`,
 1 AS `Стоимость`,
 1 AS `Дата_сделки`*/;
SET character_set_client = @saved_cs_client;

--
-- Dumping events for database 'commercialfirm'
--
/*!50106 SET @save_time_zone= @@TIME_ZONE */ ;
/*!50106 DROP EVENT IF EXISTS `insert_supplier_archive` */;
DELIMITER ;;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;;
/*!50003 SET character_set_client  = utf8mb4 */ ;;
/*!50003 SET character_set_results = utf8mb4 */ ;;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;;
/*!50003 SET @saved_time_zone      = @@time_zone */ ;;
/*!50003 SET time_zone             = 'SYSTEM' */ ;;
/*!50106 CREATE*/ /*!50117 DEFINER=`root`@`localhost`*/ /*!50106 EVENT `insert_supplier_archive` ON SCHEDULE EVERY 1 MINUTE STARTS '2026-03-20 16:48:23' ON COMPLETION NOT PRESERVE ENABLE DO BEGIN
    INSERT INTO supplier_archive(
        Supplier_ID,
        Name,
        address,
        Deleted_Date,
        Archived_Date
    )
    SELECT 
        s.Supplier_ID,
        s.Name,
        s.Address,
        s.deleted_date,
        NOW()
    FROM Suppliers s
    WHERE deleted = TRUE 
      AND NOT EXISTS (
          SELECT 1 
          FROM supplier_archive sa 
          WHERE sa.Supplier_ID = s.Supplier_ID
      );
END */ ;;
/*!50003 SET time_zone             = @saved_time_zone */ ;;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;;
/*!50003 SET character_set_client  = @saved_cs_client */ ;;
/*!50003 SET character_set_results = @saved_cs_results */ ;;
/*!50003 SET collation_connection  = @saved_col_connection */ ;;
DELIMITER ;
/*!50106 SET TIME_ZONE= @save_time_zone */ ;

--
-- Dumping routines for database 'commercialfirm'
--
/*!50003 DROP PROCEDURE IF EXISTS `CountCustomerPurchases` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `CountCustomerPurchases`()
BEGIN
    UPDATE client c
    LEFT JOIN (
        SELECT 
            c2.Client_ID,
            COUNT(md.Model_ID) as CarsCount
        FROM client c2
        LEFT JOIN deal d using(Client_ID)
        LEFT JOIN modelsindeal md using(Deal_ID)
        GROUP BY c2.Client_ID
    ) stats ON c.Client_ID = stats.Client_ID
    SET c.TotalCarsPurchased = COALESCE(stats.CarsCount, 0);
    
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetCarsStatsByPriceRange` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetCarsStatsByPriceRange`(
    IN min_price DECIMAL(10,2),
    IN max_price DECIMAL(10,2)
)
BEGIN
    SELECT
        m.Model_name,
        m.color,
        m.horsepower,
        m.transmission,
        m.FuelType,
        pl.price
    FROM model m
    JOIN pricelist pl using (Pricelist_ID)
    WHERE pl.price BETWEEN min_price AND max_price
    ORDER BY pl.price;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Final view structure for view `отчет_о_реализации`
--

/*!50001 DROP VIEW IF EXISTS `отчет_о_реализации`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `отчет_о_реализации` AS select distinct `s`.`Name` AS `Фирма`,`m`.`Model_name` AS `Наименование_автомобиля`,`pl`.`Price` AS `Цена`,round((`pl`.`Price` * 0.03),2) AS `Предпродажная_подготовка`,round((`pl`.`Price` * 0.05),2) AS `Транспортная_подготовка`,round((`pl`.`Price` * 1.08),2) AS `Стоимость`,`d`.`OrderDate` AS `Дата_сделки` from (((((`suppliers` `s` join `supplieroffer` `so` on((`s`.`Supplier_ID` = `so`.`Supplier_ID`))) join `model` `m` on((`so`.`Model_ID` = `m`.`Model_ID`))) join `pricelist` `pl` on((`m`.`PriceList_ID` = `pl`.`PriceList_ID`))) join `modelsindeal` `mid` on((`so`.`Model_ID` = `mid`.`Model_ID`))) join `deal` `d` on((`mid`.`Deal_ID` = `d`.`Deal_ID`))) where (`d`.`OrderStatus` = 1) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-17 14:26:42
