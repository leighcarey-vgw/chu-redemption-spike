import * as awsx from "@pulumi/awsx";
// import { FargateService } from "@lib-server/fargate-service";

const loadBalancer = new awsx.lb.ApplicationLoadBalancer("chu-redemption-spike");
const listener = loadBalancer.createListener("alb-listener", { port: 80 });

const apiTargetGroup = loadBalancer.createTargetGroup("api-target-group", { port: 80 });
listener.addListenerRule("api-routing", {
    conditions: [{
        pathPattern: {
            values: ["/api/*"],
        },
    }],
    actions: [{
        type: "forward",
        targetGroupArn: apiTargetGroup.targetGroup.arn,
    }],
});

const service = new awsx.ecs.FargateService("chu-redemption-spike", {
    desiredCount: 2,
    taskDefinitionArgs: {
        containers: {
            nginx: {
                image: awsx.ecs.Image.fromDockerBuild("client", { dockerfile: "./config/client.dockerfile" }),
                memory: 512,
                portMappings: [ listener ],
            },
            express: {
                image: awsx.ecs.Image.fromDockerBuild("server", { dockerfile: "./config/server.dockerfile" }),
                memory: 2048,
                portMappings: [ apiTargetGroup ],
            }
        },
    },
});

// Export the URL so we can easily access it.
export const url = listener.endpoint.hostname;
