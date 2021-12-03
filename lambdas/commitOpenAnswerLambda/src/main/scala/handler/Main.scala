package handler

import com.amazonaws.services.lambda.runtime.events.{
  APIGatewayV2HTTPEvent
}

@main def main = {new Handler().handle(APIGatewayV2HTTPEvent.builder().withBody("""{
    "id": "3e1e05f6-994d-4c7c-a796-cffd3c8433c0",
    "answerText": "42",
    "openquestionID": "b84719ac-208c-46f5-9d55-54bd46295ab1",
    "createdAt": "2021-11-13T17:40:06.378Z",
    "updatedAt": "2021-11-13T17:40:06.378Z",
    "_version": 2,
    "_lastChangedAt": 1636825212548,
    "_deleted": null
}""").build(), null)}