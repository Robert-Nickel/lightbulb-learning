package handler

import little.json.*
import little.json.Implicits.{ *, given }
import scala.language.implicitConversions

given jsonToEventInfo: JsonInput[EventInfo] with
  def apply(json: JsonValue) = EventInfo(
    json("groupName"),
    json("roleType"),
    json("jwtToken")
    )

case class EventInfo(groupName: String, roleType: String, jwtToken: String) {}
