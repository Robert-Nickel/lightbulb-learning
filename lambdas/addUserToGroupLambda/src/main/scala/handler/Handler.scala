package handler

import java.util.HashMap;
import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.lambda.runtime.events.{
  APIGatewayV2HTTPEvent,
  APIGatewayV2HTTPResponse
}
import little.json.*
import little.json.Implicits.{*, given}

import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.http.apache.ApacheHttpClient;
import software.amazon.awssdk.http.SdkHttpClient;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.{
  CognitoIdentityProviderException,
  AdminAddUserToGroupRequest
};

import scala.collection.JavaConverters._
import scala.collection.mutable.ArrayBuffer
import scala.jdk.CollectionConverters.MapHasAsJava
import scala.language.implicitConversions

class Handler {
  def handle(
      apiGatewayEvent: APIGatewayV2HTTPEvent,
      context: Context
  ): APIGatewayV2HTTPResponse = {
    if (apiGatewayEvent != null && apiGatewayEvent.getBody() != null) {
      val groupName = "Testgruppe5"
      val userName = "piskdvzrxkglrtskft@kvhrw.com"
      val userPoolId = "eu-central-1_bAc9VMMys"
      val roleType = "Free" // Standard | Premium

      // val eventBody = apiGatewayEvent.getBody()
      // val openFeedback = Json.parse(eventBody).as[OpenFeedback]

      val eventBody = apiGatewayEvent.getBody()
      val httpClient = ApacheHttpClient.builder().build();
      val cognitoClient = CognitoIdentityProviderClient
        .builder()
        .region(Region.EU_CENTRAL_1)
        .httpClient(httpClient)
        .build()

      val adminAddUserToGroupRequest = (
        AdminAddUserToGroupRequest
          .builder()
          .userPoolId(userPoolId)
          .groupName(groupName)
          .username(userName)
          .build()
      )

      println("build adminAddUserToGroupRequest")

      val response = cognitoClient.adminAddUserToGroup(adminAddUserToGroupRequest)

      println("response:" + response)

      return APIGatewayV2HTTPResponse
        .builder()
        .withStatusCode(200)
        .withBody(response.toString())
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
