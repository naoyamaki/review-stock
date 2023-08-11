CREATE TABLE `user` (
  `user_id` int unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(319) NOT NULL,
  `password` varchar(128) NOT NULL,
  `salt` varchar(4) NOT NULL,
  `insert_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `image` (
  `image_id` int unsigned NOT NULL AUTO_INCREMENT,
  `type` enum('png','jpg','webp') NOT NULL,
  `height` smallint unsigned NOT NULL,
  `width` smallint unsigned NOT NULL,
  `insert_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`image_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `user_detail` (
  `user_id_fk` int unsigned NOT NULL,
  `name` varchar(20) NOT NULL,
  `profile` varchar(200) DEFAULT NULL,
  `image_id_fk` int unsigned DEFAULT NULL,
  `insert_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id_fk`),
  KEY `image_id_idx` (`image_id_fk`),
  CONSTRAINT `image_user_detail_id` FOREIGN KEY (`image_id_fk`) REFERENCES `image` (`image_id`),
  CONSTRAINT `user_user_detail_id` FOREIGN KEY (`user_id_fk`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `review` (
  `review_id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id_fk` int unsigned NOT NULL,
  `image_id_fk` int unsigned DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `contents` varchar(200) DEFAULT NULL,
  `publish_at` datetime DEFAULT NULL,
  `insert_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`review_id`),
  KEY `user_id_idx` (`user_id_fk`),
  KEY `image_id_idx` (`image_id_fk`),
  CONSTRAINT `image_id` FOREIGN KEY (`image_id_fk`) REFERENCES `image` (`image_id`),
  CONSTRAINT `user_id` FOREIGN KEY (`user_id_fk`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `favolite_review` (
  `user_id_fk` int unsigned NOT NULL,
  `review_di_fk` int unsigned NOT NULL,
  `insert_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id_fk`,`review_di_fk`),
  KEY `favolite_review_review_id_idx` (`review_di_fk`),
  CONSTRAINT `favolite_review_review_id` FOREIGN KEY (`review_di_fk`) REFERENCES `review` (`review_id`),
  CONSTRAINT `favolite_review_user_id` FOREIGN KEY (`user_id_fk`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

