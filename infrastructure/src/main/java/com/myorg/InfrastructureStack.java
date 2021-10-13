package com.myorg;

import software.amazon.awscdk.core.Construct;
import software.amazon.awscdk.core.Duration;
import software.amazon.awscdk.core.Stack;
import software.amazon.awscdk.core.StackProps;
import software.amazon.awscdk.services.lambda.Code;
import software.amazon.awscdk.services.lambda.Function;
import software.amazon.awscdk.services.lambda.Runtime;

public class InfrastructureStack extends Stack {
    public InfrastructureStack(final Construct scope, final String id) {
        this(scope, id, null);
    }

    public InfrastructureStack(final Construct scope, final String id, final StackProps props) {
        super(scope, id, props);

        final Function someLambda = Function.Builder
        .create(this, "some-lambda")
        .runtime(Runtime.JAVA_11)
        .timeout(Duration.seconds(30))
        .code(Code.fromAsset("../some-lambda/target/scala-3.0.1/lambda-scala-seed.jar"))
        .handler("handler.Handler::handle")
        .build();
    }
}
