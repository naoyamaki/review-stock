package com.example.repository

import com.example.repository.UserDetail.nullable
import java.time.LocalDateTime
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.javatime.datetime

object Review:Table("Review") {
    val reviewId = uinteger("review_id")
    val userIdFk = uinteger("user_id_fk")
    val imageIdFk = uinteger("image_id_fk").nullable()
    val title = varchar("title",100)
    val contents = varchar("contents",200).nullable()
    val publishAt = datetime("publish_at").nullable()
    val insertAt = datetime("insert_at").default(LocalDateTime.now())
    val updateAt = datetime("update_at").default(LocalDateTime.now())
    override val primaryKey = PrimaryKey(reviewId)
}
