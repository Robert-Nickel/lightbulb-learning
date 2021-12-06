package handler

import little.json.*
import little.json.Implicits.{ *, given }
import scala.language.implicitConversions

given jsonToOpenQuestionDraft: JsonInput[OpenFeedback] with
  def apply(json: JsonValue) = OpenFeedback(
    json("id"),
    json("feedbackText"),
    json("openanswerID"))

case class OpenFeedback(id: String, feedbackText: String, openanswerID: String) {
  def toOpenFeedbackCommittedEvent() = 
    OpenFeedbackCommittedEvent(id, feedbackText, openanswerID)
}
