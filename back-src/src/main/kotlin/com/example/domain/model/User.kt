package com.example.domain.model

data class User(
  val userId:Long,
  val email:String,
  val password:String,
  val salt:String
)
