package handler

import java.util.HashMap;
import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.lambda.runtime.events.{
  APIGatewayV2HTTPEvent,
  APIGatewayV2HTTPResponse
}
import little.json.*
import little.json.Implicits.{ *, given }
import scala.language.implicitConversions

case class Body(id: String)

given jsonToBody: JsonInput[Body] with 
  def apply(json: JsonValue) = Body(json("id"))


class Handler {

  def handle(
      apiGatewayEvent: APIGatewayV2HTTPEvent,
      context: Context
  ): APIGatewayV2HTTPResponse = {
    if(apiGatewayEvent != null && apiGatewayEvent.getBody() != null) {
      println("Handling request with apiGatewayEvent")
      println(s"apiGatewayEvent = ${apiGatewayEvent}")
      val event = apiGatewayEvent.getBody()
      println(s"event = ${event}")
      val parsed_body = Json.parse(event)
      println(s"parsed_body = ${parsed_body}")
      val body = parsed_body.as[Body]
      println(s"body = ${body}")
      val id  = body.id
      println(s"id = ${id}")

      val client: AmazonDynamoDB = AmazonDynamoDBClientBuilder.standard().build();
      val dynamoDB: DynamoDB = new DynamoDB(client);
      val tableName = "OpenQuestionDraft-bz5o7yvpwbdijnygi4gs2ns4ui-prod";
      val table: Table = dynamoDB.getTable(tableName);
      val item: Item = table.getItem("id", id);

      println(s"item = ${item}")

      return APIGatewayV2HTTPResponse
        .builder()
        .withStatusCode(200)
        .withBody(s"${item}")
        .build()
    } else {
       /* For OPTIONS call*/
      println("Handling request with apiGatewayEvent == null or apiGatewayEvent.body == null")
      return APIGatewayV2HTTPResponse
            .builder()
            .withStatusCode(200)
            .withBody(s"${apiGatewayEvent.getBody()}")
            .build()
      }
  }
}