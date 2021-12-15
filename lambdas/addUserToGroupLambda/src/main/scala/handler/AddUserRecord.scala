package handler

import little.json.*
import little.json.Implicits.{ *, given }
import scala.language.implicitConversions

given jsonToAddUserRecord: JsonInput[AddUserRecord] with
  def apply(json: JsonValue) = AddUserRecord(
      json("Type"),
      json("MessageId"),
      json("SequenceNumber"),
      json("TopicArn"),
      json("Message"),
      json("Timestamp"),
      json("UnsubscribeURL"),
      json("MessageAttributes")
  )

case class AddUserRecord(
  Type: String, 
  MessageId: String, 
  SequenceNumber: String,
  TopicArn: String, 
  Message: String,
  Timestamp: String, 
  UnsubscribeURL: String,
  MessageAttributes: String
  ) {
}
