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
import scala.jdk.CollectionConverters.MapHasAsJava

import little.json.*
import little.json.Implicits.{*, given}

import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.CognitoIdentityProviderException;
import software.amazon.awssdk.services.cognitoidentityprovider.model.CreateGroupRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminUpdateUserAttributesRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AttributeType;

import software.amazon.awssdk.services.iam.model.*;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.iam.IamClient;
import software.amazon.awssdk.services.iam.model.ListRolesRequest;

import scala.collection.JavaConverters._
import scala.collection.mutable.ArrayBuffer

/* AddUserToGroup
{
   "GroupName": "string",
   "Username": "string",
   "UserPoolId": "string"  (default)
}
*/
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

      // TODO: auslesen welcher User in welcher Gruppe hinzugefuegt werden soll 
      // TODO: auslesen welche Gruppe mit welcher Rolle erstellt werden soll
      
      val eventBody = apiGatewayEvent.getBody()
      val httpClient = ApacheHttpClient.builder().build();
      val cognitoClient = CognitoIdentityProviderClient
        .builder()
        .region(Region.EU_CENTRAL_1)
        .httpClient(httpClient)
        .build()

      val customAttribute = (
        AttributeType.builder()
        .name("custom:admin_of_group")
        .value(groupName)
        .build()
      )

      val updateAdminUserAttributesRequest = (
        AdminUpdateUserAttributesRequest.builder()
          .userPoolId(userPoolId)
          .username(userName)
          .userAttributes(customAttribute)
          .build()
      )

      val responseUpdateUserAttribute = cognitoClient.adminUpdateUserAttributes(
        updateAdminUserAttributesRequest
      )

      val iamClient = IamClient
            .builder()
            .region(Region.AWS_GLOBAL)
            .httpClient(httpClient)
            .build()

      val listRolesRequest = (
        ListRolesRequest.builder()
          .pathPrefix("/")
          .build()
      )

      val roleListResponse = iamClient.listRoles(listRolesRequest)
      val filteredResultForRole = roleListResponse.roles().asScala.filter(x => x.roleName.startsWith("InfrastructureStack-lightbulblearning" + roleType + "Role")).toArray

      var roleARN = ""
      if(filteredResultForRole.length > 0) {
        roleARN = filteredResultForRole(0).arn()
      } else {
        println("no role found!")
      }

      println("roleARN:" + roleARN)  

      val request: CreateGroupRequest = (
      CreateGroupRequest.builder()
        .groupName(groupName)
        .userPoolId(userPoolId)
        .roleArn(roleARN)
        .build()
      )
      
      val response = cognitoClient.createGroup(request);
      /* CreateGroupResponse(Group=GroupType(GroupName=Testgruppe, 
      UserPoolId=eu-central-1_bAc9VMMys, LastModifiedDate=2021-12-07T09:28:10.680Z, 
      CreationDate=2021-12-07T09:28:10.680Z)) */

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
