package handler

import java.util.HashMap;
import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.lambda.runtime.events.{
  APIGatewayV2HTTPEvent,
  APIGatewayV2HTTPResponse
}

import com.amazonaws.services.cognitoidp.{AWSCognitoIdentityProvider, AWSCognitoIdentityProviderClientBuilder};
import com.amazonaws.services.cognitoidp.model.{GetGroupRequest,AdminListGroupsForUserRequest};

import little.json.*
import little.json.Implicits.{*, given}
import upickle.default._

import scala.jdk.CollectionConverters.MapHasAsJava
import scala.collection.JavaConverters._
import scala.language.implicitConversions

class Handler {
  def handle(
      apiGatewayEvent: APIGatewayV2HTTPEvent,
      context: Context
  ): APIGatewayV2HTTPResponse = {
    if (apiGatewayEvent != null && apiGatewayEvent.getBody() != null) {
      val eventBody = apiGatewayEvent.getBody()
      val getGroupInfo = Json.parse(eventBody).as[GetGroupInfo]

      println("getGroupInfo:")
      println(getGroupInfo)
      val userPoolId = getGroupInfo.userPoolId
      val userName = getGroupInfo.userName

      val identityProvider =
        AWSCognitoIdentityProviderClientBuilder.defaultClient()

      val adminListGroupsForUserRequest = (
        AdminListGroupsForUserRequest()
          .withUserPoolId(userPoolId)
          .withUsername(userName)
      )

      val adminlistGroupsResult =
        identityProvider.adminListGroupsForUser(adminListGroupsForUserRequest)
      
      val userGroups: List[String] = adminlistGroupsResult
        .getGroups()
        .asScala
        .toList
        .map(
          userGroup => userGroup.getGroupName()
        )

      return APIGatewayV2HTTPResponse
        .builder()
        .withStatusCode(200)
        .withBody(write(userGroups))
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
