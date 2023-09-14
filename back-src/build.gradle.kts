import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
  war
  id("org.springframework.boot") version "3.1.1"
  id("io.spring.dependency-management") version "1.1.0"
  kotlin("jvm") version "1.7.22"
  kotlin("plugin.spring") version "1.7.22"
}

group = "com.example"
version = "0.0.1-SNAPSHOT"
java.sourceCompatibility = JavaVersion.VERSION_17

repositories {
  mavenCentral()
}

dependencies {
  implementation("org.springframework.boot:spring-boot-starter-web:3.1.1")
  implementation("org.springframework.boot:spring-boot-starter-data-redis:3.1.1")
  implementation("org.springframework.session:spring-session-data-redis:3.1.1")
  implementation("org.springframework.boot:spring-boot-starter-validation:3.1.1")
  implementation("org.jetbrains.kotlin:kotlin-reflect")
  implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
  implementation("org.jetbrains.exposed", "exposed-core", "0.43.0")
  implementation("org.jetbrains.exposed", "exposed-dao", "0.43.0")
  implementation("org.jetbrains.exposed", "exposed-jdbc", "0.43.0")
  implementation("org.jetbrains.exposed","exposed-kotlin-datetime","0.43.0")
  implementation("mysql:mysql-connector-java:8.0.33")
  providedRuntime("org.springframework.boot:spring-boot-starter-tomcat:3.1.1")
  testImplementation("org.springframework.boot:spring-boot-starter-test:3.1.1")
}

tasks.named<org.springframework.boot.gradle.tasks.run.BootRun>("bootRun") {
  args("--spring.profiles.active=bootrun")
}

tasks.withType<KotlinCompile> {
  kotlinOptions {
    freeCompilerArgs = listOf("-Xjsr305=strict")
    jvmTarget = "17"
  }
}
tasks.withType<War> {
  enabled = true
  archiveName = "ROOT.war"
}

tasks.withType<Test> {
  useJUnitPlatform()
}
