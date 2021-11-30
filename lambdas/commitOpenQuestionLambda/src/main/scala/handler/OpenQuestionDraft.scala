package handler

import little.json.*
import little.json.Implicits.{ *, given }
import scala.language.implicitConversions

given jsonToOpenQuestionDraft: JsonInput[OpenQuestionDraft] with
  def apply(json: JsonValue) = OpenQuestionDraft(
    json("id"),
    json("questionText"),
    json("answerText"),
    json("challengepoolID"))

case class OpenQuestionDraft(id: String, questionText: String, answerText: String, challengepoolID: String) {
  def toOpenQuestionCommittedEvent() = 
    OpenQuestionCommittedEvent(id, questionText, answerText, challengepoolID)
}
