package com.example.controller

import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class BasicContoroller {
    @PostMapping("/session/")
    fun signIn():String {
        // ログインできるかチェック
        // 成功時、クッキーとKVSにセッション情報を格納して、成功後のページへ
        // 失敗時、失敗した旨を伝える
        return "ログイン試行後の結果を返却してます";
    }
    @DeleteMapping("/session/")
    fun signOut():String {
        // セッション情報を破棄して、ログアウト後のページへ
        return "ログアウトしたよ"
    }
    @GetMapping("/user/")
    fun describeUser():String {
        // セッション情報から会員情報を返却
        return "あなたの情報です"
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