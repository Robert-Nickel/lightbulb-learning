package handler

import little.json.*
import little.json.Implicits.{ *, given }
import scala.language.implicitConversions

given jsonToOpenQuestionDraft: JsonInput[OpenAnswer] with
  def apply(json: JsonValue) = OpenAnswer(
    json("id"),
    json("answerText"),
    json("openquestionID"))

case class OpenAnswer(id: String, answerText: String, openquestionID: String) {
  def toOpenAnswerCommittedEvent() = 
    OpenAnswerCommittedEvent(id, answerText, openquestionID)
}
