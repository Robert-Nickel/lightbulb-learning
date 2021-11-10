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

    val parsed_body = Json.parse(apiGatewayEvent.getBody())
    val body = parsed_body.as[Body]

    println(s"body= ${body}")

    val id  = body.id
    
    println(s"id = ${id}")

    val client: AmazonDynamoDB = AmazonDynamoDBClientBuilder.standard().build();
    
    val dynamoDB: DynamoDB = new DynamoDB(client);
    val table: Table = dynamoDB.getTable("OpenQuestionDraft-xiukk7jyfnexpd66hqxfnnrmem-prod");

    val item: Item = new Item().withPrimaryKey("Id", id)

    val headers = new HashMap[String, String]()
    headers.put("Access-Control-Allow-Headers", "Content-Type")
    headers.put("Access-Control-Allow-Origin", "*")
    headers.put("Access-Control-Allow-Methods", "*")

    println(s"body = ${apiGatewayEvent.getBody()}")
    APIGatewayV2HTTPResponse
      .builder()
      .withStatusCode(200)
      .withHeaders(headers)
      .withBody(s"${apiGatewayEvent.getBody()}")
      .build()
  }
}
