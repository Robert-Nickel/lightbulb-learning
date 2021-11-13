package com.myorg;

import java.util.Arrays;

import software.amazon.awscdk.core.CfnOutput;
import software.amazon.awscdk.core.Construct;
import software.amazon.awscdk.core.Duration;
import software.amazon.awscdk.core.Stack;
import software.amazon.awscdk.core.StackProps;
import software.amazon.awscdk.services.apigatewayv2.AddRoutesOptions;
import software.amazon.awscdk.services.apigatewayv2.CorsPreflightOptions;
import software.amazon.awscdk.services.apigatewayv2.HttpApi;
import software.amazon.awscdk.services.apigatewayv2.HttpMethod;
import software.amazon.awscdk.services.apigatewayv2.LambdaProxyIntegration;
import software.amazon.awscdk.services.lambda.Code;
import software.amazon.awscdk.services.lambda.Function;
import software.amazon.awscdk.services.lambda.Runtime;

public class InfrastructureStack extends Stack {
    public InfrastructureStack(final Construct scope, final String id) {
        this(scope, id, null);
    }

    public InfrastructureStack(final Construct scope, final String id, final StackProps props) {
        super(scope, id, props);

        final Function commitOpenQuestionLambda = Function.Builder.create(this, "commitOpenQuestion")
                .runtime(Runtime.JAVA_11).timeout(Duration.seconds(30))
                .code(Code.fromAsset("../commitOpenQuestionLambda/target/scala-3.0.1/lambda-scala-seed.jar"))
                .handler("handler.Handler::handle").build();

        final HttpApi httpApi = HttpApi.Builder.create(this, "lightbulb-learning-api-gateway")
                .corsPreflight(CorsPreflightOptions.builder().allowOrigins(Arrays.asList("*"))
                        .allowMethods(Arrays.asList(HttpMethod.POST, HttpMethod.OPTIONS))
                        .allowHeaders(Arrays.asList("Content-Type")).build())
                .build();

        httpApi.addRoutes(AddRoutesOptions.builder().path("/commitOpenQuestion")
                .methods(Arrays.asList(HttpMethod.POST, HttpMethod.OPTIONS))
                .integration(LambdaProxyIntegration.Builder.create().handler(commitOpenQuestionLambda).build())
                .build());

        CfnOutput.Builder.create(this, "URL").value(httpApi.getUrl() + "commitOpenQuestion").build();
    }
}
