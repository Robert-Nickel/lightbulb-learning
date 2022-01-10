package handler

import little.json.*
import little.json.Implicits.{ *, given }
import scala.language.implicitConversions


given updateGroupInfoToJson: JsonOutput[UpdateGroupInfo] with
  def apply(u: UpdateGroupInfo) = Json.obj(
  "groupName" -> u.groupName, 
  "userName" -> u.userName,
  "userPoolId" -> u.userPoolId,
  "roleType" -> u.roleType
  )


given jsonToUpdateGroupInfo: JsonInput[UpdateGroupInfo] with
  def apply(json: JsonValue) = UpdateGroupInfo(
    json("groupName"),
    json("userName"),
    json("userPoolId"),
    json("roleType"),
    )

case class UpdateGroupInfo(groupName: String, userName: String, userPoolId: String, roleType: String) {
   def toUpdateGroupEvent() = 
    UpdateGroupEvent(groupName, userName, userPoolId)
}
