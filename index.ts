import * as awsx from "@pulumi/awsx";
// import { FargateService } from "@lib-server/fargate-service";

const lb = {
    nginx: new awsx.lb.NetworkListener("nginx", { port: 80 }),
    express: new awsx.lb.NetworkListener("express", { port: 8080 })
};

const service = new awsx.ecs.FargateService("chu-redemption-spike", {
    desiredCount: 2,
    taskDefinitionArgs: {
        containers: {
            nginx: {
                image: awsx.ecs.Image.fromPath("client", "./client"),
                memory: 512,
                portMappings: [ lb.nginx ],
            },
            express: {
                image: awsx.ecs.Image.fromPath("server", "./server"),
                memory: 2048,
                portMappings: [ lb.express ],
            }
        },
    },
});

// Export the URL so we can easily access it.
export const url = lb.nginx.endpoint.hostname;

// // Create an AWS resource (S3 Bucket)
// const bucket = new aws.s3.Bucket("chu-redemption-spike-bucket");
//
// // Export the name of the bucket
// export const bucketName = bucket.id;
