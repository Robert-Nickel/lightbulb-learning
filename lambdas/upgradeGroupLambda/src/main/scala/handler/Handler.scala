package handler

import java.util.HashMap;
import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.lambda.runtime.events.{
  APIGatewayV2HTTPEvent,
  APIGatewayV2HTTPResponse
}
import software.amazon.awssdk.http.apache.ApacheHttpClient;
import scala.language.implicitConversions
import software.amazon.awssdk.http.SdkHttpClient;
// import scala.jdk.CollectionConverters.MapHasAsJava

import little.json.*
import little.json.Implicits.{*, given}

import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.CognitoIdentityProviderException;
import software.amazon.awssdk.services.cognitoidentityprovider.model.UpdateGroupRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminUpdateUserAttributesRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AttributeType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.GetGroupRequest;

import software.amazon.awssdk.services.iam.model.*;
import software.amazon.awssdk.services.iam.IamClient;
import software.amazon.awssdk.services.iam.model.ListRolesRequest;
import software.amazon.awssdk.services.sns.SnsClient;
import software.amazon.awssdk.services.sns.model.{
  MessageAttributeValue,
  PublishRequest,
  PublishResponse
};
import software.amazon.awssdk.core.SdkBytes;

import scala.collection.JavaConverters._
import scala.collection.mutable.ArrayBuffer

import software.amazon.awssdk.services.lambda.LambdaClient;
import software.amazon.awssdk.services.lambda.model.{
  InvokeRequest,
  ListFunctionsRequest
};
import java.nio.charset.StandardCharsets

class Handler {
  def handle(
      apiGatewayEvent: APIGatewayV2HTTPEvent,
      context: Context
  ): APIGatewayV2HTTPResponse = {
    println("apiGatewayEvent")
    println(apiGatewayEvent)
    if (apiGatewayEvent != null && apiGatewayEvent.getBody() != null) {
      val eventInfoBody = apiGatewayEvent.getBody()
      val eventInfo = Json.parse(eventInfoBody).as[EventInfo]
      println("eventInfo")
      println(eventInfo)

      println("eventInfoBody")
      println(eventInfoBody)

      val lambdaClient = LambdaClient
        .builder()
        .region(Region.EU_CENTRAL_1)
        .httpClient(ApacheHttpClient.builder().build())
        .build()

      val jsonString = "{\"jwtToken\": " + eventInfo.jwtToken + "}";
      println(jsonString)

      val jwtLambdaName =
        findFunctionName(lambdaClient, "InfrastructureStack-jwtHandler")
      val jwtLambdaRequest = (
        InvokeRequest
          .builder()
          .functionName(jwtLambdaName)
          .payload(SdkBytes.fromUtf8String(jsonString))
          .build()
      )

      val jwtResponse = lambdaClient.invoke(jwtLambdaRequest)
      val parsedResponse = Json
        .parse(
          new String(
            jwtResponse.payload().asByteArray(),
            StandardCharsets.ISO_8859_1
          )
        )
        .as[JWTResponse]

      val admin_of_group = parsedResponse.admin_of_group;
      val userpool = parsedResponse.userpool;

      println("admin_of_group: " + admin_of_group)
      println("userpool: " + userpool)

      if (admin_of_group.length > 0) {
        val httpClient = ApacheHttpClient.builder().build();
        val cognitoClient = CognitoIdentityProviderClient
          .builder()
          .region(Region.EU_CENTRAL_1)
          .httpClient(httpClient)
          .build()

        val iamClient = IamClient
          .builder()
          .region(Region.AWS_GLOBAL)
          .httpClient(httpClient)
          .build()

        val request: UpdateGroupRequest = (
          UpdateGroupRequest
            .builder()
            .groupName(admin_of_group)
            .userPoolId(userpool)
            .description("Standard")
            .build()
        )
        val response = cognitoClient.updateGroup(request);
        // val updateGroupEvent = updateGroupInfo.toUpdateGroupEvent()

        println("HERE!!")

        return APIGatewayV2HTTPResponse
          .builder()
          .withStatusCode(200)
          .withBody(response.toString())
          .build()

      } else {
        println("No admin of group!")
        return APIGatewayV2HTTPResponse
          .builder()
          .withStatusCode(500)
          .withBody("NO ADMIN OF GROUP")
          .build()
      }

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

  def findFunctionName(
      lambdaClient: LambdaClient,
      findFunctionName: String
  ): String = {
    val lambdaListFunctionsRequest = (ListFunctionsRequest.builder().build())
    val lambdaListFunctions =
      lambdaClient.listFunctions(lambdaListFunctionsRequest).functions()

    val validInvokeFunctions = lambdaListFunctions.asScala
      .filter(x => x.functionName().startsWith(findFunctionName))
      .toArray

    var lambdaName = ""
    if (validInvokeFunctions.length > 0) {
      lambdaName = validInvokeFunctions(0).functionName()
    } else {
      println("No valid invoke function found!" + findFunctionName)
    }
    lambdaName
  }

}
