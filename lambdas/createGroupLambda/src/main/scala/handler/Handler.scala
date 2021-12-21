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
import software.amazon.awssdk.services.cognitoidentityprovider.model.CreateGroupRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminUpdateUserAttributesRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AttributeType;
import software.amazon.awssdk.services.iam.model.*;
import software.amazon.awssdk.services.iam.IamClient;
import software.amazon.awssdk.services.iam.model.ListRolesRequest;
import software.amazon.awssdk.services.sns.SnsClient;
import software.amazon.awssdk.services.sns.model.{MessageAttributeValue, PublishRequest, PublishResponse};

import software.amazon.awssdk.services.lambda.LambdaClient;
import software.amazon.awssdk.services.lambda.model.InvokeRequest;
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

      val dupe = Json.toJson(eventBody)
      println("dupe:")
      println(dupe)

      val lambdaRequest = (
        InvokeRequest.builder()
          .functionName("InfrastructureStack-addUserToGroupLambda87BA65DB-kMSCEsPok8P6")
          .payload(SdkBytes.fromUtf8String(dupe))
          .build()
      )
    

      lambdaClient.invoke(lambdaRequest)

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
      val addUserToGroupEvent = createGroupInfo.toAddUserToGroupEvent()

      // TODO: call addUserToGroup lambda function


      // val publishResult = publish(addUserToGroupEvent)

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

  // def publish(
  //     addUserToGroupEvent: AddUserToGroupEvent
  // ): PublishResponse = {
  //   val httpClient = ApacheHttpClient.builder().build();

  //   val snsClient = SnsClient
  //     .builder()
  //     .httpClient(httpClient)
  //     .region(Region.EU_CENTRAL_1)
  //     .build()

  //   val MessageAttributes =
  //     Map(
  //       "TYPE" -> MessageAttributeValue.builder().stringValue("ADD_USER_TO_GROUP").dataType("String").build()
  //   )

  //   val request: PublishRequest = PublishRequest
  //     .builder()
  //     .message(s"${Json.toJson(addUserToGroupEvent)}")
  //     .messageGroupId(addUserToGroupEvent.groupName)
  //     .messageAttributes(MessageAttributes.asJava)
  //     .topicArn(
  //       "arn:aws:sns:eu-central-1:532688539985:add-user-to-group-topic.fifo"
  //     )
  //     .build()

  //   val result = snsClient.publish(request)
  //   println(s"publish result = ${snsClient.publish(request)}");
  //   return result
  // }

 
}
