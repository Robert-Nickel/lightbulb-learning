package handler

import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.lambda.runtime.events.{
  APIGatewayV2HTTPEvent,
  APIGatewayV2HTTPResponse
}
import software.amazon.awssdk.services.sns.SnsClient;

class Handler {
  def handle(
      apiGatewayEvent: APIGatewayV2HTTPEvent,
      context: Context
  ): APIGatewayV2HTTPResponse = {
    println(s"apiGatewayEvent = $apiGatewayEvent")
    return APIGatewayV2HTTPResponse
      .builder()
      .withStatusCode(200)
      .withBody(s"${apiGatewayEvent.getBody()}")
      .build()
  }
}
