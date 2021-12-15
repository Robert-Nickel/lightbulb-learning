package handler

import little.json.*
import little.json.Implicits.{ *, given }
import scala.language.implicitConversions

given addUserToGroupEventToJson: JsonOutput[AddUserToGroupEvent] with
  def apply(e: AddUserToGroupEvent) = Json.obj(
    "groupName" -> e.groupName,
    "userName" -> e.userName,
    "userPoolId" -> e.userPoolId
  )

case class AddUserToGroupEvent(
  groupName: String, 
  userName: String, 
  userPoolId: String
)