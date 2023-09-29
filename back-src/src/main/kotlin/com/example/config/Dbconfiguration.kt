package com.example.config

import org.jetbrains.exposed.spring.SpringTransactionManager
import org.jetbrains.exposed.sql.DatabaseConfig
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.transaction.PlatformTransactionManager
import org.springframework.transaction.annotation.EnableTransactionManagement
import org.springframework.transaction.annotation.TransactionManagementConfigurer
import javax.sql.DataSource

@Configuration
@EnableTransactionManagement
class Dbconfiguration(val dataSource: DataSource): TransactionManagementConfigurer {
    @Bean
    fun databaseConfig() = DatabaseConfig {
        useNestedTransactions = true
    }
    @Bean
    override fun annotationDrivenTransactionManager(): PlatformTransactionManager = SpringTransactionManager(dataSource)
}