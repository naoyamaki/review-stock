package com.example.repository

import java.time.LocalDateTime
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.javatime.datetime

object User:Table("User") {
    val userId = long("user_id").autoIncrement()
    val email = varchar("email",319)
    val password = varchar("password",128)
    val salt = varchar("salt",4)
    val insertAt = datetime("insert_at").default(LocalDateTime.now())
    val createAt = datetime("create_at")
    override val primaryKey = PrimaryKey(userId)
}