package handler

import java.util.HashMap;
import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.lambda.runtime.events.{
  APIGatewayV2HTTPEvent,
  SQSEvent,
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
      sqsEvent: SQSEvent,
      context: Context
  ): APIGatewayV2HTTPResponse = {
    println("sqsEvent")
    println(sqsEvent)

    if (sqsEvent != null /* && sqsEvent.getBody() != null */) {
      // TODO: groupName (TenantID) verschluesseln!
      // TODO: userAnzahl von Gruppe herausfinden
      val records = sqsEvent.getRecords()
      println("RECORDS:")
      println(records)
      var eventBody = ""
      if(records.size() < 1) {
        println("record length less than 1! ")
        return APIGatewayV2HTTPResponse
        .builder()
        .withStatusCode(500)
        .withBody("ERROR - no records provided")
        .build()
      } else {
      eventBody = Json.parse(records.get(0).getBody()).as[AddUserRecord]
      // eventBody = eventBody.getMessage()
      println("eventBody:")
      println(eventBody)
      val groupInfo = Json.parse(eventBody).as[GroupInfo] 
      
      println("eventBody: ")
      println(eventBody)

      println("groupInfo")
      println(groupInfo)

      val groupName = groupInfo.groupName   // Testgruppe5
      val userName = groupInfo.userName     // piskdvzrxkglrtskft@kvhrw.com
      val userPoolId = groupInfo.userPoolId // eu-central-1_bAc9VMMys

      println("groupName: " + groupName)

      val httpClient = ApacheHttpClient.builder().build();
      val cognitoClient = CognitoIdentityProviderClient
        .builder()
        .region(Region.EU_CENTRAL_1)
        .httpClient(httpClient)
        .build()

      println(";)")

      val adminAddUserToGroupRequest = (
        AdminAddUserToGroupRequest
          .builder()
          .userPoolId(userPoolId)
          .groupName(groupName)
          .username(userName)
          .build()
      )

      println(":-P")

      val response = cognitoClient.adminAddUserToGroup(adminAddUserToGroupRequest)
      println("response:" + response)

      return APIGatewayV2HTTPResponse
        .builder()
        .withStatusCode(200)
        .withBody(response.toString())
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
        .withBody("hi2"/* s"${sqsEvent.getBody()} " */)
        .build()
    }
  }

}
