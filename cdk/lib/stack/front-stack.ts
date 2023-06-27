import { aws_cloudfront, aws_cloudfront_origins, aws_s3, aws_iam, aws_ec2, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NetworkStack } from './network-stack';

export class FrontStack extends Stack {
  public readonly stackProps: FrontStackProps;
  constructor(scope: Construct, id: string, props?: FrontStackProps) {
    super(scope, id, props);
    const context = this.node.tryGetContext('environment')

    const staticResourceBucket = new aws_s3.Bucket(this, 'Bucket', {
      bucketName: context.serviceName+"-static-resource"
    });

    const cfnOriginAccessControl = new aws_cloudfront.CfnOriginAccessControl(this, 'OriginAccessControl', {
      originAccessControlConfig: {
        name: 'OriginAccessControlForstaticResourceBucket',
        originAccessControlOriginType: 's3',
        signingBehavior: 'always',
        signingProtocol: 'sigv4',
        description: 'Access Control',
      },
    });

    const distribution = new aws_cloudfront.Distribution(this, 'distribution', {
      comment: context.serviceName,
      defaultRootObject: 'index.html',
      defaultBehavior: {
        allowedMethods: aws_cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        cachedMethods: aws_cloudfront.CachedMethods.CACHE_GET_HEAD,
        cachePolicy: aws_cloudfront.CachePolicy.CACHING_OPTIMIZED,
        viewerProtocolPolicy: aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        origin: new aws_cloudfront_origins.S3Origin(staticResourceBucket),
      },
//      additionalBehaviors: {
//        '/api/': {
//          allowedMethods: aws_cloudfront.AllowedMethods.ALLOW_ALL,
//          cachePolicy: aws_cloudfront.CachePolicy.CACHING_DISABLED,
//          viewerProtocolPolicy: aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
//          origin: new aws_cloudfront_origins.LoadBalancerV2Origin(lb)
//        },
//      },
    });

    // OAIをOACへ変更
    const cfnDistribution = distribution.node.defaultChild as aws_cloudfront.CfnDistribution;
    cfnDistribution.addPropertyOverride('DistributionConfig.Origins.0.S3OriginConfig.OriginAccessIdentity', '');
    cfnDistribution.addPropertyOverride('DistributionConfig.Origins.0.OriginAccessControlId', cfnOriginAccessControl.attrId);

    const staticResourceBucketPolicyStatement = new aws_iam.PolicyStatement({
      actions: ['s3:GetObject'],
      effect: aws_iam.Effect.ALLOW,
      principals: [new aws_iam.ServicePrincipal('cloudfront.amazonaws.com'),],
      resources: [`${staticResourceBucket.bucketArn}/*`],
    });
    staticResourceBucketPolicyStatement.addCondition('StringEquals', {
      'AWS:SourceArn': `arn:aws:cloudfront::${context.accountId}:distribution/${distribution.distributionId}`
    })
    staticResourceBucket.addToResourcePolicy(staticResourceBucketPolicyStatement);
  }
}

export interface FrontStackProps extends StackProps {
  pubSubC: aws_ec2.Subnet;
  pubSubD: aws_ec2.Subnet;
}
