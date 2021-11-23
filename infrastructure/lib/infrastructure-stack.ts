import * as lambda from '@aws-cdk/aws-lambda';
import * as path from 'path';
import { PolicyStatement } from '@aws-cdk/aws-iam';
import { CorsHttpMethod, HttpApi, HttpMethod } from '@aws-cdk/aws-apigatewayv2';
import { LambdaProxyIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';
import * as sns from '@aws-cdk/aws-sns';
import * as sqs from '@aws-cdk/aws-sqs';
import * as subs from '@aws-cdk/aws-sns-subscriptions';
import * as cdk from '@aws-cdk/core';
import * as amplify from '@aws-cdk/aws-amplify';
import * as codebuild from '@aws-cdk/aws-codebuild';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // const topic = new sns.Topic(this, 'sns-topic', {
    //   displayName: 'My SNS topic',
    // });

    // URLs von API Gateway haben sich geaendert wenn `cdk destroy`
    const amplifyApp = new amplify.App(this, 'MyApp5', {
      sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
        owner: 'Lightbulb-Learning',
        repository: 'lightbulb-learning',
        oauthToken: cdk.SecretValue.secretsManager('github-oauth-token')
      }),
      buildSpec: codebuild.BuildSpec.fromObjectToYaml({ // Alternatively add a `amplify.yml` to the repo
        version: '1.0',
        appRoot: "app",
        frontend: {
          phases: {
            preBuild: {
              commands: [
                'nvm install 17',
                'npm install'
              ]
            },
            build: {
              commands: [
                'npm run build'
              ]
            }
          },
          artifacts: {
            baseDirectory: '/public',
            files:
            - '**/*'
          }
        },
      })
    });

    const master = amplifyApp.addBranch('main');

    const commitOpenQuestionLambda = new lambda.Function(this, 'commitOpenQuestionLambda', {
      runtime: lambda.Runtime.JAVA_11,
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      handler: 'handler.Handler::handle',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../lambdas/commitOpenQuestionLambda/target/scala-3.0.1/lambda-scala-seed.jar')),
    });

    const createOpenQuestionLambda = new lambda.Function(this, 'createOpenQuestionLambda', {
      runtime: lambda.Runtime.JAVA_11,
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      handler: 'handler.Handler::handle',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../lambdas/createOpenQuestionLambda/target/scala-3.0.1/lambda-scala-seed.jar')),
    });

    const createOpenQuestionQueue = new sqs.Queue(this, 'create-open-question-queue', {fifo: true});

    const openQuestionTopic = new sns.Topic(this, 'open-question-topic', {
      topicName: 'open-question-topic',
      displayName: 'Open Question Topic',
      fifo: true,
      contentBasedDeduplication: true
    });

    openQuestionTopic.addSubscription(new subs.SqsSubscription(createOpenQuestionQueue));

    commitOpenQuestionLambda.addToRolePolicy(new PolicyStatement({
      resources: ["arn:aws:dynamodb:eu-central-1:532688539985:table/OpenQuestionDraft-bz5o7yvpwbdijnygi4gs2ns4ui-prod"],
      actions: ["dynamodb:GetItem"]
    }))

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


    new cdk.CfnOutput(this, 'URL', {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      value: httpApi.url + "commitOpenQuestion",
    });
    new cdk.CfnOutput(this, 'openQuestionTopicArn', {
      value: openQuestionTopic.topicArn,
      description: 'The arn of the open-question SNS topic',
    });
  }
}
