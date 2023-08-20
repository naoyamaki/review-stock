package com.example.controller

import org.springframework.web.bind.annotation.*

class UserController {
    @GetMapping("/user/")
    fun describeMyself():String {
        // セッション情報から会員情報を返却
        return "あなたの情報です"
    }
    @GetMapping("/user/{id}")
    fun describeUser(@PathVariable id:Long):String {
        // idから会員情報を返却
        return "id=" + (id as String) + "の情報です"
    }
    @PostMapping("/user/")
    fun signUp():String {
        // 会員登録処理
        // ログイン後のページへ
        return "会員登録処理してみたよ"
    }
    @DeleteMapping("/user/")
    fun deleteUser():String {
        // セッション情報から操作を行なった会員の情報を削除する処理
        return "退会したよ"
    }
    @PatchMapping("/user/")
    fun updateUser():String {
        // セッション情報とリクエストボディから会員情報を更新
        return "会員情報を更新してみたよ"
    }
}