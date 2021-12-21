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
  AdminAddUserToGroupRequest
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
    val roleType = groupInfoMap.get("roleType")
    
    println("GroupName:" + groupName)

      // TODO: groupName (TenantID) verschluesseln!
      // TODO: userAnzahl von Gruppe herausfinden
    
      // val groupName = groupInfo.groupName   // Testgruppe5
      // val userName = groupInfo.userName     // piskdvzrxkglrtskft@kvhrw.com
      // val userPoolId = groupInfo.userPoolId // eu-central-1_bAc9VMMys

      // println("groupName: " + groupName)

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

    val response = cognitoClient.adminAddUserToGroup(adminAddUserToGroupRequest)

    println("response:" + response)
  }

}
