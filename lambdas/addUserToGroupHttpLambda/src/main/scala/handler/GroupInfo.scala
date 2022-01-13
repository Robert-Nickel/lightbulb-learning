package handler

import little.json.*
import little.json.Implicits.{ *, given }
import scala.language.implicitConversions

case class GroupInfo(groupname: String, usermail: String, userpool: String)

// Define how to convert GroupInfo to JsonValue
given groupInfoToJson: JsonOutput[GroupInfo] with
  def apply(g: GroupInfo) = Json.obj(
    "groupName" -> g.groupname, 
    "userName" -> g.usermail, 
    "userPoolId" -> g.userpool
  )

