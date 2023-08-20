package com.example.domain.model

data class EditingReview(
  val reviewId: Long,
  val userId: Long,
  val imageId: Long,
  val title: String,
  val contents: String
)
