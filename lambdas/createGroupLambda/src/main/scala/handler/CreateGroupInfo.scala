package handler

import little.json.*
import little.json.Implicits.{ *, given }
import scala.language.implicitConversions

given createGroupInfoToJson: JsonOutput[CreateGroupInfo] with
  def apply(u: CreateGroupInfo) = Json.obj(
  "groupName" -> u.groupName, 
  "userName" -> u.userName,
  "userPoolId" -> u.userPoolId,
  "roleType" -> u.roleType
  )


given jsonToCreateGroupInfo: JsonInput[CreateGroupInfo] with
  def apply(json: JsonValue) = CreateGroupInfo(
    json("groupName"),
    json("userName"),
    json("userPoolId"),
    json("roleType"),
    )

case class CreateGroupInfo(groupName: String, userName: String, userPoolId: String, roleType: String) {
   def toAddUserToGroupEvent() = 
    AddUserToGroupEvent(groupName, userName, userPoolId)
}
