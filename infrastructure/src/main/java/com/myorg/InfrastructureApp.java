package com.myorg;

import software.amazon.awscdk.core.App;
import software.amazon.awscdk.core.Environment;
import software.amazon.awscdk.core.StackProps;

import java.util.Arrays;

public class InfrastructureApp {
    public static void main(final String[] args) {
        App app = new App();

        new InfrastructureStack(app, "InfrastructureStack", StackProps.builder()
                .env(Environment.builder()
                        .account(System.getenv("CDK_DEFAULT_ACCOUNT"))
                        .region(System.getenv("CDK_DEFAULT_REGION"))
                        .build())
               
                .build());
        app.synth();
    }
}
