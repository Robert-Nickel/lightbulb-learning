package handler

import little.json.*
import little.json.Implicits.{ *, given }
import scala.language.implicitConversions

given jsonToCustomHttpInfo: JsonInput[CustomHttpResponse] with
  def apply(json: JsonValue) = CustomHttpResponse(
    json("statusCode"),
    json("statusText")
    )

case class CustomHttpResponse(statusCode: String, statusText: String)
