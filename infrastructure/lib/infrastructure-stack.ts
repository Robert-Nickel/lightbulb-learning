import * as lambda from '@aws-cdk/aws-lambda';
import * as path from 'path';
import { Effect, PolicyStatement } from '@aws-cdk/aws-iam';
import { CorsHttpMethod, HttpApi, HttpMethod } from '@aws-cdk/aws-apigatewayv2';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';
import * as sns from '@aws-cdk/aws-sns';
import * as sqs from '@aws-cdk/aws-sqs';
import * as subs from '@aws-cdk/aws-sns-subscriptions';
import * as cdk from '@aws-cdk/core';
import * as lambdaEventSources from '@aws-cdk/aws-lambda-event-sources';
import * as iam from '@aws-cdk/aws-iam';
import * as cognito from '@aws-cdk/aws-cognito';
import { HttpLambdaAuthorizer, HttpLambdaResponseType } from '@aws-cdk/aws-apigatewayv2-authorizers';


export class InfrastructureStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // TODO: add for each premium user an user-pool. 
    // Premium user can be identified via URL
    // const pool = new cognito.UserPool(this, 'lightbulb-learning-demo');

    const snsPublishPolicy = new PolicyStatement({
      resources: ["arn:aws:sns:eu-central-1:532688539985:open-question-topic.fifo"],
      actions: ["SNS:Publish"]
    })

    const commitOpenQuestionLambda = buildLambda('commitOpenQuestionLambda', this);
    commitOpenQuestionLambda.addToRolePolicy(snsPublishPolicy)
    const openQuestionTopic = new sns.Topic(this, 'open-question-topic', {
      topicName: 'open-question-topic',
      displayName: 'Open Question Topic',
      fifo: true,
      contentBasedDeduplication: true
    });

    const commitOpenAnswerLambda = buildLambda('commitOpenAnswerLambda', this);
    commitOpenAnswerLambda.addToRolePolicy(snsPublishPolicy)
    const openAnswerTopic = new sns.Topic(this, 'open-answer-topic', {
      topicName: 'open-answer-topic',
      displayName: 'Open Answer Topic',
      fifo: true,
      contentBasedDeduplication: true
    });

    const commitOpenFeedbackLambda = buildLambda('commitOpenFeedbackLambda', this);
    commitOpenAnswerLambda.addToRolePolicy(snsPublishPolicy)
    const openFeedbackTopic = new sns.Topic(this, 'open-feedback-topic', {
      topicName: 'open-feedback-topic',
      displayName: 'Open Feedback Topic',
      fifo: true,
      contentBasedDeduplication: true
    });

    const createOpenQuestionLambda = buildLambda('createOpenQuestionLambda', this);
    const createOpenQuestionQueue = new sqs.Queue(this, 'create-open-question-queue', { fifo: true });
    createOpenQuestionLambda.addEventSource(
      new lambdaEventSources.SqsEventSource(createOpenQuestionQueue)
    );
    openQuestionTopic.addSubscription(new subs.SqsSubscription(createOpenQuestionQueue));

    const createGroupLambda = buildLambda('createGroupLambda', this, 60, 512);
    const createGroupPolicy = new PolicyStatement({
      resources: ["*"],
      actions: ["cognito-idp:CreateGroup", "iam:PassRole", "iam:GetRole", "iam:ListRoles", "cognito-idp:AdminUpdateUserAttributes", "SNS:Publish", "lambda:InvokeFunction", "lambda:ListFunctions"],
      effect: Effect.ALLOW
    })
    createGroupLambda.addToRolePolicy(createGroupPolicy)

    const addUserToGroupLambda = buildLambda('addUserToGroupLambda', this, 60, 512);
    const addUserGroupPolicy = new PolicyStatement({
      resources: ["*"],
      actions: ["cognito-idp:AdminAddUserToGroup", "cognito-idp:ListUsersInGroup", "cognito-idp:GetGroup"],
      effect: Effect.ALLOW
    })
    addUserToGroupLambda.addToRolePolicy(addUserGroupPolicy)

    const addUserToGroupHttpLambda = buildLambda('addUserToGroupHttpLambda', this, 120)
    const addUserToGroupHttpLambdaPolicy = new PolicyStatement({
      resources: ["*"],
      actions: ["lambda:InvokeFunction", "lambda:ListFunctions"],
      effect: Effect.ALLOW
    })
    addUserToGroupHttpLambda.addToRolePolicy(addUserToGroupHttpLambdaPolicy)

    const listUserGroupsHttpLambda = buildLambda('listUserGroupsHttpLambda', this, 60)
    const listUserGroupsHttpLambdaPolicy = new PolicyStatement({
      resources: ["*"], 
      actions: ["cognito-idp:AdminListGroupsForUser"],
      effect: Effect.ALLOW
    })
    listUserGroupsHttpLambda.addToRolePolicy(listUserGroupsHttpLambdaPolicy)

    const upgradeGroupHttpLambda = buildLambda('upgradeGroupLambda', this, 60, 512)
    const upgradeGroupHttpLambdaPolicy = new PolicyStatement({
      resources: ["*"], 
      actions: ["cognito-idp:AdminListGroupsForUser",
      "cognito-idp:UpdateGroup", "iam:PassRole", "iam:GetRole", "iam:ListRoles","SNS:Publish", "cognito-idp:GetGroup", "lambda:ListFunctions", "lambda:InvokeFunction"
    ],
      effect: Effect.ALLOW
    })
    upgradeGroupHttpLambda.addToRolePolicy(upgradeGroupHttpLambdaPolicy)

    // This is currently not required, but might be very helpful soon.
    /*
    const dynamoGetItemPolicy = new PolicyStatement({
      resources: ["arn:aws:dynamodb:eu-central-1:532688539985:table/OpenQuestionDraft-bz5o7yvpwbdijnygi4gs2ns4ui-prod"],
      actions: ["dynamodb:GetItem"]
    })
    commitOpenQuestionLambda.addToRolePolicy(dynamoGetItemPolicy)
    commitOpenAnswerLambda.addToRolePolicy(dynamoGetItemPolicy)
    */

    const authHandler = buildLambdaJS('authorizationLambdaJS', this);
    const authorizerPolicy = new PolicyStatement({
      resources: ["*"], 
      actions: ["lambda:InvokeFunction"],
      effect: Effect.ALLOW
    })
    authHandler.addToRolePolicy(authorizerPolicy)
    const authorizer = new HttpLambdaAuthorizer('authorizationLambdaJS', authHandler, {
      responseTypes: [HttpLambdaResponseType.SIMPLE]
    });

    const jwtHandler = buildLambdaJS('jwtHandler', this);
    const jwtHandlerPolicy = new PolicyStatement({
      resources: ["*"], 
      actions: ["lambda:InvokeFunction"],
      effect: Effect.ALLOW
    })
    jwtHandler.addToRolePolicy(jwtHandlerPolicy)

    const getGroupInformation = buildLambdaJS('getGroupInformation', this);
    const getGroupInformationPolicy = new PolicyStatement({
      resources: ["*"], 
      actions: ["lambda:InvokeFunction", "cognito-idp:GetGroup"],
      effect: Effect.ALLOW
    })
    getGroupInformation.addToRolePolicy(getGroupInformationPolicy)

    const getGroupStatus = buildLambdaJS('getGroupStatus', this);
    const getGroupStatusPolicy = new PolicyStatement({
      resources: ["*"], 
      actions: ["lambda:InvokeFunction", "cognito-idp:GetGroup"],
      effect: Effect.ALLOW
    })
    getGroupStatus.addToRolePolicy(getGroupStatusPolicy)

    const httpApi = new HttpApi(this, 'lightbulb-learning-api-gateway', {
      /* description: 'Learning API', */
      corsPreflight: {
        allowHeaders: [
          'Content-Type',
          'x-amz-user-agent',
          'x-api-key'
        ],
        allowMethods: [
          CorsHttpMethod.OPTIONS,
          CorsHttpMethod.POST
        ],
        allowOrigins: ['*'],
      },
    });
    httpApi.addRoutes({
      path: '/commitOpenQuestion',
      methods: [HttpMethod.POST, HttpMethod.OPTIONS],
      integration: new HttpLambdaIntegration('commitOpenQuestion', commitOpenQuestionLambda,
      ),
    });
    httpApi.addRoutes({
      path: '/commitOpenAnswer',
      methods: [HttpMethod.POST, HttpMethod.OPTIONS],
      integration: new HttpLambdaIntegration('commitOpenAnswer',commitOpenAnswerLambda),
    });
    httpApi.addRoutes({
      path: '/commitOpenFeedback',
      methods: [HttpMethod.POST, HttpMethod.OPTIONS],
      integration: new HttpLambdaIntegration('commitOpenFeedback', commitOpenFeedbackLambda),
    });
    httpApi.addRoutes({
      path: '/createGroup',
      methods: [HttpMethod.POST, HttpMethod.OPTIONS],
      integration: new HttpLambdaIntegration('createGroupLambda', createGroupLambda),
    });
    httpApi.addRoutes({
      path: '/addUserToGroup',
      methods: [HttpMethod.POST, HttpMethod.OPTIONS],
      integration: new HttpLambdaIntegration('addUserToGroup', addUserToGroupHttpLambda),
    });
    httpApi.addRoutes({
      path: '/listUserGroups',
      methods: [HttpMethod.POST, HttpMethod.OPTIONS],
      integration: new HttpLambdaIntegration('listUserGroups', listUserGroupsHttpLambda),
      authorizer: authorizer,
    });
    httpApi.addRoutes({
      path: '/upgradeGroup',
      methods: [HttpMethod.POST, HttpMethod.OPTIONS],
      integration: new HttpLambdaIntegration('upgradeGroup', upgradeGroupHttpLambda),
      // authorizer: authorizer,
    });
    httpApi.addRoutes({
      path: '/authenticaterequest',
      methods: [HttpMethod.GET],
      integration: new HttpLambdaIntegration('authenticaterequest', listUserGroupsHttpLambda)
    });
    httpApi.addRoutes({
      path: '/getGroup',
      methods: [HttpMethod.POST, HttpMethod.OPTIONS],
      integration: new HttpLambdaIntegration('getGroupInformation', getGroupInformation)
    });
    httpApi.addRoutes({
      path: '/getGroupStatus',
      methods: [HttpMethod.POST, HttpMethod.OPTIONS],
      integration: new HttpLambdaIntegration('getGroupStatus', getGroupStatus)
    });

    new cdk.CfnOutput(this, 'API Gateway URL', {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      value: httpApi.url + "commitOpenQuestion",
    });
    new cdk.CfnOutput(this, 'openQuestionTopicArn', {
      value: openQuestionTopic.topicArn,
      description: 'The arn of the open-question SNS topic',
    });
    new cdk.CfnOutput(this, 'openAnswerTopicArn', {
      value: openAnswerTopic.topicArn,
      description: 'The arn of the open-answer SNS topic',
    });
    new cdk.CfnOutput(this, 'openFeedbackTopicArn', {
      value: openFeedbackTopic.topicArn,
      description: 'The arn of the open-feedback SNS topic',
    });
  }
}

function buildLambda(lambdaName: string, scope: cdk.Construct, timeout = 30, customMemorySize=256) {
  return new lambda.Function(scope, lambdaName, {
    runtime: lambda.Runtime.JAVA_11,
    timeout: cdk.Duration.seconds(timeout),
    memorySize: customMemorySize,
    handler: 'handler.Handler::handle',
    code: lambda.Code.fromAsset(path.join(__dirname, `../../lambdas/${lambdaName}/target/scala-3.0.1/lambda-scala-seed.jar`)),
  })
}

function buildLambdaJS(lambdaName: string, scope: cdk.Construct, timeout = 30, customMemorySize=256) {
  return new lambda.Function(scope, lambdaName, {
    runtime: lambda.Runtime.NODEJS_14_X,
    timeout: cdk.Duration.seconds(timeout),
    memorySize: customMemorySize,
    handler: 'index.handler',
    code: lambda.Code.fromAsset(path.join(__dirname, `../../js_lambdas/${lambdaName}`)),
  })
}
