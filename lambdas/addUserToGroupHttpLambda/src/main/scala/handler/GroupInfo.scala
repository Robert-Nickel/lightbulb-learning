package handler

import little.json.*
import little.json.Implicits.{ *, given }
import scala.language.implicitConversions

given jsonToGroupInfo: JsonInput[GroupInfo] with
  def apply(json: JsonValue) = GroupInfo(
    json("groupName"),
    json("usermail"),
    json("userpool")
    )

given groupInfoToJson: JsonOutput[GroupInfo] with
  def apply(g: GroupInfo) = Json.obj("groupName" -> g.groupname, "userName" -> g.usermail, "userPoolId" -> g.userpool)

case class GroupInfo(groupname: String, usermail: String, userpool: String) {}
