package com.example.repository

import java.time.LocalDateTime
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.javatime.datetime

object FavoriteReview:Table("FavoriteReview") {
    val userIdFk = uinteger("user_id_fk")
    val reviewIdFk = uinteger("review_id_fk")
    val insertAt = datetime("insert_at").default(LocalDateTime.now())
    override val primaryKey = PrimaryKey(userIdFk)
}
