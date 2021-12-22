package handler

import java.util.HashMap;
import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.lambda.runtime.events.{
  APIGatewayV2HTTPEvent,
  SQSEvent,
  APIGatewayV2HTTPResponse
}

import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.http.apache.ApacheHttpClient;
import software.amazon.awssdk.http.SdkHttpClient;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.{
  CognitoIdentityProviderException,
  AdminAddUserToGroupRequest,
  ListUsersInGroupRequest
};


import scala.collection.JavaConverters._
import scala.collection.mutable.ArrayBuffer
import scala.jdk.CollectionConverters.MapHasAsJava
import scala.language.implicitConversions

class Handler {
  def handle(
      groupInfoMap: HashMap[String, String],
      context: Context
  ): Unit = {
    val groupName = groupInfoMap.get("groupName")
    val userName = groupInfoMap.get("userName")
    val userPoolId = groupInfoMap.get("userPoolId")
    
    println("GroupName:" + groupName)

      // TODO: groupName (TenantID) verschluesseln!
      // TODO: userAnzahl von Gruppe herausfinden
      // println("groupName: " + groupName)

    val httpClient = ApacheHttpClient.builder().build();
    val cognitoClient = CognitoIdentityProviderClient
      .builder()
      .region(Region.EU_CENTRAL_1)
      .httpClient(httpClient)
      .build()

    /* FIXME:
    "none of the overloaded alternatives named <init> can be accessed as a      member of software.amazon.awssdk.services.cognitoidentityprovider.model.
      [error]    |  ListUsersInGroupRequest from class Handler." 
    */

    // val listUsersInGroupRequest = (
    //   ListUsersInGroupRequest() 
    //     .builder()
    //     .userPoolId(userPoolId)
    //     .groupName(groupName)
    //     .build()
    // )

    // val listUsersInGroupResult = cognitoClient.listUsersInGroup(listUsersInGroupRequest)

    // val amountUsers = listUsersInGroupResult.getUsers().size().toString
    // println("amount users:" + amountUsers)

    val adminAddUserToGroupRequest = (
      AdminAddUserToGroupRequest
        .builder()
        .userPoolId(userPoolId)
        .groupName(groupName)
        .username(userName)
        .build()
    )

    val response = cognitoClient.adminAddUserToGroup(adminAddUserToGroupRequest)

    println("response:" + response)
  }

}