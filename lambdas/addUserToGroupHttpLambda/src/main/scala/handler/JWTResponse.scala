package handler

import little.json.*
import little.json.Implicits.{ *, given }
import scala.language.implicitConversions

case class JWTResponse(usermail: String, userpool: String) {}

given jsonToJWTResponse: JsonInput[JWTResponse] with
  def apply(json: JsonValue) = JWTResponse(
    json("usermail"),
    json("userpool")
    )

