package handler

import little.json.*
import little.json.Implicits.{ *, given }
import scala.language.implicitConversions

given jsonToGroupInfo: JsonInput[GroupInfo] with
  def apply(json: JsonValue) = GroupInfo(
    json("groupName"),
    json("userName"),
    json("userPoolId")
    )

case class GroupInfo(groupName: String, userName: String, userPoolId: String) {}
