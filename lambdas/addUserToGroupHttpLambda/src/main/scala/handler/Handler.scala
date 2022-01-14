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
import software.amazon.awssdk.services.lambda.model.{InvokeRequest, ListFunctionsRequest};
import software.amazon.awssdk.core.SdkBytes;
import java.nio.charset.StandardCharsets

import little.json.*
import little.json.Implicits.{*, given}

import scala.collection.JavaConverters._
import scala.jdk.CollectionConverters.MapHasAsJava

import java.io.StringWriter

class Handler {
  def handle(
      apiGatewayEvent: APIGatewayV2HTTPEvent,
      context: Context
  ): APIGatewayV2HTTPResponse = {
    if (apiGatewayEvent != null && apiGatewayEvent.getBody() != null) {
      val eventInfoBody = apiGatewayEvent.getBody()
      val eventInfo = Json.parse(eventInfoBody).as[EventInfo]

      println("eventInfo:")
      println(eventInfo)

      val lambdaClient = LambdaClient
      .builder()
      .region(Region.EU_CENTRAL_1)
      .httpClient(ApacheHttpClient.builder().build())
      .build()

      val jwtLambdaName = findFunctionName(lambdaClient, "InfrastructureStack-jwtHandler")
      val jwtLambdaRequest = (
        InvokeRequest.builder()
          .functionName(jwtLambdaName)
          .payload(SdkBytes.fromUtf8String(Json.toJson(eventInfoBody)))
          .build()
      )

      val jwtResponse = lambdaClient.invoke(jwtLambdaRequest)
      val parsedResponse = Json.parse(new String(jwtResponse.payload().asByteArray(), StandardCharsets.ISO_8859_1)).as[JWTResponse]

      val amountOfGroups = parsedResponse.amountOfGroups
      println("amountOfGroups:" + amountOfGroups)

      if(amountOfGroups != 0) {
            return APIGatewayV2HTTPResponse
        .builder()
        .withStatusCode(500)
        .withBody("{\"statusText\": \"User ist bereits in einer Gruppe!\"}")
        .build()
      }

      val addUserLambdaName = findFunctionName(lambdaClient, "InfrastructureStack-addUserToGroupLambda")

      println("addUserLambdaName: " + addUserLambdaName)

      val jsonGroupInfo = Json.obj(
        "groupName" ->  eventInfo.groupName, 
        "userName" -> parsedResponse.usermail,
        "userPoolId" ->  parsedResponse.userpool
      )

      val buf = StringWriter()
      val out = JsonWriter(buf)
      out.write(jsonGroupInfo)

      val lambdaRequest = (
        InvokeRequest.builder()
          .functionName(addUserLambdaName)
          .payload(SdkBytes.fromUtf8String(buf.toString))
          .build()
      )
      
      val response = lambdaClient.invoke(lambdaRequest)
      val customHttpResponseJSON = response.payload().asUtf8String()
      println("customHttpResponseJSON:")
      println(customHttpResponseJSON)

      val customHttpResponse = customHttpResponseJSON.as[CustomHttpResponse]
      // val reponseStatus = customHttpResponse.statusCode

      return APIGatewayV2HTTPResponse
        .builder()
        .withStatusCode(customHttpResponse.statusCode.toInt)
        .withBody("{statusText: " + customHttpResponse.statusText + "}")
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

  def findFunctionName(lambdaClient: LambdaClient, findFunctionName: String): String = { 
      val lambdaListFunctionsRequest = (ListFunctionsRequest.builder().build())
      val lambdaListFunctions = lambdaClient.listFunctions(lambdaListFunctionsRequest).functions()

      val validInvokeFunctions = lambdaListFunctions
        .asScala
        .filter(x => x.functionName().startsWith(findFunctionName))
        .toArray

      var lambdaName = ""
      if(validInvokeFunctions.length > 0) {
        lambdaName = validInvokeFunctions(0).functionName()
      } else {
        println("No valid invoke function found!" +  findFunctionName )
      }
      lambdaName
  }
}
