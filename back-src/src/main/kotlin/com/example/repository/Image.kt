package com.example.repository

import java.time.LocalDateTime
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.javatime.datetime

object Image:Table("Image") {
    val imageId = uinteger("image_id").autoIncrement()
    val type = enumerationByName("type",3, ImageType::class)
    val height = uinteger("height")
    val width = uinteger("width")
    val insertAt = datetime("insert_at").default(LocalDateTime.now())
    override val primaryKey = PrimaryKey(imageId)
}

enum class ImageType(val type: String) {
    Png("png"),
    Jpg("jpg"),
    Webp("webp")
}