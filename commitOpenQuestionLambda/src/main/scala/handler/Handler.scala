package handler

import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.lambda.runtime.events.{
  APIGatewayV2HTTPEvent,
  APIGatewayV2HTTPResponse
}

class Handler {
  def handle(
      apiGatewayEvent: APIGatewayV2HTTPEvent,
      context: Context
  ): APIGatewayV2HTTPResponse = {
    println(s"body = ${apiGatewayEvent.getBody()}")
    APIGatewayV2HTTPResponse
      .builder()
      .withStatusCode(200)
      .withBody("okay")
      .build()
  }
}
