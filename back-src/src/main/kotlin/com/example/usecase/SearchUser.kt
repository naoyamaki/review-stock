package com.example.usecase

import com.example.repository.User
import org.jetbrains.exposed.sql.*
import org.springframework.transaction.annotation.Transactional

class SearchUser {
    @Transactional
    fun byId(id: Int) {
        SchemaUtils.create(User)
    }
}