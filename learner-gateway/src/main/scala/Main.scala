import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.lambda.runtime.events.{APIGatewayV2HTTPEvent, APIGatewayV2HTTPResponse}

@main def hello: Unit = 
  println("Hello world!")
  println(msg)

def msg = "I was compiled by Scala 3. :)"

def handler(apiGatewayEvent: APIGatewayV2HTTPEvent, context: Context): APIGatewayV2HTTPResponse =
  println(s"body = ${apiGatewayEvent.getBody()}")
  APIGatewayV2HTTPResponse.builder()
    .withStatusCode(200)
    .withBody("okay")
    .build()