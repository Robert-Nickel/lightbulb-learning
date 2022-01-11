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
  def apply(u: GroupInfo) = Json.obj("groupName" -> u.groupName, "usermail" -> u.usermail, "userpool" -> u.userpool)

case class GroupInfo(groupName: String, usermail: String, userpool: String) {}
