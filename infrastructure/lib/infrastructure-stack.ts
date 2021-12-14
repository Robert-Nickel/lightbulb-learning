import * as lambda from '@aws-cdk/aws-lambda';
import * as path from 'path';
import { Effect, PolicyStatement } from '@aws-cdk/aws-iam';
import { CorsHttpMethod, HttpApi, HttpMethod } from '@aws-cdk/aws-apigatewayv2';
import { LambdaProxyIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';
import * as sns from '@aws-cdk/aws-sns';
import * as sqs from '@aws-cdk/aws-sqs';
import * as subs from '@aws-cdk/aws-sns-subscriptions';
import * as cdk from '@aws-cdk/core';
import * as lambdaEventSources from '@aws-cdk/aws-lambda-event-sources';
import * as iam from '@aws-cdk/aws-iam';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

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
  
    const freeRole = new iam.Role(this, 'lightbulb-learning-FreeRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      description: 'Lightbulb-Learning Free Role',
    });

    const standardRole = new iam.Role(this, 'lightbulb-learning-StandardRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      description: 'Lightbulb-Learning Standard Role',
    });

    const premiumRole = new iam.Role(this, 'lightbulb-learning-PremiumRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      description: 'Lightbulb-Learning Premium Role',
    });

    const createGroupLambda = buildLambda('createGroupLambda', this, 60);
    const createGroupPolicy = new PolicyStatement({
      resources: ["*"],
      actions: ["cognito-idp:CreateGroup", "iam:PassRole", "iam:GetRole", "iam:ListRoles"],
      effect: Effect.ALLOW
    })
    createGroupLambda.addToRolePolicy(createGroupPolicy)

    // This is currently not required, but might be very helpful soon.
    /*
    const dynamoGetItemPolicy = new PolicyStatement({
      resources: ["arn:aws:dynamodb:eu-central-1:532688539985:table/OpenQuestionDraft-bz5o7yvpwbdijnygi4gs2ns4ui-prod"],
      actions: ["dynamodb:GetItem"]
    })
    commitOpenQuestionLambda.addToRolePolicy(dynamoGetItemPolicy)
    commitOpenAnswerLambda.addToRolePolicy(dynamoGetItemPolicy)
    */

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
      integration: new LambdaProxyIntegration({
        handler: commitOpenQuestionLambda,
      }),
    });
    httpApi.addRoutes({
      path: '/commitOpenAnswer',
      methods: [HttpMethod.POST, HttpMethod.OPTIONS],
      integration: new LambdaProxyIntegration({
        handler: commitOpenAnswerLambda,
      }),
    });
    httpApi.addRoutes({
      path: '/commitOpenFeedback',
      methods: [HttpMethod.POST, HttpMethod.OPTIONS],
      integration: new LambdaProxyIntegration({
        handler: commitOpenFeedbackLambda,
      }),
    });
    httpApi.addRoutes({
      path: '/createGroup',
      methods: [HttpMethod.POST, HttpMethod.OPTIONS],
      integration: new LambdaProxyIntegration({
        handler: createGroupLambda,
      }),
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

function buildLambda(lambdaName: string, scope: cdk.Construct, timeout = 30) {
  return new lambda.Function(scope, lambdaName, {
    runtime: lambda.Runtime.JAVA_11,
    timeout: cdk.Duration.seconds(timeout),
    memorySize: 256,
    handler: 'handler.Handler::handle',
    code: lambda.Code.fromAsset(path.join(__dirname, `../../lambdas/${lambdaName}/target/scala-3.0.1/lambda-scala-seed.jar`)),
  })
}