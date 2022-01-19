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
import software.amazon.awssdk.services.sns.model.{MessageAttributeValue, PublishRequest, PublishResponse};
import software.amazon.awssdk.core.SdkBytes;

import scala.collection.JavaConverters._
import scala.collection.mutable.ArrayBuffer
// import scala.collection.mutable.HashMap

class Handler {
  def handle(
      apiGatewayEvent: APIGatewayV2HTTPEvent,
      context: Context
  ): APIGatewayV2HTTPResponse = {
    println("apiGatewayEvent")
    println(apiGatewayEvent)
    if (apiGatewayEvent != null && apiGatewayEvent.getBody() != null) {

      println("POST...")
      val eventBody = apiGatewayEvent.getBody()
      val updateGroupInfo = Json.parse(eventBody).as[UpdateGroupInfo]
      val groupName = updateGroupInfo.groupName     // "Testgruppe5"
      val userName =  updateGroupInfo.userName      // "piskdvzrxkglrtskft@kvhrw.com"
      val userPoolId = updateGroupInfo.userPoolId   // "eu-central-1_bAc9VMMys"
      val roleType = "Standard"

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
      UpdateGroupRequest.builder()
        .groupName(groupName)
        .userPoolId(userPoolId)
        .description(roleType)
        .build()
      )
      val response = cognitoClient.updateGroup(request);
      val updateGroupEvent = updateGroupInfo.toUpdateGroupEvent()

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