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

class Handler {
  def handle(
      apiGatewayEvent: APIGatewayV2HTTPEvent,
      context: Context
  ): APIGatewayV2HTTPResponse = {
    if (apiGatewayEvent != null && apiGatewayEvent.getBody() != null) {

      val eventBody = apiGatewayEvent.getBody()
      val createGroupInfo = Json.parse(eventBody).as[CreateGroupInfo]
      val groupName = createGroupInfo.groupName     // "Testgruppe5"
      val userName =  createGroupInfo.userName      // "piskdvzrxkglrtskft@kvhrw.com"
      val userPoolId = createGroupInfo.userPoolId   // "eu-central-1_bAc9VMMys"
      val roleType = createGroupInfo.roleType       // "Free" // Standard | Premium
      
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

      // TODO: addUserToGroupLambda with UserName

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
