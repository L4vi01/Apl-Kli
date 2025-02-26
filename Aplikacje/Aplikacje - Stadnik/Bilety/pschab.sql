-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 26, 2025 at 08:43 AM
-- Wersja serwera: 10.4.28-MariaDB
-- Wersja PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pschab`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `reservations`
--

CREATE TABLE `reservations` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `screening_id` int(11) NOT NULL,
  `seat_row` int(11) NOT NULL,
  `seat_number` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reservations`
--

INSERT INTO `reservations` (`id`, `user_id`, `screening_id`, `seat_row`, `seat_number`) VALUES
(1, 3, 1, 9, 9),
(2, 3, 1, 10, 7),
(3, 3, 1, 10, 9),
(4, 3, 1, 10, 10),
(5, 3, 2, 1, 7),
(6, 3, 2, 1, 8),
(7, 3, 2, 1, 9),
(8, 3, 2, 1, 10),
(9, 3, 1, 0, 27),
(10, 3, 1, 0, 28),
(11, 3, 1, 0, 29),
(12, 3, 1, 0, 129),
(13, 3, 1, 0, 130),
(14, 3, 1, 0, 131),
(15, 3, 4, 0, 150),
(16, 3, 4, 0, 151),
(17, 3, 4, 0, 152),
(18, 3, 4, 0, 292),
(19, 3, 4, 0, 293),
(20, 3, 3, 0, 45),
(21, 3, 3, 0, 85),
(22, 3, 3, 0, 188);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `screenings`
--

CREATE TABLE `screenings` (
  `id` int(11) NOT NULL,
  `movie_title` varchar(100) NOT NULL,
  `screening_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `screenings`
--

INSERT INTO `screenings` (`id`, `movie_title`, `screening_time`) VALUES
(1, 'Film 1', '2025-02-26 18:00:00'),
(2, 'Film 2', '2025-02-26 20:00:00'),
(3, 'Film 3', '2025-02-27 18:00:00'),
(4, 'Film 4', '2025-02-27 20:00:00');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone_number` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `phone_number`) VALUES
(1, 'pawel', '$2y$10$503Lopi7oVTWBdrSNP66de9JjZORbmw/vE31s1VDJ2odmNsabf5cS', '123'),
(2, 'pschab', '$2y$10$1ehE1ylvU8ZjZp04aRkZUugzSCcUIdkQeGFafYxj7hcBNQLf6JJRG', '1234'),
(3, 'abc', '$2y$10$yvojVPAWWplwJ27Hfq2EquZSGcpkBt5Z21dYMsvYpM8MLuZIzzoAa', '1251');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `screening_id` (`screening_id`,`seat_row`,`seat_number`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeksy dla tabeli `screenings`
--
ALTER TABLE `screenings`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `screenings`
--
ALTER TABLE `screenings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `reservations_ibfk_2` FOREIGN KEY (`screening_id`) REFERENCES `screenings` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
