package handler

import little.json.*
import little.json.Implicits.{ *, given }
import scala.language.implicitConversions

given updateGroupEventToJson: JsonOutput[UpdateGroupEvent] with
  def apply(e: UpdateGroupEvent) = Json.obj(
    "groupName" -> e.groupName,
    "userName" -> e.userName,
    "userPoolId" -> e.userPoolId
  )

case class UpdateGroupEvent(
  groupName: String, 
  userName: String, 
  userPoolId: String
)