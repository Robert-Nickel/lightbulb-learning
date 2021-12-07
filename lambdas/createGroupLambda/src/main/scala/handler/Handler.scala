package handler

import java.util.HashMap;
import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.lambda.runtime.events.{
  APIGatewayV2HTTPEvent,
  APIGatewayV2HTTPResponse
}
import software.amazon.awssdk.http.apache.ApacheHttpClient;
import scala.language.implicitConversions
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.http.SdkHttpClient;
import scala.jdk.CollectionConverters.MapHasAsJava

import little.json.*
import little.json.Implicits.{*, given}

import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.CognitoIdentityProviderException;
import software.amazon.awssdk.services.cognitoidentityprovider.model.CreateGroupRequest;
import software.amazon.awssdk.services.iam.*;

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
      val userPoolId = "eu-central-1_bAc9VMMys"
      val eventBody = apiGatewayEvent.getBody()
      val httpClient = ApacheHttpClient.builder().build();
      val cognitoClient = CognitoIdentityProviderClient
        .builder()
        .region(Region.EU_CENTRAL_1)
        .httpClient(httpClient)
        .build()

      val request: CreateGroupRequest =   (
      CreateGroupRequest.builder()
        .groupName("Testgruppe")
        .userPoolId(userPoolId)
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
