package handler

import little.json.*
import little.json.Implicits.{ *, given }
import scala.language.implicitConversions

given openQuestionCommittedEventToJson: JsonOutput[OpenQuestionCommittedEvent] with
  def apply(o: OpenQuestionCommittedEvent) = Json.obj(
    "id" -> o.id,
    "questionText" -> o.questionText,
    "answerText" -> o.answerText,
    "challengePoolID" -> o.challengePoolID)

case class OpenQuestionCommittedEvent(id: String, questionText: String, answerText: String, challengePoolID: String, version: Int = 1)
