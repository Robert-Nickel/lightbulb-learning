package handler

import java.util.HashMap;
import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.lambda.runtime.events.{
  APIGatewayV2HTTPEvent,
  APIGatewayV2HTTPResponse
}

import scala.jdk.CollectionConverters.MapHasAsJava
import scala.collection.JavaConverters._
import scala.language.implicitConversions

class Handler {
  def handle(
      apiGatewayEvent: APIGatewayV2HTTPEvent,
      context: Context
  ): Boolean = {

    print("das ist ein test")

    println("apiGatewayEvent: ")
    println(apiGatewayEvent)

    // val policyDocument = {
    // "principalId": "apigateway.amazonaws.com",
    // "policyDocument": {
    //     "Version": "2012-10-17",
    //     "Statement": [
    //         {
    //             "Action": "execute-api:Invoke",
    //             "Effect": "Allow",
    //             "Resource": "arn:aws:lambda:eu-central-1:532688539985:function:InfrastructureStack-listUserGroupsHttpLambda4B269A-F3aN1vFmu2cI"
    //         }
    //     ]
    // }
    // }

    // policyDocument
   return true
  }
}
