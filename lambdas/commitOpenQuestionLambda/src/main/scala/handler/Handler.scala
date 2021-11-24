package handler

import java.util.HashMap;
import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.lambda.runtime.events.{
  APIGatewayV2HTTPEvent,
  APIGatewayV2HTTPResponse
}
import software.amazon.awssdk.http.apache.ApacheHttpClient;
import scala.language.implicitConversions
import software.amazon.awssdk.services.sns.SnsClient;
import software.amazon.awssdk.services.sns.model.PublishRequest;
import software.amazon.awssdk.services.sns.model.PublishResponse;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.http.SdkHttpClient;

import little.json.*
import little.json.Implicits.{*, given}

class Handler {
  def handle(
      apiGatewayEvent: APIGatewayV2HTTPEvent,
      context: Context
  ): APIGatewayV2HTTPResponse = {
    if (apiGatewayEvent != null && apiGatewayEvent.getBody() != null) {
      val eventBody = apiGatewayEvent.getBody()
      val openQuestionDraft = Json.parse(eventBody).as[OpenQuestionDraft]
      println("openQuestionDraft built")
      val openQuestionCommittedEvent =
        openQuestionDraft.toOpenQuestionCommittedEvent()
      println("openQuestionCommittedEvent built")
      val publishResult = publish(openQuestionCommittedEvent)
      println("publishResult built")

      return APIGatewayV2HTTPResponse
        .builder()
        .withStatusCode(200)
        .withBody("{success: true}")
        .build()
    } else {
      /* For OPTIONS call*/
      println(
        "Handling request with apiGatewayEvent == null or apiGatewayEvent.body == null"
      )
      return APIGatewayV2HTTPResponse
        .builder()
        .withStatusCode(200)
        .withBody(s"${apiGatewayEvent.getBody()}")
        .build()
    }
  }

  def publish(
      openQuestionCommittedEvent: OpenQuestionCommittedEvent
  ): PublishResponse = {
    val httpClient = ApacheHttpClient.builder().build();

    println("httpClient built")
    val snsClient = SnsClient
      .builder()
      .httpClient(httpClient)
      .region(Region.EU_CENTRAL_1)
      .build()
    println("snsClient built")

    val request: PublishRequest = PublishRequest
      .builder()
      .message(s"${Json.toJson(openQuestionCommittedEvent)}")
      .messageGroupId(openQuestionCommittedEvent.id)
      .topicArn(
        "arn:aws:sns:eu-central-1:532688539985:open-question-topic.fifo"
      )
      .build()

    println("request built")

    // TODO: catch SnsException like below
    println("Publishing the request now...")
    val result = snsClient.publish(request)
    println(s"publish result = ${snsClient.publish(request)}");
    return result

    /*try {
            PublishRequest request = PublishRequest.builder()
                .message(message)
                .topicArn(topicArn)
                .build();

            PublishResponse result = snsClient.publish(request);
            System.out.println(result.messageId() + " Message sent. Status is " + result.sdkHttpResponse().statusCode());

         } catch (SnsException e) {
            System.err.println(e.awsErrorDetails().errorMessage());
            System.exit(1);
         }*/
  }
}
