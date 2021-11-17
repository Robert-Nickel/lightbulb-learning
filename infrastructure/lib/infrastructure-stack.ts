import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as path from 'path';
import { PolicyStatement } from '@aws-cdk/aws-iam';
import { CorsHttpMethod, HttpApi, HttpMethod } from '@aws-cdk/aws-apigatewayv2';
import { LambdaProxyIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';
import * as sns from '@aws-cdk/aws-sns';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import { Aspects } from '@aws-cdk/core';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const topic = new sns.Topic(this, 'sns-topic', {
        displayName: 'My SNS topic',
    });

    const table = new dynamodb.Table(this, 'DemoTestTable2', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
    });

    // Adding tags
    Aspects.of(table).add(new cdk.Tag("user:Application", "lightbulblearningapp"))
    Aspects.of(table).add(new cdk.Tag("user:Stack", "prod"))

    const commitOpenQuestionLambda = new lambda.Function(this, 'commitOpenQuestion', {
      runtime: lambda.Runtime.JAVA_11,
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      handler: 'handler.Handler::handle',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../commitOpenQuestionLambda/target/scala-3.0.1/lambda-scala-seed.jar')),
    });

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
  }
}
