package handler

import little.json.*
import little.json.Implicits.{ *, given }
import scala.language.implicitConversions

given openAnswerCommittedEventToJson: JsonOutput[OpenAnswerCommittedEvent] with
  def apply(o: OpenAnswerCommittedEvent) = Json.obj(
    "id" -> o.id,
    "answerText" -> o.answerText,
    "openquestionID" -> o.openquestionID)

case class OpenAnswerCommittedEvent(id: String, answerText: String, openquestionID: String, version: Int = 1)
