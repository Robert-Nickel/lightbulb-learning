package handler

import little.json.*
import little.json.Implicits.{ *, given }
import scala.language.implicitConversions

case class JWTResponse(usermail: String, userpool: String, amountOfGroups: Int, admin_of_group: String) {}

given jsonToJWTResponse: JsonInput[JWTResponse] with
  def apply(json: JsonValue) = JWTResponse(
    json("usermail"),
    json("userpool"),
    json("amount_of_groups"),
    json("admin_of_group")
    )

