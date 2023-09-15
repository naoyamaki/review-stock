package com.example.repository

import java.time.LocalDateTime
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.javatime.datetime

object UserDetail:Table("UserDetail") {
    val userIdFk = uinteger("user_id_fk")
    val name = varchar("name",20)
    val profile = varchar("profile",200)
    val imageIdFk = uinteger("image_id_fk")
    val insertAt = datetime("insert_at").default(LocalDateTime.now())
    val updateAt = datetime("update_at").default(LocalDateTime.now())
    override val primaryKey = PrimaryKey(userIdFk)
}
