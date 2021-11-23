package handler

import java.util.HashMap;
import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.lambda.runtime.events.{
  APIGatewayV2HTTPEvent,
  APIGatewayV2HTTPResponse
}
import scala.language.implicitConversions
import software.amazon.awssdk.services.sns.SnsClient;
import software.amazon.awssdk.services.sns.model.PublishRequest;
import software.amazon.awssdk.services.sns.model.PublishResponse;
import software.amazon.awssdk.regions.Region;

import little.json.*
import little.json.Implicits.{ *, given }

class Handler {
  def handle(
      apiGatewayEvent: APIGatewayV2HTTPEvent,
      context: Context
  ): APIGatewayV2HTTPResponse = {
    if(apiGatewayEvent != null && apiGatewayEvent.getBody() != null) {
      val eventBody = apiGatewayEvent.getBody()
      val openQuestionDraft = Json.parse(eventBody).as[OpenQuestionDraft]
      val openQuestionCommittedEvent = openQuestionDraft.toOpenQuestionCommittedEvent()
      publish(openQuestionCommittedEvent)

      return APIGatewayV2HTTPResponse
        .builder()
        .withStatusCode(200)
        .withBody("{success: true}")
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

  def publish(openQuestionCommittedEvent: OpenQuestionCommittedEvent): PublishResponse = {
    val snsClient = SnsClient.builder()
      .region(Region.EU_CENTRAL_1)
      .build()
    val request: PublishRequest = PublishRequest.builder()
      .message(s"${Json.toJson(openQuestionCommittedEvent)}")
      .messageGroupId(openQuestionCommittedEvent.id)
      .topicArn("arn:aws:sns:eu-central-1:532688539985:open-question-topic.fifo")
      .build()  

    // TODO: catch SnsException
    println("Publishing the request now...")
    val result = snsClient.publish(request)
    println(s"publish result = ${snsClient.publish(request)}");
    return result
  }
}