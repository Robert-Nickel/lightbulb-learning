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
      "com.github.losizm" %% "little-json" % "9.0.0",
      "com.amazonaws" % "aws-java-sdk-cognitoidp" % "1.11.335",
      "com.lihaoyi" %% "upickle" % "1.4.3"
    )
  )
assemblyJarName in assembly := "lambda-scala-seed.jar"

assemblyMergeStrategy in assembly := {
  case PathList("META-INF", xs @ _*) => MergeStrategy.discard
  case x                             => MergeStrategy.first
}
