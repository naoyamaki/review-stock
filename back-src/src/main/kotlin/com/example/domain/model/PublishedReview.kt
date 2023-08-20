package com.example.domain.model

import java.time.LocalDateTime

data class PublishedReview(
  val reviewId: Long,
  val userId: Long,
  val imageId: Long,
  val title: String,
  val contents: String,
  val publishAt: LocalDateTime
)
