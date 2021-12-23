package handler

import little.json.*
import little.json.Implicits.{ *, given }
import scala.language.implicitConversions

given jsonToGetGroupInfo: JsonInput[GetGroupInfo] with
  def apply(json: JsonValue) = GetGroupInfo(
    json("userName"),
    json("userPoolId")
    )

case class GetGroupInfo(userName: String, userPoolId: String) {}
