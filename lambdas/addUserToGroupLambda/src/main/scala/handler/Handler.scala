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

import software.amazon.awssdk.core.SdkBytes;

class Handler {
  def handle(
      event: Object,
      context: Context
  ): Unit = {
    println("context")
    println(context)

    println("event:")
    println(event)

    // event is: java.util.LinkedHashMap
    
    val groupInfo = event.asInstanceOf[GroupInfo]

    // val strJson = event.toString()
    // val groupInfo = Json.parse(event.toString()).as[GroupInfo]
    println("GroupName!!!")
    println(groupInfo.groupName)

    // if(event.isInstanceof(String)) {
    //   val lambdaInputJsonStr = (String)input;
    // } else if(event.isInstanceof(Map)) {
    //   val lambdaInputJsonStr = gson.toJson((Map)input);
    // }

    if (event != null /* && sqsEvent.getBody() != null */) {
      // TODO: groupName (TenantID) verschluesseln!
      // TODO: userAnzahl von Gruppe herausfinden
      // val records = event.getRecords()
      // if(records.size() < 1) {
      //   println("record length less than 1! ")
      //   return APIGatewayV2HTTPResponse
      //   .builder()
      //   .withStatusCode(500)
      //   .withBody("ERROR - no records provided")
      //   .build()
      // } else {
      // println("the first record is:")
      // println(records.get(0))

      // println("getBody of first record")
      // println(records.get(0).getBody()) // THIS IS A STRING, getMessage() / ('MESSAGE') will not work...
      // also parsing into object will not work because it is no valid JSON object for ujson...
      
      // val sampleData = ujson.read(records.get(0).getBody()).str
      // println(sampleData)

     // val groupInfo = sampleData("Message")

      // var addUserRecord = Json.parse(records.get(0).getBody()).as[AddUserRecord]
      // println("addUserRecord")
      // println(addUserRecord)
      
      // var groupInfo = Json.parse(addUserRecord.Message).as[GroupInfo]
      // val json = Json.parse(records)
      // var groupInfo = (json \ "body" \ "Message")
      
          // println("groupInfo:")
          // println(groupInfo)

          // // FIXME: value getMessage is not a member of string!!
          // // val groupInfo = Json.parse(eventBody).as[GroupInfo] 
          
          // println("groupInfo")
          // println(groupInfo)

          // val groupName = groupInfo.groupName   // Testgruppe5
          // val userName = groupInfo.userName     // piskdvzrxkglrtskft@kvhrw.com
          // val userPoolId = groupInfo.userPoolId // eu-central-1_bAc9VMMys

          // println("groupName: " + groupName)

          // val httpClient = ApacheHttpClient.builder().build();
          // val cognitoClient = CognitoIdentityProviderClient
          //   .builder()
          //   .region(Region.EU_CENTRAL_1)
          //   .httpClient(httpClient)
          //   .build()

          // println(";)")

          // val adminAddUserToGroupRequest = (
          //   AdminAddUserToGroupRequest
          //     .builder()
          //     .userPoolId(userPoolId)
          //     .groupName(groupName)
          //     .username(userName)
          //     .build()
          // )

          // println(":-P")

          // val response = cognitoClient.adminAddUserToGroup(adminAddUserToGroupRequest)
          // println("response:" + response)

      // }
    }
  }

}
