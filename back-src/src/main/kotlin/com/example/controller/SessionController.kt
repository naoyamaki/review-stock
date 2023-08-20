package com.example.controller

import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class SessionController {
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
}