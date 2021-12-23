## sbt project compiled with Scala 3

This Lambda is invoked, when an open-question-committed-event is published in the open-question-topic. It creates a new open question (and deletes the openQuestionDraft?) in the amplify-managed DynamoDB.

### Assembly
You can assemble the Scala 3 code to a jar by using `sbt assembly`

### Usage

This is a normal sbt project. You can compile code with `sbt compile`, run it with `sbt run`, and `sbt console` will start a Scala 3 REPL.

For more information on the sbt-dotty plugin, see the
[scala3-example-project](https://github.com/scala/scala3-example-project/blob/main/README.md).
