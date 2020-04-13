import * as awsx from "@pulumi/awsx";
// import { FargateService } from "@lib-server/fargate-service";

const loadBalancer = new awsx.lb.ApplicationLoadBalancer("chu-redemption-spike");
const mappings = {
    nginx: loadBalancer.createListener("nginx", { port: 80 }),
    express: loadBalancer.createListener("express", { port: 8080 })
};

const service = new awsx.ecs.FargateService("chu-redemption-spike", {
    desiredCount: 2,
    taskDefinitionArgs: {
        containers: {
            nginx: {
                image: awsx.ecs.Image.fromPath("client", "./client"),
                memory: 512,
                portMappings: [ mappings.nginx ],
            },
            express: {
                image: awsx.ecs.Image.fromPath("server", "./server"),
                memory: 2048,
                portMappings: [ mappings.express ],
            }
        },
    },
});

// Export the URL so we can easily access it.
export const clientUrl = mappings.nginx.endpoint.hostname;
export const serverUrl = mappings.express.endpoint.hostname;

// // Create an AWS resource (S3 Bucket)
// const bucket = new aws.s3.Bucket("chu-redemption-spike-bucket");
//
// // Export the name of the bucket
// export const bucketName = bucket.id;
