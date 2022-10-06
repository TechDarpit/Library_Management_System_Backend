-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Sep 16, 2022 at 12:43 PM
-- Server version: 8.0.30-0ubuntu0.20.04.2
-- PHP Version: 8.0.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `Library`
--

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `id` int NOT NULL,
  `Title` varchar(255) DEFAULT NULL,
  `AuthorName` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `totalQauntity` int DEFAULT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `status` int DEFAULT '1',
  `created-at` datetime NOT NULL,
  `modified_at` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`id`, `Title`, `AuthorName`, `image`, `quantity`, `totalQauntity`, `Description`, `status`, `created-at`, `modified_at`, `deletedAt`) VALUES
(1, 'Avengers: The Man Who Stole Tomorrow', 'Len Wein', 'images/686793.jpg', 11, 11, 'Avenger Story book was written by three different writter and i give them credit but right now i\'m busy so i will update as soon as possible see u next time :) ', 3, '2022-09-09 05:32:14', '2022-09-09 12:11:46', NULL),
(2, 'Doctor Strange: Nightmare', 'William Rotslr', 'images/drstrange.jpg', 47, 50, 'This is comic book about Doctor Strange Nightmare this book show and open the multiverse is really exist in real life ', 3, '2022-09-09 05:37:25', '2022-09-09 09:26:29', NULL),
(3, 'Amazing Spider-Man: Crime Campaign', 'Paul Kupperberg', 'images/spidermoon.jpeg', 49, 50, 'Spiderman comit too many unofficial crime cause of loki hypnotise him must readed book ever', 1, '2022-09-09 05:40:11', '2022-09-09 10:45:02', NULL),
(4, ' Captain America: Holocaust for Hire', 'Ron Goulart', 'images/Avenger.jpg', 10, 50, 'Spiderman comit too many unofficial crime cause of loki hypnotise him must readed book ever', 1, '2022-09-09 09:23:16', '2022-09-09 09:23:16', NULL),
(5, 'Avengers: Assemble', 'Stan lee', 'images/spidermoon.jpeg', 15, 15, 'Avengers Assemble is famous dioulogue of Captain America ', 1, '2022-09-12 04:43:45', '2022-09-12 04:43:45', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `registers`
--

CREATE TABLE `registers` (
  `id` int NOT NULL,
  `issue_date` datetime NOT NULL,
  `modified_at` datetime NOT NULL,
  `return_at` datetime DEFAULT NULL,
  `bookId` int DEFAULT NULL,
  `UserId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `registers`
--

INSERT INTO `registers` (`id`, `issue_date`, `modified_at`, `return_at`, `bookId`, `UserId`) VALUES
(2, '2022-09-09 09:03:57', '2022-09-09 09:03:57', '2022-09-09 09:20:25', 2, 2),
(3, '2022-09-09 09:19:19', '2022-09-09 09:19:19', '2022-09-09 09:20:42', 2, 3),
(4, '2022-09-09 09:25:57', '2022-09-09 09:25:57', NULL, 2, 3),
(5, '2022-09-09 10:44:41', '2022-09-09 10:44:41', '2022-09-09 10:45:01', 3, 3);

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `id` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `mobile` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `birthDate` datetime DEFAULT NULL,
  `role` int DEFAULT '2',
  `status` int DEFAULT '1',
  `created-at` datetime NOT NULL,
  `modified_at` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`id`, `name`, `email`, `password`, `mobile`, `gender`, `birthDate`, `role`, `status`, `created-at`, `modified_at`, `deletedAt`) VALUES
(1, 'Admin', 'Admin@gmail.com', '$2b$12$MuC60LlbIXzErLIw4dvze.eF5e5aXHA2RJ1ahHDTWr1Jqqc0KG5R2', '', 'male', '2001-03-29 18:30:00', 1, 1, '2022-09-09 05:12:40', '2022-09-09 05:12:40', NULL),
(2, 'Chauhan Vishal', 'ChauhanVishal898081@gmail.com', '$2b$12$DUFb4VJX4Bu/vfwbCvKgCuxyBZjc9DxdkqcSLDI/C8s8IWwnx7/LO', '', 'male', '2001-03-29 18:30:00', 1, 1, '2022-09-09 05:17:16', '2022-09-09 06:05:44', NULL),
(3, 'Darpitbhai', 'darpit@gmail.com', '$2b$12$BVbUM2p88AVqy.uUVNJ9du0USOqEFxKZFVT0fFOez04iEUtMDHUFe', '', 'male', '2001-03-29 18:30:00', 2, 1, '2022-09-09 09:15:02', '2022-09-09 10:50:16', NULL),
(4, 'Jatan', 'jatan@gmail.com', '$2b$12$oXaKLbfjbBPeHADkTwb0aOfFphwpXyOE0IX5EVROtejcdJe24Mz.y', '', 'male', '2001-03-29 18:30:00', 2, 1, '2022-09-12 09:47:26', '2022-09-12 09:47:26', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `registers`
--
ALTER TABLE `registers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `registers_UserId_bookId_unique` (`bookId`,`UserId`) USING BTREE,
  ADD KEY `UserId` (`UserId`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `registers`
--
ALTER TABLE `registers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `registers`
--
ALTER TABLE `registers`
  ADD CONSTRAINT `registers_ibfk_33` FOREIGN KEY (`bookId`) REFERENCES `books` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `registers_ibfk_34` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
