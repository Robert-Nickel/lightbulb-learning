package handler

import little.json.*
import little.json.Implicits.{ *, given }
import scala.language.implicitConversions

given openFeedbackCommittedEventToJson: JsonOutput[OpenFeedbackCommittedEvent] with
  def apply(o: OpenFeedbackCommittedEvent) = Json.obj(
    "id" -> o.id,
    "feedbackText" -> o.feedbackText,
    "openanswerID" -> o.openanswerID)

case class OpenFeedbackCommittedEvent(id: String, feedbackText: String, openanswerID: String, version: Int = 1)
