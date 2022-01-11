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
import software.amazon.awssdk.services.cognitoidentityprovider.model.{CognitoIdentityProviderException, CreateGroupRequest, AdminUpdateUserAttributesRequest, AttributeType};
import software.amazon.awssdk.services.iam.model.*;
import software.amazon.awssdk.services.iam.IamClient;
import software.amazon.awssdk.services.iam.model.ListRolesRequest;
import software.amazon.awssdk.services.sns.SnsClient;
import software.amazon.awssdk.services.sns.model.{MessageAttributeValue, PublishRequest, PublishResponse};

import software.amazon.awssdk.services.lambda.LambdaClient;
import software.amazon.awssdk.services.lambda.model.{InvokeRequest, ListFunctionsRequest};
import software.amazon.awssdk.core.SdkBytes;

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

      val lambdaClient = LambdaClient
          .builder()
          .region(Region.EU_CENTRAL_1)
          .httpClient(httpClient)
          .build()

      val lambdaListFunctionsRequest = (
      ListFunctionsRequest.builder()
        .build()
      )

      val lambdaListFunctions = lambdaClient.listFunctions(lambdaListFunctionsRequest).functions()

      val validInvokeFunctions = lambdaListFunctions.asScala.filter(x => x.functionName().startsWith("InfrastructureStack-addUserToGroupLambda")).toArray

      var lambdaName = ""
      if(validInvokeFunctions.length > 0) {
        lambdaName = validInvokeFunctions(0).functionName()
      } else {
        println("No valid invoke function found! [addUserToGroup]")
      }

      println("lambdaName: " + lambdaName)  
      // val lambdaName = "InfrastructureStack-addUserToGroupLambda87BA65DB-f1AgUynB3tqA"

      val lambdaRequest = (
        InvokeRequest.builder()
          .functionName(lambdaName)
          .payload(SdkBytes.fromUtf8String(Json.toJson(eventBody)))
          .build()
      )


      val request: CreateGroupRequest = (
      CreateGroupRequest.builder()
        .groupName(groupName)
        .userPoolId(userPoolId)
        .description(roleType)
        .build()
      )
      
      val response = cognitoClient.createGroup(request);
      val addUserToGroupEvent = createGroupInfo.toAddUserToGroupEvent()

      lambdaClient.invoke(lambdaRequest)

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
