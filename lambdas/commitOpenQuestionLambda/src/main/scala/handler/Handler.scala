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
import software.amazon.awssdk.services.sns.SnsClient;
import software.amazon.awssdk.services.sns.model.PublishRequest;
import software.amazon.awssdk.services.sns.model.PublishResponse;
import software.amazon.awssdk.regions.Region;

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

      val client: AmazonDynamoDB = AmazonDynamoDBClientBuilder.defaultClient();

      println("client built")
      val dynamoDB: DynamoDB = new DynamoDB(client);
      println("dynamoDB built")

      val tableName = "OpenQuestionDraft-bz5o7yvpwbdijnygi4gs2ns4ui-prod";
      val table: Table = dynamoDB.getTable(tableName);
      println("table built")

      val item: Item = table.getItem("id", id);

      println(s"item = ${item}")
      
      publishMessageToSNS(s"$item")


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

  def publishMessageToSNS(message: String): PublishResponse = {
    val snsClient = SnsClient.builder()
                        .region(Region.EU_CENTRAL_1)
                        .build()
    val request: PublishRequest = PublishRequest.builder()
      .message(message)
      .topicArn("arn:aws:sns:eu-central-1:532688539985:InfrastructureStack-snstopic2C4AE3C1-1M7EC73IM20IP")
      .build()  

    // TODO: catch SnsException
    println("Publishing the request now...")
    val result = snsClient.publish(request)
    println(s"publish result = ${snsClient.publish(request)}");
    return result
  }
}
