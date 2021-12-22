val scala3Version = "3.0.1"

lazy val root = project
  .in(file("."))
  .settings(
    name := "scala3-simple",
    version := "0.1.0",
    scalaVersion := scala3Version,
    libraryDependencies += "com.novocode" % "junit-interface" % "0.11" % "test",
    libraryDependencies ++= Seq(
      "com.amazonaws" % "aws-lambda-java-core" % "1.2.1",
      "com.amazonaws" % "aws-lambda-java-events" % "3.9.0",
      "com.amazonaws" % "aws-java-sdk-dynamodb" % "1.12.106",
      "com.github.losizm" %% "little-json" % "9.0.0",
      "software.amazon.awssdk" % "lambda" % "2.17.101",
      "software.amazon.awssdk" % "apache-client" % "2.17.96"
    )
  )
assemblyJarName in assembly := "lambda-scala-seed.jar"

assemblyMergeStrategy in assembly := {
  case PathList("META-INF", xs @ _*) => MergeStrategy.discard
  case x                             => MergeStrategy.first
}
