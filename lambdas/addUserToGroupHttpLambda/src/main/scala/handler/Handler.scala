package handler

import java.util.HashMap;
import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.lambda.runtime.events.{
  APIGatewayV2HTTPEvent,
  APIGatewayV2HTTPResponse
}
import software.amazon.awssdk.http.apache.ApacheHttpClient;
import scala.language.implicitConversions
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.http.SdkHttpClient;

import software.amazon.awssdk.services.lambda.LambdaClient;
import software.amazon.awssdk.services.lambda.model.InvokeRequest;
import software.amazon.awssdk.core.SdkBytes;

import little.json.*
import little.json.Implicits.{*, given}

import scala.jdk.CollectionConverters.MapHasAsJava

class Handler {
  def handle(
      apiGatewayEvent: APIGatewayV2HTTPEvent,
      context: Context
  ): APIGatewayV2HTTPResponse = {
    if (apiGatewayEvent != null && apiGatewayEvent.getBody() != null) {
      val eventBody = apiGatewayEvent.getBody()
      val groupInfo = Json.parse(eventBody).as[GroupInfo]

      println("groupInfo:")
      println(groupInfo)

      val lambdaClient = LambdaClient
      .builder()
      .region(Region.EU_CENTRAL_1)
      .httpClient(ApacheHttpClient.builder().build())
      .build()

      val lambdaRequest = (
        InvokeRequest.builder()
          .functionName("InfrastructureStack-addUserToGroupLambda87BA65DB-kMSCEsPok8P6")
          .payload(SdkBytes.fromUtf8String(Json.toJson(eventBody)))
          .build()
      )
      
      val response = lambdaClient.invoke(lambdaRequest)
      val reponseStatus = 	response.statusCode
      

      return APIGatewayV2HTTPResponse
        .builder()
        .withStatusCode(reponseStatus)
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
}
