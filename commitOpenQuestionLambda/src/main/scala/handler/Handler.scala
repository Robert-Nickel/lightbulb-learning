package handler

import java.util.HashMap;
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
