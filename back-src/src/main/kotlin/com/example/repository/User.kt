package com.example.repository

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.jodatime.datetime
import java.time.LocalDateTime

object User:Table() {
    val userId = long("user_id").autoIncrement()
    val email = varchar("email",319)
    val password = varchar("password",128)
    val salt = varchar("salt",4)
    val insertAt = datetime("insert_at").default(LocalDateTime.now())
    val createAt = datetime("create_at").default(LocalDateTime.now())
    override val primaryKey = PrimaryKey(userId, name = "hoge")
}